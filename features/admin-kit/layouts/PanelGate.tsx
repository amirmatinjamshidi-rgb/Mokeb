"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@admin-kit/navigation/routes";
import { useAuthStore } from "@admin-kit/shared/store/authStore";

type Props = {
  children: ReactNode;
};


// TEMP: disable admin auth gate for local UI testing — set back to `true` before shipping.
const LOGIN_REQUIRED = false;

export function PanelGate({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHydrated(true),
    );
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!LOGIN_REQUIRED) return;
    if (!hydrated) return;
    if (!user) {
      const q = `returnUrl=${encodeURIComponent(pathname)}`;
      router.replace(`${ROUTES.login}?${q}`);
    }
  }, [hydrated, user, pathname, router]);

  if (LOGIN_REQUIRED) {
    if (!hydrated) {
      return (
        <div
          className="flex min-h-dvh items-center justify-center bg-[#F5F9F6]"
          dir="rtl"
        >
          <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
        </div>
      );
    }
    if (!user) return null;
  }

  return <>{children}</>;
}

/** @deprecated Use PanelGate */
export const UserPanelGate = PanelGate;
