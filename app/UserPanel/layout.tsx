import SideBar from "@/features/Layout/sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <SideBar />
      {children}
    </html>
  );
}
