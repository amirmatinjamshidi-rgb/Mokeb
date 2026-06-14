import type { Metadata } from "next";

import "./globals.css";
import { AppProviders } from "./providers";
import { QueryProvider } from "./query-provider";



export const metadata: Metadata = {
  title: "موکب — خدمت‌رسانی به زائران",
  description: "رزرو و خدمات موکب برای زائران امیرالمومنین (ع)",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`  min-h-dvh bg-background font-sans antialiased`}>
        <QueryProvider>
          <AppProviders>{children}</AppProviders>
        </QueryProvider>
      </body>
    </html>
  );
}
