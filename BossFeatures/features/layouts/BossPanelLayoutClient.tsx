"use client";

import type { ReactNode } from "react";
import { UserPanelGate } from "./UserPanelGate";
import { UserPanelShell } from "./UsePanelShell";

export function BossPanelLayoutClient({ children }: { children: ReactNode }) {
  return (
    <UserPanelGate>
      <UserPanelShell>{children}</UserPanelShell>
    </UserPanelGate>
  );
}
