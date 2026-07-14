import { ROUTES } from "@/features/shared/config/navigation";

function normalizePath(pathname: string): string {
  return pathname === "/" ? ROUTES.home : pathname;
}

/**
 * Active state for the 3-item public navbar (home, services anchor, about).
 */
export function isPublicNavItemActive(
  href: string,
  pathname: string,
  hash: string,
): boolean {
  const path = normalizePath(pathname);
  const h = hash || "";

  if (href.includes("#")) {
    const [base, frag] = href.split("#");
    const want = frag ? `#${frag}` : "";
    const basePath = base === "/" ? ROUTES.home : base;
    return path === basePath && h === want;
  }

  if (href === ROUTES.home) {
    return path === ROUTES.home && h !== "#services";
  }

  if (href === ROUTES.about) {
    return path === ROUTES.about || path.startsWith(`${ROUTES.about}/`);
  }

  return path === href || path.startsWith(`${href}/`);
}

export function isMainNavItemActive(
  href: string,
  pathname: string,
  hash: string,
): boolean {
  if (href === ROUTES.generalReservation) {
    return (
      pathname === ROUTES.generalReservation ||
      pathname.startsWith(`${ROUTES.generalReservation}/`)
    );
  }
  return isPublicNavItemActive(href, pathname, hash);
}
