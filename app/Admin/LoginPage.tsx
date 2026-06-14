"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Login from "@admin-kit/Login/Login";
import { useAuthStore } from "@admin-kit/shared/store/authStore";
import { ROUTES } from "@admin-kit/navigation/routes";

function LoginBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh w-full items-center justify-center p-4" dir="rtl">
      <Image
        src="/Loginbg.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-[rgba(92,147,125,0.82)]"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-[384px]">{children}</div>
    </div>
  );
}

export function LoginPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;
    router.replace(ROUTES.dashboard);
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <LoginBackground>
        <p className="text-center text-sm text-white/90">در حال بارگذاری...</p>
      </LoginBackground>
    );
  }

  if (user) return null;

  return (
    <LoginBackground>
      <Login />
    </LoginBackground>
  );
}
