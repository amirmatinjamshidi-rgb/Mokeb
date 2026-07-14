import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken } from "@/lib/api/client";
import { authApi } from "@/lib/api";
import type { UserProfile } from "@admin-kit/shared/types";

type AuthState = {
  user: UserProfile | null;
  token: string | null;
  principalId: string | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<Omit<UserProfile, "id">>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      principalId: null,

      login: async (username, password) => {
        const name = username.trim();
        if (name.length < 1 || password.length < 4) {
          return { ok: false, error: "نام کاربری یا رمز عبور نامعتبر است." };
        }

        try {
          const { principalId, token } = await authApi.adminLogin({
            username: name,
            password,
          });

          if (!token || !principalId) {
            return { ok: false, error: "پاسخ سرور نامعتبر است." };
          }

          setAuthToken(token);
          set({
            user: { id: principalId, name, phone: "", email: "" },
            token,
            principalId,
          });
          return { ok: true };
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "ورود ناموفق بود.";
          return { ok: false, error: message };
        }
      },

      logout: async () => {
        const { principalId } = get();
        if (principalId) {
          try {
            await authApi.adminLogout(principalId, { id: principalId });
          } catch {
            // ignore
          }
        }
        setAuthToken(null);
        set({ user: null, token: null, principalId: null });
      },

      updateProfile: (patch) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...patch } });
      },
    }),
    {
      name: "mokeb-admin-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        principalId: state.principalId,
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
