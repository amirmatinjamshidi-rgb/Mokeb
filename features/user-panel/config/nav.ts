import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/features/shared/config/navigation";
import type { NavItem } from "../types";

/** Sidebar action — handled by panel shell (not a route). */
export const LOGOUT_NAV_HREF = "#logout" as const;

export const USER_PANEL_NAV: NavItem[] = [
  {
    href: `${ROUTES.userPanel}/profile`,
    label: "حساب کاربری",
    icon: LayoutDashboard,
  },
  {
    href: `${ROUTES.userPanel}/my-reservations`,
    label: "رزروهای من",
    icon: CalendarDays,
  },
  {
    href: `${ROUTES.userPanel}/my-accompany`,
    label: "همراهان من",
    icon: Wallet,
  },
  {
    href: `${ROUTES.userPanel}/settings`,
    label: "تنظیمات",
    icon: Settings,
  },
  {
    href: LOGOUT_NAV_HREF,
    label: "خروج از پنل",
    icon: LogOut,
  },
];
