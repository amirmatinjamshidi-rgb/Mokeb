"use client";

import type { ReactNode } from "react";
import { cn } from "@/features/shared/lib/utils";
import { FORM_ROW_MAX, SITE_MAX } from "../tokens";

type Props = {
  children: ReactNode;
  className?: string;
};

export function ReservationCanvas({ children, className }: Props) {
  return (
    <div
      className={cn("mx-auto w-full min-w-0 bg-white", className)}
      style={{ maxWidth: SITE_MAX }}
    >
      {children}
    </div>
  );
}

/** Horizontal gutters — mobile 16px, tablet 24px, desktop 72px (Figma). */
export function ReservationSectionPad({ children, className }: Props) {
  return (
    <div className={cn("w-full px-4 sm:px-6 lg:px-site-gutter", className)}>
      {children}
    </div>
  );
}

/** Inner form row capped at 1072px. */
export function SiteReservationContentRow({ children, className }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-form-row", className)}>
      {children}
    </div>
  );
}
