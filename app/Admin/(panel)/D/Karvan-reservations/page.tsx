import { UserRoundPen } from "lucide-react";

import {
  PanelPageShell,
  panelPageIconClass,
} from "../../_components/PanelPageShell";

import { OnsiteRegistrationContent } from "./OnsiteRegistrationContent";

export default function KarvanReservationsPage() {
  return (
    <PanelPageShell
      underCarousel
      title="مدیریت رزرو ها"
      icon={<UserRoundPen className={panelPageIconClass} aria-hidden />}
    >
      <OnsiteRegistrationContent />
    </PanelPageShell>
  );
}
