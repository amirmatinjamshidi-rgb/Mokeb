import {
  CalendarDays,
  LayoutDashboard,
  Settings,
  LogOut,
  Wallet,
} from "lucide-react";
import { ROUTES } from "@/features/shared/config/navigation";
import type { NavItem } from "../types";

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
    href: "/Home",
    label: "خروج از پنل",
    icon: LogOut,
  },
];
