"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { mainNavItems, ROUTES } from "@/features/shared/config/navigation";

const userPanelHref = ROUTES.userPanel;

const TRACKING_LINE_COLOR = "#DBBC59";

function pathMatchesNav(href: string, pathname: string) {
  if (href === ROUTES.home) {
    return pathname === "/Home" || pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathMatchesNav(href, pathname);

  return (
    <Link
      href={href}
      className={`
        group relative py-4 text-sm font-medium transition-colors
        hover:text-[#DBBC59]
        ${isActive ? "text-[#DBBC59]" : "text-white"}
      `}
    >
      {label}
      <span
        className={`absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ backgroundColor: TRACKING_LINE_COLOR }}
      />
    </Link>
  );
}

interface NavbarLoggedInProps {
  user?: {
    name: string;
    avatar?: string;
  };
}

const CONTACT_NUMBERS = [
  { display: "۰۹۰۰۰۰۰۰۰۰۰", value: "09000000000" },
  { display: "۰۲۱۱۲۳۴۵۶۷۸", value: "02112345678" },
];

function NavbarLoggedIn({ user = { name: "کاربر", avatar: "/default-avatar.png" } }: NavbarLoggedInProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full top-0 absolute z-50 bg-transparent">
      <div className="w-full mx-auto h-16 flex justify-between items-center px-6 text-white gap-4">
        <div className="hidden lg:flex items-center gap-10 order-1 flex-1 justify-end">
          {mainNavItems.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </div>

        <div className="flex items-center shrink-0 order-2">
          <Link href={ROUTES.home}>
            <Image
              alt="logo"
              src="/Logo.png"
              width={80}
              height={100}
              className="object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4 order-3 flex-1 justify-start">
          <div className="hidden md:block relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-1 text-sm hover:text-[#DBBC59] transition-colors"
            >
              <span>{CONTACT_NUMBERS[0].display}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute start-0 top-full z-50 mt-2 min-w-[160px] rounded-lg border border-white/10 bg-black/95 py-2 shadow-xl">
                {CONTACT_NUMBERS.map(({ display, value }) => (
                  <a
                    key={value}
                    href={`tel:${value}`}
                    className="block px-4 py-2 text-sm hover:bg-white/10"
                  >
                    {display}
                  </a>
                ))}
              </div>
            )}
          </div>
          <Link
            href={userPanelHref}
            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Image
              src={user.avatar ?? "/default-avatar.png"}
              width={28}
              height={28}
              alt={user.name}
              className="rounded-full object-cover"
            />
            <span className="text-sm">{user.name}</span>
          </Link>
          <button
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute inset-x-0 top-14 flex w-full flex-col gap-4 border-t border-white/10 bg-black px-6 py-4 shadow-lg sm:top-16">
          {mainNavItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="text-white font-medium py-2 border-b border-white/10 last:border-none"
            >
              {label}
            </Link>
          ))}
          <Link
            href={userPanelHref}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 py-2"
          >
            <Image
              src={user.avatar ?? "/default-avatar.png"}
              width={24}
              height={24}
              alt={user.name}
              className="rounded-full"
            />
            <span>{user.name}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default NavbarLoggedIn;
