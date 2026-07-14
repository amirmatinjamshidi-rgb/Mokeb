"use client";



import { useEffect, useState } from "react";

import type { ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useShallow } from "zustand/react/shallow";



import { useAuthStore } from "@/features/auth/store/useAuthStore";

import {

  BOSS_ADD_KARVAN_PATH,

  buildCaravanBossLoginUrl,

  isCaravanBossSession,

  isIndividualUserSession,

} from "@/features/auth/lib/panelRouting";

import { ROUTES } from "@/features/shared/config/navigation";



type Props = {

  children: ReactNode;

};



export function UserPanelGate({ children }: Props) {

  const router = useRouter();

  const pathname = usePathname();

  const { user, token, principalType } = useAuthStore(

    useShallow((s) => ({

      user: s.user,

      token: s.token,

      principalType: s.principalType,

    })),

  );

  const [hydrated, setHydrated] = useState(false);



  useEffect(() => {

    const unsub = useAuthStore.persist.onFinishHydration(() =>

      setHydrated(true),

    );

    if (useAuthStore.persist.hasHydrated()) setHydrated(true);

    return unsub;

  }, []);



  const snapshot = { user, token, principalType };

  const isIndividual = isIndividualUserSession(snapshot);

  const isBoss = isCaravanBossSession(snapshot);

  const isPublicBossRoute = pathname === BOSS_ADD_KARVAN_PATH;



  useEffect(() => {

    if (!hydrated) return;



    // UserPanel session cannot enter Boss until logout.

    if (isIndividual) {

      router.replace(ROUTES.home);

      return;

    }



    if (isPublicBossRoute) return;



    if (!isBoss) {

      router.replace(buildCaravanBossLoginUrl(pathname));

    }

  }, [

    hydrated,

    isIndividual,

    isBoss,

    isPublicBossRoute,

    pathname,

    router,

  ]);



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



  if (isIndividual) return null;

  if (!isPublicBossRoute && !isBoss) return null;



  return <>{children}</>;

}


