"use client";

import { usePathname } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "@/features/shared/layout/Navbar";
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

function hideGlobalNavbar(pathname: string | null) {
  if (!pathname) return true;
  if (hasHeroNavbar(pathname)) return true;
  return (
    pathname.startsWith("/UserPanel") ||
    pathname.startsWith("/login")
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showGlobalNav = !hideGlobalNavbar(pathname);

  return (
    <ThemeProvider theme={muiRtlTheme}>
      {showGlobalNav ? <Navbar /> : null}
      {children}
      <SiteFooter />
    </ThemeProvider>
  );
}