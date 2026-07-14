"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { publicNavItems, ROUTES } from "@/features/shared/config/navigation";
import { useAuthStore, useIsAuthenticated } from "@/features/auth/store/useAuthStore";
import { toPersianDigits } from "@/features/shared/lib/format";
import { isPublicNavItemActive } from "@/features/site/lib/navActive";

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

function NavLinkDesktop({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const hash = useLocationHash();
  const isActive = isPublicNavItemActive(href, pathname, hash);

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
        className={`absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ backgroundColor: TRACKING_LINE_COLOR }}
      />
    </Link>
  );
}

/** @deprecated Use `publicNavItems` from `@/features/shared/config/navigation`. */
export const navItems = publicNavItems;

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const hash = useLocationHash();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((s) => s.user);

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

  const phoneDisplay =
    user?.phone && user.phone.length > 0
      ? toPersianDigits(user.phone)
      : user?.name
        ? user.name
        : "";

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="absolute top-0 z-50 w-full bg-transparent">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between px-6 text-white">
        <div className="flex items-center gap-10">
          <Link href={ROUTES.home}>
            <Image
              alt="logo"
              src="/Logo.png"
              width={40}
              height={40}
              className="h-auto w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            {publicNavItems.map(({ href, label }) => (
              <NavLinkDesktop key={href} href={href} label={label} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && phoneDisplay ? (
            <Link
              href={ROUTES.userPanel}
              className="hidden items-center justify-center rounded-lg border border-white/40 bg-transparent px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10 md:inline-flex"
            >
              {phoneDisplay}
            </Link>
          ) : (
            <Link
              href="/login/fresh"
              className="hidden h-9 items-center justify-center rounded-lg bg-[#175E47] px-6 text-sm font-medium text-white transition-colors hover:bg-[#1F7E5F] md:flex"
            >
              ورود
            </Link>
          )}

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

      {/* Mobile drawer */}
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
          {publicNavItems.map(({ href, label }) => {
            const active = isPublicNavItemActive(href, pathname, hash);
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
          {isAuthenticated && phoneDisplay ? (
            <Link
              href={ROUTES.userPanel}
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-lg border border-[#175E47]/30 bg-white py-3 text-center text-sm font-medium text-[#175E47]"
            >
              {phoneDisplay}
            </Link>
          ) : (
            <Link
              href="/login/fresh"
              onClick={closeMenu}
              className="flex w-full items-center justify-center rounded-lg bg-[#175E47] py-3 text-sm font-medium text-white"
            >
              ورود
            </Link>
          )}
        </div>
      </aside>
    </nav>
  );
}

export default Navbar;
