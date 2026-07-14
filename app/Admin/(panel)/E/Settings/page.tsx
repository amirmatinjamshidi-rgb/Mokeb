import { Settings } from "lucide-react";

import {
  PanelPageShell,
  panelPageIconClass,
} from "../../_components/PanelPageShell";

import { SettingsPageContent } from "./SettingsPageContent";

export default function SettingsPage() {
  return (
    <PanelPageShell
      title="تنظیمات"
      icon={<Settings className={panelPageIconClass} aria-hidden />}
    >
      <SettingsPageContent />
    </PanelPageShell>
  );
}
