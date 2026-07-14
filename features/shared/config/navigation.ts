export const ROUTES = {
  home: "/Home",
  /** Anchor on the home page (see `id="services"` on the services block). */
  services: "/Home#services",
  about: "/about",
  generalReservation: "/general-reservation",
  login: "/login",
  signIn: "/signin",
  userPanel: "/UserPanel",
  userProfile: "/UserPanel/profile",
} as const;

export const mainNavItems = [
  { href: ROUTES.home, label: "خانه" },
  { href: ROUTES.services, label: "خدمات" },
  { href: ROUTES.about, label: "درباره ما" },
  { href: ROUTES.generalReservation, label: "رزرو عمومی" },
] as const;

/** Global marketing navbar (3 links). */
export const publicNavItems = [
  { href: ROUTES.home, label: "خانه" },
  { href: ROUTES.services, label: "خدمات" },
  { href: ROUTES.about, label: "درباره ما" },
] as const;
