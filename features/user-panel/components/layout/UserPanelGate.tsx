"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/features/shared/config/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

type Props = {
  children: ReactNode;
};

export function UserPanelGate({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      const q = `returnUrl=${encodeURIComponent(pathname)}`;
      router.replace(`${ROUTES.login}?${q}`);
    }
  }, [hydrated, user, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F5F9F6]" dir="rtl">
        <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
