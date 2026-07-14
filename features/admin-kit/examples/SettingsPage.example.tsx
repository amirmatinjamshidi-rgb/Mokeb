"use client";

import { useState } from "react";

import {
  KarvanInformationSection,
  RepresentativeSection,
  SettingsSections,
  UserInfo,
  type SettingsSectionId,
} from "@admin-kit/index";

/**
 * Example: settings page with section tabs (کاروان / کاربری / مستندات).
 * Copy into app/Settings/page.tsx in your admin repo.
 */
export function SettingsPageExample() {
  const [section, setSection] = useState<SettingsSectionId>("caravan");

  return (
    <div className="flex w-full flex-col gap-6 p-6" dir="rtl">
      <h1 className="text-xl font-semibold text-[#175E47]">تنظیمات</h1>

      <SettingsSections value={section} onValueChange={setSection} />

      {section === "caravan" ? (
        <div className="flex flex-col gap-4">
          <KarvanInformationSection />
          <RepresentativeSection />
        </div>
      ) : null}

      {section === "user" ? <UserInfo phone="09120000000" /> : null}

      {section === "documents" ? (
        <p className="text-sm text-[#61756F]">بخش مستندات — محتوای ادمین را اینجا اضافه کنید.</p>
      ) : null}
    </div>
  );
}
