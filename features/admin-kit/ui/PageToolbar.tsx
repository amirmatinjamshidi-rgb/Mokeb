"use client";

import type { ReactNode } from "react";

import { cn } from "@admin-kit/shared/lib/utils";

type Props = {
  search: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function PageToolbar({ search, actions, className }: Props) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="w-full min-w-0">{search}</div>
      {actions ? (
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

/** Apply to toolbar action buttons for consistent mobile stacking. */
export const pageToolbarActionClass =
  "flex h-12 w-full min-w-0 sm:flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors";
