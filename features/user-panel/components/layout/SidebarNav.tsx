"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/features/shared/lib/utils";
import type { NavItem } from "../../types";

type Props = {
  items: readonly NavItem[];
  onNavigate?: () => void;
  className?: string;
};

const navButtonClass =
  "flex h-14 w-[236px] max-w-full items-center gap-3 rounded-xl py-4 ps-5 pe-4 text-sm font-medium transition-colors outline-none";

export function SidebarNav({ items, onNavigate, className }: Props) {
  return (
    <nav
      className={cn("flex w-59 max-w-full flex-col gap-2", className)}
      aria-label="منوی پنل کاربری"
    >
      {items.map((item) => (
        <SidebarNavLink key={item.href} {...item} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}

function SidebarNavLink({
  href,
  label,
  icon: Icon,
  onNavigate,
}: NavItem & { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/UserPanel" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        navButtonClass,
        "group",
        active
          ? "bg-white text-[#175E47]"
          : "text-white hover:bg-white/15 focus-visible:bg-white focus-visible:text-[#175E47]",
      )}
    >
      <Icon
        className={cn(
          "size-5 shrink-0",
          active
            ? "text-[#175E47]"
            : "text-white group-focus-visible:text-[#175E47]",
        )}
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-right">{label}</span>
    </Link>
  );
}

type SidebarActionButtonProps = {
  label: string;
  icon: NavItem["icon"];
  onClick: () => void;
  className?: string;
};

export function SidebarActionButton({
  label,
  icon: Icon,
  onClick,
  className,
}: SidebarActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        navButtonClass,
        "group text-white hover:bg-white/15 focus-visible:bg-white focus-visible:text-[#175E47]",
        className,
      )}
    >
      <Icon
        className="size-5 shrink-0 text-white group-focus-visible:text-[#175E47]"
        aria-hidden
      />
      <span className="min-w-0 flex-1 text-right">{label}</span>
    </button>
  );
}
