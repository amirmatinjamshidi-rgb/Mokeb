export const ROUTES = {
  home: "/Home",
  services: "/services",
  about: "/about",
  generalReservation: "/general-reservation",
  login: "/login",
  userPanel: "/UserPanel",
  bossPanel: "/Boss",
  bossReservations: "/Boss/Karvan-reservations",
  bossGuests: "/Boss/Manage-Guests",
} as const;

export const mainNavItems = [
  { href: ROUTES.home, label: "خانه" },
  { href: ROUTES.services, label: "خدمات" },
  { href: ROUTES.about, label: "درباره ما" },
  { href: ROUTES.generalReservation, label: "رزرو عمومی" },
] as const;
