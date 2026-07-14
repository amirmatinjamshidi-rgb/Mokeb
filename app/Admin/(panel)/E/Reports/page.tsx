import { LogOut } from "lucide-react";

import {
  PanelPageShell,
  panelPageIconClass,
} from "../../_components/PanelPageShell";

import { ReportsContent } from "./ReportsContent";

export default function ReportsPage() {
  return (
    <PanelPageShell
      title="گزارشات و آمار"
      icon={<LogOut className={panelPageIconClass} aria-hidden />}
    >
      <ReportsContent />
    </PanelPageShell>
  );
}
