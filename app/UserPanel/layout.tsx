import { UserPanelLayoutClient } from "@/features/user-panel/components/layout/UserPanelLayoutClient";

export default function UserPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UserPanelLayoutClient>{children}</UserPanelLayoutClient>;
}
