import { UserRoundPen } from "lucide-react";

import {
  PanelPageShell,
  panelPageIconClass,
} from "../../_components/PanelPageShell";

import { OnsiteContent } from "./OnsiteContent";

export default function OnsiteRegistrationPage() {
  return (
    <PanelPageShell
      underCarousel
      title="ثبت نام حضوری"
      icon={<UserRoundPen className={panelPageIconClass} aria-hidden />}
    >
      <OnsiteContent />
    </PanelPageShell>
  );
}
