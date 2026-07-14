"use client";

import type { ReactNode } from "react";

import { cn } from "@/boss-features/lib/utils";
import { shadows } from "@/boss-features/tokens";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Figma content card — 1108×944 inside 1440 layout (268px sidebar). */
export function AddKarvanStepBox({ children, className }: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1108px] overflow-y-auto rounded-2xl bg-white",
        "min-h-0 md:min-h-[944px] md:h-[944px]",
        className,
      )}
      style={{ boxShadow: shadows.m }}
      dir="rtl"
    >
      {children}
    </div>
  );
}
