"use client";

import type { ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FloatingLabelSearch } from "@/features/shared/ui/FloatingLabelSearch";
import { cn } from "@/features/shared/lib/utils";

export type ReservationStatusFilter =
  | "all"
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

type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  "aria-label": string;
};

function FilterSelect({
  value,
  onChange,
  children,
  "aria-label": ariaLabel,
}: FilterSelectProps) {
  return (
    <div className={controlClass}>
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer appearance-none border-none bg-transparent text-right text-gray-500 outline-none"
      >
        {children}
      </select>
      <ChevronDown className="size-5 shrink-0 text-gray-400" aria-hidden />
    </div>
  );
}

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
        onChange={(status) =>
          update({ status: status as ReservationStatusFilter })
        }
      >
        <option value="all">همه وضعیت‌ها</option>
        <option value="رزرو فعال">رزرو فعال</option>
        <option value="لغو شده">لغو شده</option>
        <option value="عدم حضور">عدم حضور</option>
      </FilterSelect>

      <FilterSelect
        value={values.sort}
        aria-label="مرتب‌سازی رزروها"
        onChange={(sort) =>
          update({ sort: sort as ReservationSortFilter })
        }
      >
        <option value="newest">جدیدترین</option>
        <option value="oldest">قدیمی‌ترین</option>
      </FilterSelect>
    </div>
  );
}
