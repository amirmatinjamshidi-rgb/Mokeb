/** Base path for the admin app router (`app/Admin/(panel)/…`). */
export const ADMIN_BASE = "/Admin";

export const ROUTES = {
  home: "/Home",
  services: "/services",
  about: "/about",
  generalReservation: "/general-reservation",
  /** Admin login lives at `/Admin`. */
  login: ADMIN_BASE,
  userPanel: `${ADMIN_BASE}/D/Dashboard`,
  dashboard: `${ADMIN_BASE}/D/Dashboard`,
  onsiteRegistration: `${ADMIN_BASE}/D/Onsite-Registration`,
  karvanReservations: `${ADMIN_BASE}/D/Karvan-reservations`,
  manageRequests: `${ADMIN_BASE}/D/Manage-Requests`,
  manageKarvan: `${ADMIN_BASE}/E/Manage-Karvan`,
  manageUsers: `${ADMIN_BASE}/E/Manage-Users`,
  contentManagement: `${ADMIN_BASE}/E/Content-Management`,
  reports: `${ADMIN_BASE}/E/Reports`,
  settings: `${ADMIN_BASE}/E/Settings`,
} as const;

export const mainNavItems = [
  { href: ROUTES.home, label: "خانه" },
  { href: ROUTES.services, label: "خدمات" },
  { href: ROUTES.about, label: "درباره ما" },
  { href: ROUTES.generalReservation, label: "رزرو عمومی" },
] as const;
