"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@admin-kit/shared/lib/utils";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  panelClassName?: string;
};

export function BaseModal({
  open,
  title,
  onClose,
  children,
  footer,
  className,
  panelClassName,
}: Props) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",
        className,
      )}
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={cn(
          "max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-md",
          panelClassName,
        )}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-kit-modal-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="admin-kit-modal-title"
            className="text-lg font-bold text-[#175E47]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
            aria-label="بستن"
          >
            <X className="size-5" />
          </button>
        </div>

        {children}

        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
