"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@admin-kit/shared/lib/utils";

export type ListboxOption = { value: string; label: string };

const controlClass =
  "flex h-12 w-full min-w-0 flex-1 items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 text-base text-gray-500 transition-all duration-300 hover:border-[#175E47] focus-within:border-[#175E47]";

const listboxPanelClass =
  "absolute start-0 end-0 top-full z-50 m-0 mt-2 flex h-[224px] w-full list-none flex-col gap-1 overflow-y-auto rounded-lg border border-gray-100 bg-[#FFFFFF] px-0 py-1 shadow-[0px_4px_12px_0px_#00000024]";

const optionRowClass =
  "flex h-10 w-full min-h-10 shrink-0 items-center justify-start gap-[10px] rounded-xl px-6 text-sm font-medium text-gray-500 transition-colors hover:bg-[#F5F9F6]";

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: readonly ListboxOption[];
  "aria-label": string;
  className?: string;
};

/** Custom listbox dropdown (click-outside close). */
export function ListboxSelect({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative min-w-0 flex-1", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className={cn(controlClass, "w-full cursor-pointer text-right")}
      >
        <span className="min-w-0 flex-1 truncate">{selected?.label}</span>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-gray-400 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul role="listbox" aria-label={ariaLabel} className={listboxPanelClass}>
          {options.map((opt) => (
            <li key={opt.value} role="presentation" className="list-none">
              <button
                type="button"
                role="option"
                aria-selected={opt.value === value}
                className={cn(
                  optionRowClass,
                  opt.value === value && "bg-[#F5F9F6] text-[#175E47]",
                )}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 flex-1 text-right">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
