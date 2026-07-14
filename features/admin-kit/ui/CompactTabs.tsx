"use client";

import { cn } from "@admin-kit/shared/lib/utils";

export type CompactTab<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: CompactTab<T>[];
  value: T;
  onValueChange: (id: T) => void;
  className?: string;
  ariaLabel?: string;
};

export function CompactTabs<T extends string>({
  tabs,
  value,
  onValueChange,
  className,
  ariaLabel = "تب‌ها",
}: Props<T>) {
  return (
    <div className={cn("w-full", className)} dir="rtl">
      <div
        className="flex items-end gap-8 border-b border-[#DFC369]/40"
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabs.map((tab) => {
          const isActive = value === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onValueChange(tab.id)}
              className={cn(
                "bg-transparent pb-3 pt-2 text-sm font-medium leading-none outline-none transition-colors",
                "hover:text-[#175E47] focus-visible:ring-2 focus-visible:ring-[#DFC369]/60 focus-visible:ring-offset-2",
                isActive ? "text-[#175E47]" : "text-[#61756F]",
              )}
            >
              <span
                className={cn(
                  "inline-block border-b-[3px] border-transparent pb-1",
                  isActive && "border-[#DFC369]",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
