"use client";

import { Search } from "lucide-react";

import { cn } from "@admin-kit/shared/lib/utils";

type Props = {
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
};

export function NavbarSearchField({
  className,
  inputClassName,
  iconClassName,
}: Props) {
  return (
    <div className={cn("relative min-w-0 w-full", className)}>
      <input
        type="search"
        placeholder="جستجو"
        className={cn(
          "w-full rounded-xl border py-2.5 pr-14 pl-10 text-gray-500 outline-none transition-colors focus:border-[#175E47]",
          inputClassName,
        )}
      />
      <Search
        className={cn(
          "pointer-events-none absolute top-3 right-4 size-5 text-gray-500",
          iconClassName,
        )}
        aria-hidden
      />
    </div>
  );
}
