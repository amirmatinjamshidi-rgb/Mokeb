import { LogOut, Settings, User, Users2 } from "lucide-react";

import Edit from "@/public/Edit.svg";
import Receipt from "@/public/Receipt.svg";
import type { NavItem } from "../types";

const BOSS = "/Boss";

/** Sidebar action — handled by panel shell (not a route). */
export const LOGOUT_NAV_HREF = "#logout" as const;

export const USER_PANEL_NAV: NavItem[] = [
  {
    href: `${BOSS}/Karvan-Management`,
    label: " مدیریت نماینده کاروان",
    icon: User,
  },
  {
    href: `${BOSS}/Add-Karvan`,
    label: "ثبت رزرو کاروان",
    icon: Edit,
  },
  {
    href: `${BOSS}/Karvan-reservations`,
    label: "رزرو های کاروان",
    icon: Receipt,
  },
  {
    href: `${BOSS}/Manage-Guests`,
    label: " مدیریت زائران کاروان",
    icon: Users2,
  },
  {
    href: `${BOSS}/Settings`,
    label: " تنظیمات",
    icon: Settings,
  },
  {
    href: LOGOUT_NAV_HREF,
    label: "خروج از پنل",
    icon: LogOut,
  },
];
