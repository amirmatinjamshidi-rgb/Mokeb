"use client";

import type { ReactNode } from "react";
import { CloseCircle } from "iconsax-reactjs";

import { cn } from "@admin-kit/shared/lib/utils";

import { SETTINGS_MODAL_CLASS } from "./settingsStyles";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

export function SettingsModalShell({
  open,
  title,
  onClose,
  children,
  footer,
  className,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          SETTINGS_MODAL_CLASS,
          "flex max-h-[90vh] flex-col gap-10 overflow-y-auto",
          className,
        )}
        dir="rtl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-500">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100"
            aria-label="بستن"
          >
            <CloseCircle variant="Outline" size={24} color="currentColor" />
          </button>
        </div>

        {children}

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 [&>button]:w-full [&>button]:sm:flex-1">
          {footer}
        </div>
      </div>
    </div>
  );
}
