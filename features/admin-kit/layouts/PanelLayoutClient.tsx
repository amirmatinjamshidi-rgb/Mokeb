"use client";

import type { ReactNode } from "react";

import { PanelGate } from "./PanelGate";
import { PanelShell } from "./PanelShell";

export function AdminPanelLayoutClient({ children }: { children: ReactNode }) {
  return (
    <PanelGate>
      <PanelShell>{children}</PanelShell>
    </PanelGate>
  );
}

export function BossPanelLayoutClient({ children }: { children: ReactNode }) {
  return (
    <PanelGate>
      <PanelShell>{children}</PanelShell>
    </PanelGate>
  );
}
