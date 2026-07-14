"use client";

import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@admin-kit/shared/lib/utils";

type Props = {
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
  ariaLabel: string;
  className?: string;
};

/** Native `<select>` dropdown — used in pagination page-size control. */
export function FilterSelect({
  value,
  onChange,
  children,
  ariaLabel,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex h-10 min-w-[140px] items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-500",
        className,
      )}
    >
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 appearance-none bg-transparent text-right text-sm text-gray-500 outline-none"
      >
        {children}
      </select>
      <ChevronLeft
        className="size-4 shrink-0 rotate-[-90deg] text-[#61756F]"
        aria-hidden
      />
    </div>
  );
}
