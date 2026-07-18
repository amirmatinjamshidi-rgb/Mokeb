import { apiRequest } from "./client";
import {
  adminLogInCommandSchema,
  caravanPrincipalLogInCommandSchema,
  caravanPrincipalSignInCommandSchema,
} from "./payloadSchemas";
import type {
  AdminLogInCommand,
  CaravanLogInCommand,
  CaravanSignInCommand,
  LoginResult,
  PrincipalsLogOutCommand,
} from "./types";

const NAME_ID_CLAIM =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const part = token.split(".")[1];
  if (!part) return null;
  try {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function normalizeLoginResult(raw: LoginResult | string | undefined): {
  principalId: string;
  token: string;
  message?: string;
} {
  if (typeof raw === "string") {
    const payload = decodeJwtPayload(raw);
    if (!payload) {
      // Plain text that isn't a JWT (e.g. "Caravan Added Successfully").
      return { principalId: "", token: "", message: raw };
    }
    const principalId =
      payload[NAME_ID_CLAIM] ?? payload.nameid ?? payload.sub ?? "";
    return { principalId: String(principalId), token: raw };
  }
  if (!raw) {
    return { principalId: "", token: "" };
  }
  return {
    principalId: raw.principalId ?? raw.PrincipalId ?? "",
    token: raw.jwsCode ?? raw.JwsCode ?? "",
  };
}

export async function adminLogin(body: AdminLogInCommand) {
  const payload = adminLogInCommandSchema.parse(body);
  const result = await apiRequest<LoginResult | string>("/Admin/Login", {
    method: "POST",
    body: payload,
  });
  return normalizeLoginResult(result);
}

export async function adminLogout(
  adminId: string,
  body: PrincipalsLogOutCommand,
) {
  return apiRequest<void>(`/Admin/${adminId}/LogOut`, {
    method: "POST",
    body,
  });
}

export async function caravanLogin(body: CaravanLogInCommand) {
  const payload = caravanPrincipalLogInCommandSchema.parse(body);
  const result = await apiRequest<LoginResult | string>("/Caravan/Login", {
    method: "POST",
    body: payload,
  });
  return normalizeLoginResult(result);
}

export async function caravanSignIn(body: CaravanSignInCommand) {
  const payload = caravanPrincipalSignInCommandSchema.parse(body);
  const result = await apiRequest<LoginResult | string>("/Caravan/SignIn", {
    method: "POST",
    body: payload,
  });
  return normalizeLoginResult(result);
}

export async function caravanLogout(
  caravanId: string,
  body: PrincipalsLogOutCommand,
) {
  return apiRequest<void>(`/Caravan/${caravanId}/LogOut`, {
    method: "POST",
    body,
  });
}
