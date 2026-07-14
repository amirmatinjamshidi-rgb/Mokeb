"use client";

import { Bell, Bolt, Menu } from "lucide-react";
import Image from "next/image";

import { NavbarSearchField } from "@admin-kit/ui/NavbarSearchField";

type Props = {
  userName?: string;
  avatarSrc?: string;
  onMenuToggle?: () => void;
  menuOpen?: boolean;
};

export function NavBar({
  userName = "مدیر سیستم",
  avatarSrc = "/profile-panel.jpg",
  onMenuToggle,
  menuOpen = false,
}: Props) {
  return (
    <div
      dir="rtl"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-4 rounded-tl-2xl rounded-tr-2xl bg-white px-4 shadow-xs shadow-gray-300 sm:px-8 lg:h-[72px] lg:px-10"
    >
      <button
        type="button"
        className="shrink-0 rounded-lg p-2 text-[#61756F] transition-colors hover:bg-[#F5F9F6] lg:hidden"
        aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
        aria-expanded={menuOpen}
        onClick={onMenuToggle}
      >
        <Menu className="size-5" aria-hidden />
      </button>

      <div className="hidden min-w-0 flex-1 lg:block lg:max-w-md">
        <NavbarSearchField />
      </div>

      <div className="flex shrink-0 items-center gap-x-3 sm:gap-x-5 lg:gap-x-7">
        <Bolt stroke="#61756F" className="size-5 shrink-0" aria-hidden />
        <Bell
          className="size-5 shrink-0 cursor-pointer text-[#61756F]"
          aria-hidden
        />
        <div className="flex items-center gap-x-2 sm:gap-x-3">
          <p className="hidden text-xs text-gray-500 sm:block">{userName}</p>
          <Image
            src={avatarSrc}
            alt="Profile"
            width={32}
            height={32}
            className="size-8 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
