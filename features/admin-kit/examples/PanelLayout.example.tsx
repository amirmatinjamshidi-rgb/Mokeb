import type { ReactNode } from "react";

import { AdminPanelLayoutClient } from "@admin-kit/layouts/PanelLayoutClient";

/**
 * Example: wrap your admin app layout (app/layout.tsx).
 *
 * ```tsx
 * import { AdminPanelLayoutClient } from "@admin-kit/layouts/PanelLayoutClient";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="fa" dir="rtl">
 *       <body>
 *         <AdminPanelLayoutClient>{children}</AdminPanelLayoutClient>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function PanelLayoutExample({ children }: { children: ReactNode }) {
  return <AdminPanelLayoutClient>{children}</AdminPanelLayoutClient>;
}
