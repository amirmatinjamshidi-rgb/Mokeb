"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/features/shared/lib/utils";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ReactNode;
  className?: string;
  containerClassName?: string;
};

const containerBase =
  "relative flex h-12 w-full min-w-0 items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-4 transition-all duration-200 hover:border-[#175E47] focus-within:border-[#175E47]";

export function FloatingLabelSearch({
  id,
  label,
  value,
  onChange,
  icon,
  className,
  containerClassName,
}: Props) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div
      className={cn(containerBase, containerClassName)}
      dir="rtl"
    >
      <div className="relative min-h-[40px] min-w-0 flex-1">
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute right-0 z-10 bg-white px-0.5 text-gray-400 transition-all duration-200 ease-out",
            active
              ? "top-1 text-xs leading-none"
              : "top-1/2 -translate-y-1/2 text-base",
          )}
        >
          {label}
        </label>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "h-full w-full bg-transparent text-right text-base text-gray-500 outline-none",
            active ? "pt-5 pb-1" : "py-2",
            className,
          )}
        />
      </div>
      {icon ? <span className="shrink-0 text-gray-400">{icon}</span> : null}
    </div>
  );
}
