"use client";

import { useState } from "react";

import { AdminSettingsTabs, type AdminSettingsTabId } from "./AdminSettingsTabs";
import { CapacityManagementTab } from "./CapacityManagementTab";
import { OfficialsManagementTab } from "./OfficialsManagementTab";
import { ReservationRulesTab } from "./ReservationRulesTab";

export function SettingsPageContent() {
  const [tab, setTab] = useState<AdminSettingsTabId>("capacity");

  return (
    <div className="flex w-full flex-col gap-10">
      <AdminSettingsTabs value={tab} onValueChange={setTab} />

      {tab === "capacity" ? <CapacityManagementTab /> : null}
      {tab === "rules" ? <ReservationRulesTab /> : null}
      {tab === "officials" ? <OfficialsManagementTab /> : null}
    </div>
  );
}
