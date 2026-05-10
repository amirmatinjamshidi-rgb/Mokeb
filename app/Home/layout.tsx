import NavbarWrapper from "@/features/Layout/NavbarWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <NavbarWrapper />
      {children}
    </html>
  );
}
