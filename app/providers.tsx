"use client";

import { usePathname } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "@/features/site/layout/Navbar";
import { SiteFooter } from "@/features/reservation/components/SiteFooter";

const muiRtlTheme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "var(--font-geist-sans), Tahoma, sans-serif",
  },
  palette: {
    mode: "light",
    primary: { main: "#175E47" },
    secondary: { main: "#D8B648" },
  },
});

function hasHeroNavbar(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname === "/Home" ||
    pathname.startsWith("/general-reservation") ||
    pathname.startsWith("/reservation")
  );
}

function isPanelShellRoute(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/UserPanel") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/Admin") ||
    pathname.startsWith("/Boss")
  );
}

function hideGlobalNavbar(pathname: string | null) {
  if (!pathname) return true;
  if (hasHeroNavbar(pathname)) return true;
  return isPanelShellRoute(pathname);
}

function hideSiteFooter(pathname: string | null) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/Admin") || pathname.startsWith("/Boss")
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showGlobalNav = !hideGlobalNavbar(pathname);
  const showFooter = !hideSiteFooter(pathname);

  return (
    <ThemeProvider theme={muiRtlTheme}>
      {showGlobalNav ? <Navbar /> : null}
      {children}
      {showFooter ? <SiteFooter /> : null}
    </ThemeProvider>
  );
}
