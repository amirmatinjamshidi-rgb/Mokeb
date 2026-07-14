"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { ROUTES } from "../navigation/routes";
import { cn } from "../shared/lib/utils";
import type { NavItem } from "../shared/types";

function isLucideOrReactComponent(icon: NavItem["icon"]): icon is LucideIcon {
  if (typeof icon === "function") return true;
  if (icon === null || typeof icon !== "object") return false;
  const $$typeof = (icon as { $$typeof?: symbol }).$$typeof;
  return (
    $$typeof === Symbol.for("react.forward_ref") ||
    $$typeof === Symbol.for("react.memo")
  );
}

function NavSidebarGlyph({
  icon,
  className,
}: {
  icon: NavItem["icon"];
  className?: string;
}) {
  if (isLucideOrReactComponent(icon)) {
    const Icon = icon;
    return <Icon className={className} aria-hidden stroke="#D8B648" />;
  }
  if (
    icon &&
    typeof icon === "object" &&
    "src" in icon &&
    typeof (icon as { src: unknown }).src === "string"
  ) {
    return (
      <Image
        width={28}
        height={28}
        src={(icon as { src: string }).src}
        alt=""
        className={cn(className, "object-contain")}
        aria-hidden
      />
    );
  }
  return null;
}

type Props = {
  items: readonly NavItem[];
  onNavigate?: () => void;
  className?: string;
};

const navButtonInnerClass =
  "sidebar-nav-link flex h-14 items-center gap-3 py-4 ps-5 pe-6 text-sm font-medium outline-none";

export function SidebarNav({ items, onNavigate, className }: Props) {
  return (
    <nav
      className={cn("flex w-full flex-col gap-2 overflow-visible pr-4", className)}
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
  const dashboardHref = ROUTES.dashboard;
  const active =
    pathname === href ||
    (href !== dashboardHref && pathname.startsWith(`${href}/`));

  return (
    <div className="sidebar-nav-item overflow-visible">
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          navButtonInnerClass,
          "group",
          active && "sidebar-nav-link--active",
          active
            ? "text-[#175E47]"
            : "text-white focus-visible:text-[#175E47]",
        )}
      >
        <NavSidebarGlyph
          icon={Icon}
          className={cn(
            "size-5 shrink-0",
            active
              ? "text-[#175E47]"
              : "text-white group-focus-visible:text-[#175E47]",
          )}
        />
        <span className="min-w-0 flex-1 text-right">{label}</span>
      </Link>
    </div>
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
    <div className={cn("sidebar-nav-item overflow-visible pr-4", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          navButtonInnerClass,
          "group text-white focus-visible:text-[#175E47]",
        )}
      >
        <NavSidebarGlyph
          icon={Icon}
          className="size-5 shrink-0 text-white group-focus-visible:text-[#175E47]"
        />
        <span className="min-w-0 flex-1 text-right">{label}</span>
      </button>
    </div>
  );
}
