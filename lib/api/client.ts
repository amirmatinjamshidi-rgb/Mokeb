import type { ApiEnvelope } from "./types";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.API_URL ?? "/api/backend";
  }
  return "/api/backend";
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

function pickEnvelopeError(data: ApiEnvelope<unknown> & Record<string, unknown>): string | null {
  const errors = data.errors ?? data.Errors;
  if (Array.isArray(errors) && errors.length > 0) {
    return errors.join("، ");
  }
  // ASP.NET ProblemDetails: { errors: { Field: ["msg"] } }
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const messages = Object.values(errors as Record<string, unknown>)
      .flatMap((v) => (Array.isArray(v) ? v : [v]))
      .filter((m): m is string => typeof m === "string" && m.trim().length > 0);
    if (messages.length > 0) {
      return messages.join("، ");
    }
  }
  if (typeof data.title === "string" && data.title.trim()) {
    return data.title;
  }
  return data.errorMessage ?? data.ErrorMessage ?? null;
}

export function unwrapApiResult<T>(data: unknown): T {
  if (data === null || data === undefined) {
    return data as T;
  }
  if (typeof data !== "object") {
    return data as T;
  }
  const envelope = data as ApiEnvelope<T> & Record<string, unknown>;
  const success = envelope.success ?? envelope.Success;
  if (success === false) {
    throw new ApiError(
      pickEnvelopeError(envelope) ?? "درخواست ناموفق بود.",
      400,
      data,
    );
  }

  const result = envelope.result ?? envelope.Result;
  const response = envelope.response ?? envelope.Response;

  // Boolean Result is a success flag — keep the full payload so RequestId/Id remain.
  if (typeof result === "boolean") {
    return data as T;
  }

  if (result !== undefined) {
    return result as T;
  }
  if (response !== undefined) {
    return response as T;
  }
  return data as T;
}

export type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
  /** Skip JSON Content-Type (e.g. multipart). */
  rawBody?: BodyInit;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, headers = {}, rawBody } = options;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const requestHeaders: Record<string, string> = { ...headers };
  const bearer = token ?? authToken;
  if (bearer) {
    requestHeaders.Authorization = `Bearer ${bearer}`;
  }

  let payload: BodyInit | undefined;
  if (rawBody !== undefined) {
    payload = rawBody;
  } else if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: payload,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("json");
  // Some endpoints (e.g. Caravan/Login) reply with a bare JWT or a plain
  // success message as text/plain, so non-JSON bodies must be kept too.
  let parsed: unknown = null;
  if (isJson) {
    parsed = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => "");
    parsed = text.trim().length > 0 ? text.trim() : null;
  }

  if (!response.ok) {
    const envelopeError =
      parsed && typeof parsed === "object"
        ? pickEnvelopeError(parsed as ApiEnvelope<unknown>)
        : null;
    const rawText = typeof parsed === "string" ? parsed : null;
    // Proxy misconfig (missing API_URL) returns Next.js HTML 404 pages.
    const looksLikeHtml =
      contentType.includes("text/html") ||
      (rawText != null && /^\s*</.test(rawText));
    const message =
      envelopeError ??
      (looksLikeHtml
        ? response.status === 404
          ? "اتصال به سرور برقرار نشد. مسیر API یافت نشد."
          : `خطای سرور (${response.status})`
        : null) ??
      rawText ??
      `خطای سرور (${response.status})`;
    throw new ApiError(message, response.status, parsed);
  }

  if (parsed === null) {
    return undefined as T;
  }
  return unwrapApiResult<T>(parsed);
}
