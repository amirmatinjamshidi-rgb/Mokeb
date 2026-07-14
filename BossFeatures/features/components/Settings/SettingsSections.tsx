"use client";

import { cn } from "@/boss-features/lib/utils";

export type SettingsSectionId = "caravan" | "user" | "documents";

export const SETTINGS_SECTION_TABS: {
  id: SettingsSectionId;
  label: string;
}[] = [
  { id: "caravan", label: "اطلاعات کاروان" },
  { id: "user", label: "اطلاعات کاربری" },
  { id: "documents", label: "مستندات و قرارداد" },
];

type Props = {
  value: SettingsSectionId;
  onValueChange: (id: SettingsSectionId) => void;
  className?: string;
};

export function SettingsSections({ value, onValueChange, className }: Props) {
  return (
    <div className={cn("w-full max-w-[1108px]", className)} dir="rtl">
      <div
        className="flex h-12 w-full items-end justify-center gap-[104px] border-b-[1.5px] border-[#DFC369]"
        role="tablist"
        aria-label="بخش‌های تنظیمات"
      >
        {SETTINGS_SECTION_TABS.map((tab) => {
          const isActive = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`settings-tab-${tab.id}`}
              onClick={() => onValueChange(tab.id)}
              className={cn(
                "box-border flex h-12 w-[135px] shrink-0 flex-col items-center justify-start px-5 pt-4",
                "text-sm font-medium leading-none text-[#61756F]",
                "border-b-[3px] border-transparent bg-transparent outline-none",
                "-mb-[1.5px] transition-[color,border-color] duration-300 ease-out",
                "hover:text-[#175E47] focus-visible:ring-2 focus-visible:ring-[#DFC369]/60 focus-visible:ring-offset-2",
                isActive && "border-[#DFC369] text-[#175E47]",
              )}
            >
              <span className="text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
