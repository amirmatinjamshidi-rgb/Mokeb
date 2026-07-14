import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";

import "./globals.css";

const iranSans500 = localFont({
  src: "../../public/fonts/woff2/IRANSansWebFaNum_Medium.woff2",
  weight: "500",
  style: "normal",
  variable: "--font-iransans-700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "موکب",
  description: "موکب پنل مدیریت",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${iranSans500.variable} flex min-h-full flex-col font-sans antialiased`}
    >
      {children}
    </div>
  );
}
