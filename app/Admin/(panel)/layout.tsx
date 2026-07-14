import type { ReactNode } from "react";

import { AdminPanelLayoutClient } from "@admin-kit/layouts/PanelLayoutClient";

export default function PanelLayout({ children }: { children: ReactNode }) {
  return <AdminPanelLayoutClient>{children}</AdminPanelLayoutClient>;
}
