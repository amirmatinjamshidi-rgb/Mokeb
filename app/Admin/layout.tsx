import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${iranSans500.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
