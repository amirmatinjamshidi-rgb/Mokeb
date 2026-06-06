"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export const navItems = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  { href: "/about", label: "درباره ما" },
];

const TRACKING_LINE_COLOR = "#DBBC59";
function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const test: any = "rogn";
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
        className={`absolute left-0 right-0 bottom-0 h-0.5 transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        style={{ backgroundColor: TRACKING_LINE_COLOR }}
      />
    </Link>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full top-0 absolute z-50 bg-transparent">
      <div className="w-full mx-auto h-16 flex items-center justify-between px-6 text-white">
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image
              alt="logo"
              src="/Logo.png"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:flex items-center justify-center px-6 h-9 bg-[#175E47] hover:bg-[#1F7E5F] text-white rounded-lg transition-colors text-sm font-medium"
          >
            ورود
          </Link>

          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} aria-label="Menu" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-transparent border-t border-white/10 shadow-lg py-4 px-6 flex flex-col gap-4">
          {navItems.map(({ href, label }) => (
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
            href="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center py-2 bg-[#175E47] text-white rounded-lg font-medium"
          >
            ورود
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
