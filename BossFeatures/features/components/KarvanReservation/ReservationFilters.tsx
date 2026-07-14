"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FloatingLabelSearch } from "@/boss-features/UI/FloationgLabelSearch";
import { cn } from "@/boss-features/lib/utils";

export type ReservationStatusFilter =
  | "all"
  | "در انتظار تایید"
  | "رزرو فعال"
  | "لغو شده"
  | "عدم حضور";

export type ReservationSortFilter = "newest" | "oldest";

export type ReservationFilterValues = {
  search: string;
  status: ReservationStatusFilter;
  sort: ReservationSortFilter;
};

type Props = {
  values: ReservationFilterValues;
  onChange: (values: ReservationFilterValues) => void;
  className?: string;
};

const controlClass =
  "flex h-12 w-full min-w-0 flex-1 items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-5 py-3 text-base text-gray-500 transition-all duration-300 hover:border-[#175E47] focus-within:border-[#175E47]";


const listboxPanelClass =
  "absolute start-0 end-0 top-full z-50 m-0 mt-2 flex h-[224px] w-full list-none flex-col gap-1 overflow-y-auto rounded-lg border border-gray-100 bg-[#FFFFFF] px-0 py-1 shadow-[0px_4px_12px_0px_#00000024]";

const optionRowClass =
  "flex h-10 w-full min-h-10 shrink-0 items-center justify-start gap-[10px] rounded-xl px-6 text-sm font-medium text-gray-500 transition-colors hover:bg-[#F5F9F6]";

type FilterOption = { value: string; label: string };

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterOption[];
  "aria-label": string;
};

function FilterSelect({
  value,
  onChange,
  options,
  "aria-label": ariaLabel,
}: FilterSelectProps) {
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
    <div ref={rootRef} className="relative min-w-0 flex-1">
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
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className={listboxPanelClass}
        >
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

const STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "در انتظار تایید", label: "در انتظار تایید" },
  { value: "رزرو فعال", label: "رزرو فعال" },
  { value: "لغو شده", label: "لغو شده" },
  { value: "عدم حضور", label: "عدم حضور" },
];

const SORT_OPTIONS: FilterOption[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "oldest", label: "قدیمی‌ترین" },
];

export function ReservationFilters({ values, onChange, className }: Props) {
  const update = (patch: Partial<ReservationFilterValues>) => {
    onChange({ ...values, ...patch });
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 md:flex-row md:items-stretch md:justify-between",
        className,
      )}
      dir="rtl"
    >
      <FloatingLabelSearch
        id="reservation-code-search"
        label="کد رزرو"
        value={values.search}
        onChange={(search) => update({ search })}
        icon={<Search className="size-5" />}
        containerClassName="min-w-0 flex-1"
      />

      <FilterSelect
        value={values.status}
        aria-label="فیلتر وضعیت رزرو"
        options={STATUS_OPTIONS}
        onChange={(status) =>
          update({ status: status as ReservationStatusFilter })
        }
      />

      <FilterSelect
        value={values.sort}
        aria-label="مرتب‌سازی رزروها"
        options={SORT_OPTIONS}
        onChange={(sort) =>
          update({ sort: sort as ReservationSortFilter })
        }
      />
    </div>
  );
}
