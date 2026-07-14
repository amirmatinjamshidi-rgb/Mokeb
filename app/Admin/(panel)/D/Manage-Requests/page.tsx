import { Receipt } from "lucide-react";

import {
  PanelPageShell,
  panelPageIconClass,
} from "../../_components/PanelPageShell";

import { ManageRequestsContent } from "./ManageRequestsContent";

export default function ManageRequestsPage() {
  return (
    <PanelPageShell
      underCarousel
      title="مدیریت درخواست ها"
      icon={<Receipt className={panelPageIconClass} aria-hidden />}
    >
      <ManageRequestsContent />
    </PanelPageShell>
  );
}
