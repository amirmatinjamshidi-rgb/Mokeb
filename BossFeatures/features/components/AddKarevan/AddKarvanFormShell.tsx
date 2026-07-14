"use client";

import type { ReactNode } from "react";

import { cn } from "@/boss-features/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Figma card for Add‑Karvan pilgrim forms: 1108×732, 40/32 padding, 40 gap, 16 radius. */
export function AddKarvanFormShell({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1108px] flex-col overflow-y-auto rounded-2xl bg-white",
        "min-h-0 shadow-[0px_4px_12px_0px_#00000024]",
        "gap-10 px-10 py-8 md:h-[732px] md:min-h-[732px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
