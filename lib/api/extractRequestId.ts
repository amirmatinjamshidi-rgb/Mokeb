/** Shared helpers for parsing reservation / request ids from API responses. */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function asIdString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

export function toReserveCode(requestId: string): string {
  return requestId.slice(0, 8).toUpperCase();
}

function isBooleanLike(value: unknown): boolean {
  return typeof value === "boolean";
}

export function extractRequestId(raw: unknown): string | null {
  if (typeof raw === "string") {
    const trimmed = raw.trim().replace(/^"|"$/g, "");
    // Ignore plain success messages from older API responses.
    if (!trimmed || trimmed === "true" || /موفق|success/i.test(trimmed)) {
      return null;
    }
    return trimmed;
  }
  if (!raw || typeof raw !== "object" || isBooleanLike(raw)) return null;
  const r = raw as Record<string, unknown>;
  const candidates = [
    r.requestId,
    r.RequestId,
    r.id,
    r.Id,
    r.reservationCode,
    r.ReservationCode,
  ];
  for (const value of candidates) {
    if (isBooleanLike(value)) continue;
    const nested = extractRequestId(value);
    if (nested) return nested;
    const direct = asIdString(value);
    if (direct && (UUID_RE.test(direct) || direct.length >= 6)) return direct;
  }
  // Nested envelopes last (avoid grabbing boolean Result: true).
  for (const value of [r.result, r.Result, r.response, r.Response, r.data, r.Data]) {
    if (isBooleanLike(value)) continue;
    const nested = extractRequestId(value);
    if (nested) return nested;
  }
  return null;
}
