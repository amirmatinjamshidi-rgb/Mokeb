import {
  FilePenLine,
  LogOut,
  Receipt,
  Settings,
  UserRoundPen,
  Users,
  Users2,
} from "lucide-react";

import { ROUTES } from "./routes";
import type { NavItem } from "../shared/types";

export const ADMIN_PANEL_NAV: NavItem[] = [
  {
    href: ROUTES.dashboard,
    label: "داشبورد",
    icon: FilePenLine,
  },
  {
    href: ROUTES.onsiteRegistration,
    label: " ثبت نام حضوری",
    icon: UserRoundPen,
  },
  {
    href: ROUTES.karvanReservations,
    label: "مدیریت رزرو ها",
    icon: Receipt,
  },
  {
    href: ROUTES.manageRequests,
    label: " مدیریت درخواست ها",
    icon: Receipt,
  },
  {
    href: ROUTES.manageKarvan,
    label: " مدیریت کاروان‌ها",
    icon: Users,
  },
  {
    href: ROUTES.manageUsers,
    label: "مدیریت کاربران",
    icon: Users2,
  },
  {
    href: ROUTES.contentManagement,
    label: "مدیریت محتوا",
    icon: LogOut,
  },
  {
    href: ROUTES.reports,
    label: "گزارشات و آمار",
    icon: LogOut,
  },
  {
    href: ROUTES.settings,
    label: "تنظیمات",
    icon: Settings,
  },
];

/** @deprecated Use ADMIN_PANEL_NAV — kept for drop-in compatibility */
export const USER_PANEL_NAV = ADMIN_PANEL_NAV;
