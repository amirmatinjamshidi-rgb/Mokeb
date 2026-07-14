"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Ellipsis } from "lucide-react";
import { cn } from "@admin-kit/shared/lib/utils";

export type TableActionItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onClick?: () => void;
};

type Props = {
  items: TableActionItem[];
  className?: string;
};

function MenuButton({ label, icon: Icon, onClick }: TableActionItem) {
  return (
    <button
      type="button"
      onClick={onClick}
      dir="rtl"
      className="flex h-10 w-full items-center justify-between gap-2 rounded-xl px-4 text-sm font-medium text-gray-500 transition-colors hover:bg-[#F5F9F6] sm:px-6"
    >
      <Icon className="size-4 shrink-0 text-[#61756F]" aria-hidden />
      <span>{label}</span>
    </button>
  );
}

export function TableRowActionsMenu({ items, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const menuHeight = 32 + items.length * 52 + (items.length - 1) * 12;

  return (
    <div ref={ref} className={cn("relative flex justify-center", className)}>
      <button
        type="button"
        aria-label="عملیات"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg p-1 text-[#61756F] transition-colors hover:bg-[#F5F9F6] hover:text-[#175E47]"
      >
        <Ellipsis className="size-5" />
      </button>

      {open ? (
        <div
          role="menu"
          style={{ height: menuHeight }}
          className="absolute left-1/2 top-full z-30 mt-2 flex w-[min(100vw-2rem,16rem)] -translate-x-1/2 flex-col gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-[0px_4px_12px_0px_#00000024] sm:w-52 sm:px-5"
        >
          {items.map((item) => (
            <MenuButton
              key={item.label}
              {...item}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
