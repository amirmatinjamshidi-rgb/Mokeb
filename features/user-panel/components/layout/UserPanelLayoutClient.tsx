"use client";

import type { ReactNode } from "react";
import { UserPanelGate } from "./UserPanelGate";
import { UserPanelShell } from "./UserPanelShell";

export function UserPanelLayoutClient({ children }: { children: ReactNode }) {
  return (
    <UserPanelGate>
      <UserPanelShell>{children}</UserPanelShell>
    </UserPanelGate>
  );
}
