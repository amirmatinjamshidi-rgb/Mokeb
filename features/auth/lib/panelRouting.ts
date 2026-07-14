import { ROUTES } from "@/features/shared/config/navigation";

export const BOSS_PANEL_BASE = "/Boss" as const;

export const BOSS_ADD_KARVAN_PATH = `${BOSS_PANEL_BASE}/Add-Karvan` as const;

export const BOSS_KARVAN_MANAGEMENT_PATH =
  `${BOSS_PANEL_BASE}/Karvan-Management` as const;

export const CARAVAN_BOSS_REGISTER = "caravan-boss" as const;

function sanitizeReturnPath(
  path: string,
  fallback: string = BOSS_KARVAN_MANAGEMENT_PATH,
): string {
  const p = path.trim() || fallback;
  if (!p.startsWith("/") || p.startsWith("//")) return fallback;
  return p;
}

/**
 * Open the shared login page in caravan-boss mode, then return to `returnPath`
 * after successful `authApi.caravanLogin` (see `useAuthStore.login(..., "caravan")`).
 */
export function buildCaravanBossLoginUrl(
  returnPath: string = BOSS_KARVAN_MANAGEMENT_PATH,
): string {
  const safe = sanitizeReturnPath(returnPath, BOSS_KARVAN_MANAGEMENT_PATH);
  const q = new URLSearchParams();
  q.set("register", CARAVAN_BOSS_REGISTER);
  q.set("returnUrl", safe);
  return `${ROUTES.login}?${q.toString()}`;
}

/** Shared login page for individual users (e.g. general reservation). */
export function buildIndividualLoginUrl(
  returnPath: string = ROUTES.userProfile,
): string {
  const safe = sanitizeReturnPath(returnPath, ROUTES.userProfile);
  const q = new URLSearchParams();
  q.set("returnUrl", safe);
  return `${ROUTES.login}?${q.toString()}`;
}

export function resolveCaravanReservationHref(s: AppAuthSnapshot): string {
  return isCaravanBossSession(s)
    ? BOSS_ADD_KARVAN_PATH
    : buildCaravanBossLoginUrl(BOSS_ADD_KARVAN_PATH);
}

export function resolveGeneralReservationHref(isAuthenticated: boolean): string {
  return isAuthenticated
    ? ROUTES.generalReservation
    : buildIndividualLoginUrl(ROUTES.generalReservation);
}

export type AppAuthSnapshot = {
  user: { name?: string; phone?: string } | null;
  token: string | null;
  principalType: "individual" | "caravan" | "admin" | null;
};

export function isCaravanBossSession(s: AppAuthSnapshot): boolean {
  return Boolean(s.token && s.principalType === "caravan" && s.user);
}

export function isIndividualUserSession(s: AppAuthSnapshot): boolean {
  return Boolean(s.token && s.principalType === "individual" && s.user);
}
