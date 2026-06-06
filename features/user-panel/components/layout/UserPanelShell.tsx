"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, PanelRightClose } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { ROUTES } from "@/features/shared/config/navigation";
import { cn } from "@/features/shared/lib/utils";
import { USER_PANEL_NAV } from "../../config/nav";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { SidebarNav } from "./SidebarNav";

type Props = {
  children: ReactNode;
};

const sidebarSurfaceClass =
  "flex w-[268px] max-w-[88vw] shrink-0 flex-col gap-10 rounded-tl-2xl rounded-bl-2xl bg-[#71A792] px-4 py-10";

export function UserPanelShell({ children }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    router.push(ROUTES.home);
    router.refresh();
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarContent = (
    <>
      <div className="flex min-h-36 w-59 max-w-full flex-col items-center gap-6 ps-4">
        <Link
          href={ROUTES.home}
          onClick={closeMobile}
          className="flex w-full flex-col items-center gap-6 outline-none"
        >
          <Image
            src="/Logo.png"
            alt="موکب"
            width={56}
            height={56}
            className="size-14 object-contain"
          />
          <div className="flex h-16 w-[220px] max-w-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-base font-bold leading-6 text-white">
              پنل کاربری
            </p>
            <p className="truncate text-sm font-medium leading-5 text-white/95">
              {user?.name ?? "زائر گرامی"}
            </p>
          </div>
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <SidebarNav items={USER_PANEL_NAV} onNavigate={closeMobile} />
      </div>
      {/* 
      <SidebarActionButton
        label={LOGOUT_ITEM.label}
        icon={LOGOUT_ITEM.icon}
        onClick={handleLogout}
      /> */}
    </>
  );

  return (
    <div className="flex min-h-dvh w-full bg-[#F5F9F6]" dir="rtl">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
        onClick={closeMobile}
      />

      <aside
        className={cn(
          sidebarSurfaceClass,
          "relative fixed inset-y-0 right-0 z-50 shadow-2xl transition-transform lg:static lg:z-0 lg:sticky lg:top-0 lg:h-dvh lg:max-h-[1024px] lg:translate-x-0 lg:shadow-none",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <button
          type="button"
          className="absolute end-4 top-4 rounded-lg p-2 text-white hover:bg-white/15 lg:hidden"
          aria-label="بستن منو"
          onClick={closeMobile}
        >
          <PanelRightClose className="size-5" />
        </button>
        {sidebarContent}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-black/5 bg-white/95 px-4 backdrop-blur sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-[#175E47] hover:bg-[#F5F9F6] lg:hidden"
              aria-label="باز کردن منو"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-6" />
            </button>
            <span className="truncate text-sm font-semibold text-[#175E47] sm:text-base">
              سامانه رزرو موکب
            </span>
          </div>
          <Link
            href={ROUTES.generalReservation}
            className="shrink-0 rounded-xl bg-[#175E47] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1F7E5F] sm:px-4 sm:text-sm"
            onClick={closeMobile}
          >
            رزرو جدید
          </Link>
        </header>

        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
