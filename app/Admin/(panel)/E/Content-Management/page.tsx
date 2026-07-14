import { LogOut } from "lucide-react";

import {
  PanelPageShell,
  panelPageIconClass,
} from "../../_components/PanelPageShell";

export default function ContentManagementPage() {
  return (
    <PanelPageShell
      title="مدیریت محتوا"
      icon={<LogOut className={panelPageIconClass} aria-hidden />}
    />
  );
}
