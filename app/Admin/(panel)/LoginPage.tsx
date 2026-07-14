"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Login from "@admin-kit/Login/Login";
import LoginBackground from "@admin-kit/layouts/LoginBackground";
import { ROUTES } from "@admin-kit/navigation/routes";
import { useAuthStore } from "@admin-kit/shared/store/authStore";

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
