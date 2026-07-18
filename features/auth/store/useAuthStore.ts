import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiError, setAuthToken } from "@/lib/api/client";
import { authApi, caravanApi, individualApi } from "@/lib/api";
import { persianDateToIsoDate } from "@/lib/api/dateFormat";
import {
  bloodTypeToApi,
  genderToApi,
  individualToUserProfile,
} from "@/lib/api/mappers";
import type {
  CaravanSignInCommand,
  IndividualSignInCommand,
} from "@/lib/api/types";
import type { UserProfile } from "@/features/user-panel/types";

export type PrincipalType = "individual" | "caravan" | "admin";

export type SignUpInput = {
  type: "individual" | "caravan";
  username: string;
  password: string;
  name: string;
  familyName: string;
  nationalCode: string;
  dateOfBirth: string;
  gender: "male" | "female";
  passportNumber: string;
  gmail: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  bloodType: string;
};

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  principalId: string | null;
  principalType: PrincipalType | null;
  login: (
    username: string,
    password: string,
    type?: PrincipalType,
  ) => Promise<{ ok: boolean; error?: string }>;
  /** Registers via SignIn API (no session). User must login afterwards. */
  signUp: (
    input: SignUpInput,
  ) => Promise<{ ok: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  /** Clears token + persisted session locally (no server call). Use for «ورود از نو». */
  clearSessionLocal: () => void;
  updateProfile: (patch: Partial<Omit<UserProfile, "id">>) => void;
  hydrateToken: () => void;
};

function toSignInCommand(input: SignUpInput): IndividualSignInCommand {
  const blood = bloodTypeToApi(input.bloodType);
  // Backend marks these [Required] even when OpenAPI says nullable — never omit/null.
  return {
    name: input.name.trim(),
    familyName: input.familyName.trim(),
    nationalCode: input.nationalCode.trim(),
    dateOfBirth: persianDateToIsoDate(input.dateOfBirth) || input.dateOfBirth,
    gender: genderToApi(input.gender),
    passportNumber: input.passportNumber.trim(),
    gmail: input.gmail?.trim() ?? "",
    phoneNumber: input.phoneNumber.trim(),
    emergencyPhoneNumber: input.emergencyPhoneNumber.trim(),
    username: input.username.trim(),
    password: input.password,
    bloodType: blood,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      principalId: null,
      principalType: null,

      hydrateToken: () => {
        setAuthToken(get().token);
      },

      signUp: async (input) => {
        try {
          const body = toSignInCommand(input);
          const result =
            input.type === "caravan"
              ? await authApi.caravanSignIn(body as CaravanSignInCommand)
              : await individualApi.individualSignIn(body);

          // SignIn returns plain text (e.g. "Caravan Added Successfully"), not a JWT.
          if (result.token) {
            // Some backends may return a token; still do not auto-login —
            // product flow is register → then login.
          }

          return {
            ok: true,
            message:
              result.message ||
              (input.type === "caravan"
                ? "ثبت‌نام کاروان با موفقیت انجام شد."
                : "ثبت‌نام با موفقیت انجام شد."),
          };
        } catch (err) {
          if (err instanceof ApiError) {
            // Proxy/network failures (backend down) often surface as 502/503/504 or empty 500.
            if (
              err.status === 502 ||
              err.status === 503 ||
              err.status === 504 ||
              (err.status === 500 &&
                (!err.message ||
                  /proxy|ETIMEDOUT|ECONNREFUSED|Failed to proxy/i.test(
                    err.message,
                  )))
            ) {
              return {
                ok: false,
                error:
                  "اتصال به سرور برقرار نشد. لطفاً بعداً دوباره تلاش کنید.",
              };
            }
            if (err.status === 500) {
              return {
                ok: false,
                error:
                  "ثبت‌نام ناموفق بود. ممکن است نام کاربری تکراری باشد یا اطلاعات نامعتبر باشد.",
              };
            }
          }
          const message =
            err instanceof Error ? err.message : "ثبت‌نام ناموفق بود.";
          return { ok: false, error: message };
        }
      },

      login: async (username, password, type = "individual") => {
        const trimmedUser = username.trim();
        if (!trimmedUser || password.length < 4) {
          return { ok: false, error: "نام کاربری یا رمز عبور نامعتبر است." };
        }

        try {
          let principalId = "";
          let token = "";

          if (type === "admin") {
            const res = await authApi.adminLogin({
              username: trimmedUser,
              password,
            });
            principalId = res.principalId;
            token = res.token;
          } else if (type === "caravan") {
            const res = await authApi.caravanLogin({
              username: trimmedUser,
              password,
            });
            principalId = res.principalId;
            token = res.token;
          } else {
            const res = await individualApi.individualLogin({
              username: trimmedUser,
              password,
            });
            principalId = res.principalId;
            token = res.token;
          }

          if (!token || !principalId) {
            return { ok: false, error: "پاسخ سرور نامعتبر است." };
          }

          setAuthToken(token);

          let user: UserProfile = {
            id: principalId,
            name: trimmedUser,
            phone: type === "individual" ? trimmedUser : "",
            email: "",
          };

          if (type === "individual") {
            try {
              const profile = await individualApi.getIndividual(principalId);
              user = individualToUserProfile(profile);
            } catch {
              // Profile fetch is optional right after login
            }
          } else if (type === "caravan") {
            try {
              const profile = await caravanApi.getCaravan(principalId);
              user = individualToUserProfile(profile);
            } catch {
              // Profile fetch is optional right after login
            }
          }

          set({
            user,
            token,
            principalId,
            principalType: type,
          });

          return { ok: true };
        } catch (err) {
          // The backend answers wrong credentials with an empty 500/401 body.
          if (
            err instanceof ApiError &&
            (err.status === 500 || err.status === 401)
          ) {
            return { ok: false, error: "نام کاربری یا رمز عبور اشتباه است." };
          }
          const message =
            err instanceof Error ? err.message : "ورود ناموفق بود.";
          return { ok: false, error: message };
        }
      },

      logout: async () => {
        const { principalId, principalType, token } = get();
        if (principalId && token) {
          try {
            const body = { id: principalId };
            if (principalType === "admin") {
              await authApi.adminLogout(principalId, body);
            } else if (principalType === "caravan") {
              await authApi.caravanLogout(principalId, body);
            } else {
              await individualApi.individualLogout(principalId, body);
            }
          } catch {
            // Clear local session even if server logout fails
          }
        }
        setAuthToken(null);
        set({
          user: null,
          token: null,
          principalId: null,
          principalType: null,
        });
      },

      clearSessionLocal: () => {
        setAuthToken(null);
        set({
          user: null,
          token: null,
          principalId: null,
          principalType: null,
        });
        void useAuthStore.persist.clearStorage();
      },

      updateProfile: (patch) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...patch } });
      },
    }),
    {
      name: "mokeb-user-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        principalId: state.principalId,
        principalType: state.principalType,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    },
  ),
);

export function useIsAuthenticated() {
  return useAuthStore((s) => s.user !== null && s.token !== null);
}
