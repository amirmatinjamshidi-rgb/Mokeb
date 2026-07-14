"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import DateObject from "react-date-object";

import { toPersianDigits } from "@/features/shared/lib/format";
import YearWheelPicker from "./YearWheelPicker";

const YEARS_AROUND = 8;

type PluginProps = {
  state?: {
    date: DateObject;
    [key: string]: unknown;
  };
  setState?: (state: Record<string, unknown>) => void;
  position?: string;
};

export default function CalendarHeader({ state, setState }: PluginProps) {
  const [yearsOpen, setYearsOpen] = useState(false);
  const [wheelYears, setWheelYears] = useState<number[]>([]);

  if (!state?.date || !setState) return null;

  const date = state.date;

  const navigateMonth = (step: number) => {
    setState({ ...state, date: new DateObject(date).add(step, "month") });
  };

  const commitYear = (year: number) => {
    setState({ ...state, date: new DateObject(date).setYear(year) });
  };

  const toggleYears = () => {
    if (!yearsOpen) {
      const base = date.year;
      setWheelYears(
        Array.from(
          { length: YEARS_AROUND * 2 + 1 },
          (_, i) => base - YEARS_AROUND + i,
        ),
      );
    }
    setYearsOpen((open) => !open);
  };

  return (
    <div
      className={`min-w-[280px] bg-white px-3 pt-3 ${
        yearsOpen ? "reservation-year-wheel-open pb-3" : ""
      }`}
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={toggleYears}
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-base font-semibold text-[#175E47] transition-colors hover:bg-[#F5F9F6]"
          aria-label="انتخاب سال"
          aria-expanded={yearsOpen}
        >
          <span>{date.month?.name}</span>
          <span>{toPersianDigits(date.year)}</span>
          <ChevronDown
            className={`size-4 text-[#61756F] transition-transform ${
              yearsOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            className="flex size-10 items-center justify-center rounded-xl text-[#61756F] transition-colors hover:bg-[#F5F9F6]"
            aria-label="ماه قبل"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => navigateMonth(1)}
            className="flex size-10 items-center justify-center rounded-xl text-[#61756F] transition-colors hover:bg-[#F5F9F6]"
            aria-label="ماه بعد"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      {yearsOpen ? (
        <YearWheelPicker
          value={date.year}
          years={wheelYears}
          onChange={commitYear}
          onPick={(year) => {
            commitYear(year);
            setYearsOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
