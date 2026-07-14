"use client";

import { useState } from "react";
import { Bolt, Eraser, MessageSquareText } from "lucide-react";
import {
  KarvanInformationSection,
  RepresentativeSection,
  SettingsSections,
  type SettingsSectionId,
  UserInfo,
} from "@admin-kit/index";

export default function SettingsPage() {
  const [section, setSection] = useState<SettingsSectionId>("caravan");

  return (
    <div className="flex w-full flex-col gap-16">
      <h1 className="flex w-full items-center gap-2 text-2xl font-bold text-gray-500 sm:text-3xl">
        <Bolt className="size-7 sm:size-8" />
        تنظیمات
      </h1>

      <SettingsSections
        value={section}
        onValueChange={setSection}
        className="w-full self-center"
      />

      <div
        role="tabpanel"
        aria-labelledby={`settings-tab-${section}`}
        className={
          section === "user"
            ? "flex w-full max-w-277 flex-col gap-10 self-center"
            : section === "caravan"
              ? "flex h-auto w-full max-w-277 flex-col self-center text-sm text-gray-500"
              : "flex h-full max-h-64.5 w-full max-w-277 flex-row justify-between self-center"
        }
      >
        {section === "caravan" ? (
          <KarvanInformationSection />
        ) : section === "user" ? (
          <>
            <UserInfo />
            <RepresentativeSection />
          </>
        ) : (
          <>
            <button
              dir="rtl"
              type="button"
              className="flex h-14.5 w-full max-w-134 items-center justify-center gap-3 rounded-xl border border-[#175E47] text-sm font-medium text-[#175E47]"
            >
              <Eraser /> قوانین موکب برای کاروان‌ها
            </button>
            <button
              dir="rtl"
              type="button"
              className="flex h-14.5 w-full max-w-134 items-center justify-center gap-3 rounded-xl border border-[#175E47] text-sm font-medium text-[#175E47]"
            >
              <MessageSquareText /> شرایط همکاری
            </button>
          </>
        )}
      </div>
    </div>
  );
}
