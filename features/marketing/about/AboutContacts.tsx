"use client";

import { cn } from "@/features/shared/lib/utils";

export type AboutContactsProps = {
  badgeText: string;
  name: string;
  phoneNumber: string;
  badgeClassName?: string;
  className?: string;
};

export default function AboutContacts({
  badgeText,
  name,
  phoneNumber,
  badgeClassName,
  className,
}: AboutContactsProps) {
  return (
    <div
      dir="rtl"
      className={cn(
        "w-full rounded-2xl border border-gray-400 bg-white shadow-[0px_2px_4px_0px_#0000001F]",
        "flex flex-col gap-3 px-4 py-4 sm:px-5",
        "md:h-14 md:flex-row md:items-center md:justify-between md:gap-0 md:px-6 md:py-0",
        className,
      )}
    >
      <div className="flex min-w-0 items-center justify-start md:flex-1">
        <span
          className={cn(
            "inline-flex items-center justify-center text-base font-medium text-[#61756F] sm:text-lg md:text-xl",
            badgeClassName,
          )}
        >
          {badgeText}
        </span>
      </div>

      <div
        className="h-px w-full shrink-0 bg-gray-400 md:h-14 md:w-px"
        aria-hidden
      />

      <div className="flex min-w-0 items-center justify-center text-base font-medium text-[#61756F] sm:text-lg md:flex-1 md:text-xl">
        {name}
      </div>

      <div
        className="h-px w-full shrink-0 bg-gray-400 md:h-14 md:w-px"
        aria-hidden
      />

      <div className="flex min-w-0 items-center justify-end text-sm font-bold tracking-wide text-[#CBA52C] md:flex-1">
        <a href={`tel:${phoneNumber.replace(/\D/g, "")}`} dir="ltr">
          {phoneNumber}
        </a>
      </div>
    </div>
  );
}
