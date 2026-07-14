"use client";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { ROUTES } from "@/features/shared/config/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {

  BOSS_KARVAN_MANAGEMENT_PATH,

  buildIndividualLoginUrl,

  isCaravanBossSession,

  isIndividualUserSession,

} from "@/features/auth/lib/panelRouting";

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



  useEffect(() => {

    if (!hydrated) return;



    if (isBoss) {

      router.replace(BOSS_KARVAN_MANAGEMENT_PATH);

      return;

    }



    if (!isIndividual) {

      router.replace(buildIndividualLoginUrl(pathname));

    }

  }, [hydrated, isBoss, isIndividual, pathname, router]);



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



  if (isBoss || !isIndividual) return null;



  return <>{children}</>;

}


