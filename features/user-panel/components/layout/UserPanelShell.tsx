"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, PanelRightClose } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { NavBar } from "@admin-kit/layouts/NavBar";
import {
  SidebarActionButton,
  SidebarNav,
} from "@admin-kit/layouts/SidebarNav";
import { NavbarSearchField } from "@admin-kit/ui/NavbarSearchField";

import { ROUTES } from "@/features/shared/config/navigation";
import { cn } from "@/features/shared/lib/utils";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { LOGOUT_NAV_HREF, USER_PANEL_NAV } from "../../config/nav";

type Props = {
  children: ReactNode;
};

const sidebarSurfaceClass =
  "flex w-[268px] max-w-[88vw] shrink-0 flex-col gap-12 rounded-tl-2xl rounded-bl-2xl bg-[#4C7A68] py-10";

export function UserPanelShell({ children }: Props) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const navItems = USER_PANEL_NAV.filter(
    (item) => item.href !== LOGOUT_NAV_HREF,
  );

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    closeSidebar();
    try {
      await logout();
    } finally {
      router.replace(ROUTES.home);
      router.refresh();
      setLoggingOut(false);
    }
  };

  const sidebarContent = (
    <>
      <div className="flex min-h-36 w-59 max-w-full flex-col items-center gap-6 ps-4">
        <Link
          href={ROUTES.home}
          onClick={closeSidebar}
          className="flex w-full flex-col items-center gap-6 outline-none"
        >
          <Image
            src="/Logo-white.png"
            alt="موکب"
            width={56}
            height={56}
            className="size-14 object-contain"
          />
          <div className="flex h-16 w-55 max-w-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-base font-bold leading-6 text-white">
              پنل کاربری
            </p>
            <p className="truncate text-sm font-medium leading-5 text-white/95">
              {user?.name ?? "زائر گرامی"}
            </p>
          </div>
        </Link>
      </div>

      <div className="w-full px-5 lg:hidden">
        <NavbarSearchField
          inputClassName="border-white/20 bg-white/10 text-white placeholder:text-white/70 focus:border-white/40"
          iconClassName="text-white/80"
        />
      </div>

      <div className="min-h-0 w-full flex-1 overflow-x-visible overflow-y-auto">
        <SidebarNav items={navItems} onNavigate={closeSidebar} />
        <SidebarActionButton
          label={loggingOut ? "در حال خروج…" : "خروج از پنل"}
          icon={LogOut}
          onClick={() => void handleLogout()}
        />
      </div>
    </>
  );

  return (
    <div className="flex min-h-dvh w-full bg-[#F5F9F6]" dir="rtl">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden",
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!sidebarOpen}
        onClick={closeSidebar}
      />

      <aside
        className={cn(
          sidebarSurfaceClass,
          "fixed top-0 right-0 z-50 h-dvh overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:h-dvh lg:max-h-256 lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <button
          type="button"
          className="absolute end-4 top-4 rounded-lg p-2 text-white hover:bg-white/15 lg:hidden"
          aria-label="بستن منو"
          onClick={closeSidebar}
        >
          <PanelRightClose className="size-5" />
        </button>
        {sidebarContent}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col" dir="ltr">
        <NavBar
          menuOpen={sidebarOpen}
          onMenuToggle={toggleSidebar}
          userName={user?.name ?? "زائر گرامی"}
        />

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
