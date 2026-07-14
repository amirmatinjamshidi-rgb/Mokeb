"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { mainNavItems, ROUTES } from "@/features/shared/config/navigation";
import { isMainNavItemActive } from "@/features/site/lib/navActive";

const userPanelHref = ROUTES.userPanel;

const TRACKING_LINE_COLOR = "#DBBC59";

function useLocationHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(typeof window !== "undefined" ? window.location.hash : "");
  }, [pathname]);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return hash;
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const hash = useLocationHash();
  const isActive = isMainNavItemActive(href, pathname, hash);

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

function NavbarLoggedIn({
  user = { name: "کاربر", },
}: NavbarLoggedInProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const hash = useLocationHash();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!mounted) return null;

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="absolute top-0 z-50 w-full bg-transparent">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between gap-4 px-6 text-white">
        <div className="order-1 hidden flex-1 items-center justify-end gap-10 lg:flex">
          {mainNavItems.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </div>

        <div className="order-2 flex shrink-0 items-center">
          <Link href={ROUTES.home}>
            <Image
              alt="logo"
              src="/Logo.png"
              width={80}
              height={100}
              className="h-auto w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        <div className="order-3 flex flex-1 items-center justify-start gap-4">
          <div className="relative hidden md:block">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="flex items-center gap-1 text-sm transition-colors hover:text-[#DBBC59]"
            >
              <span>{CONTACT_NUMBERS[0].display}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownOpen ? (
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
            ) : null}
          </div>
          <Link
            href={userPanelHref}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/10 md:flex"
          >
            {/* <Image
              src={user.avatar}
              width={28}
              height={28}
              alt={user.name}
              className="rounded-full object-cover"
            /> */}
            <span className="text-sm">{user.name}</span>
          </Link>
          <button
            type="button"
            className="absolute right-6 top-1/2 z-[60] -translate-y-1/2 p-2 text-white lg:hidden"
            aria-expanded={isOpen}
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            onClick={() => setIsOpen((v) => !v)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
        onClick={closeMenu}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[100] flex w-[min(100vw,320px)] max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none translate-x-full"
        }`}
        aria-hidden={!isOpen}
        dir="rtl"
      >
        <div className="relative flex shrink-0 items-center justify-center border-b border-neutral-200 px-4 py-4 pt-12">
          <button
            type="button"
            className="absolute left-4 top-4 rounded-lg p-2 text-[#61756F] transition-colors hover:bg-neutral-100"
            aria-label="بستن"
            onClick={closeMenu}
          >
            <X size={24} />
          </button>
          <Link href={ROUTES.home} onClick={closeMenu} className="inline-flex">
            <Image
              alt="موکب"
              src="/Logo.png"
              width={44}
              height={44}
              className="h-auto w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
          {mainNavItems.map(({ href, label }) => {
            const active = isMainNavItemActive(href, pathname, hash);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`relative rounded-lg py-3 pr-5 text-base font-medium transition-colors ${
                  active
                    ? "border-r-4 border-[#DBBC59] bg-[#F5F9F6] text-[#175E47]"
                    : "border-r-4 border-transparent text-[#61756F] hover:bg-neutral-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-neutral-200 p-4">
          <Link
            href={userPanelHref}
            onClick={closeMenu}
            className="flex items-center gap-2 py-2 text-[#175E47]"
          >
            {/* <Image
              src={user.avatar}
              width={24}
              height={24}
              alt={user.name}
              className="rounded-full"
            /> */}
            <span>{user.name}</span>
          </Link>
        </div>
      </aside>
    </nav>
  );
}

export default NavbarLoggedIn;
