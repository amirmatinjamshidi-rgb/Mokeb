import type { ReactNode } from "react";

import { DLayoutClient } from "./DLayoutClient";

export default function DLayout({ children }: { children: ReactNode }) {
  return <DLayoutClient>{children}</DLayoutClient>;
}
