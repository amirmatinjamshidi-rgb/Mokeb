import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile } from "@/boss-features/types";
type AuthState = {
  user: UserProfile | null;
  /** Mock login: any Iranian mobile + password length ≥ 4 */
  login: (phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (patch: Partial<Omit<UserProfile, "id">>) => void;
};

const defaultUser = (phone: string): UserProfile => ({
  id: "u-1",
  name: "زائر گرامی",
  phone,
  email: "",
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (phone, password) => {
        const normalized = phone.replace(/\s/g, "");
        if (!/^09\d{9}$/.test(normalized) || password.length < 4) {
          return false;
        }
        set({ user: defaultUser(normalized) });
        return true;
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, ...patch } });
      },
    }),
    { name: "mokeb-boss-mock-auth" },
  ),
);

export function useIsAuthenticated() {
  return useAuthStore((s) => s.user !== null);
}
