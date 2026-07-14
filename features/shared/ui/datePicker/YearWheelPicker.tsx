"use client";

import { useEffect, useRef } from "react";

import { toPersianDigits } from "@/features/shared/lib/format";

const ITEM_HEIGHT = 48;

const WHEEL_HEIGHT = ITEM_HEIGHT * 5;
const EDGE_PAD = (WHEEL_HEIGHT - ITEM_HEIGHT) / 2;

type Props = {
  value: number;
  years: number[];
  /** Fired while the wheel settles on a new year (scroll). */
  onChange: (year: number) => void;
  /** Fired when the user taps a year to confirm it. */
  onPick: (year: number) => void;
};

export default function YearWheelPicker({
  value,
  years,
  onChange,
  onPick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Center the initial year once, when the wheel opens.
  useEffect(() => {
    const index = years.indexOf(value);
    if (index >= 0) containerRef.current?.scrollTo({ top: index * ITEM_HEIGHT });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToYear = (year: number) => {
    const index = years.indexOf(year);
    if (index >= 0) {
      containerRef.current?.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative" style={{ height: WHEEL_HEIGHT }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2"
        style={{ height: ITEM_HEIGHT }}
        aria-hidden
      >
        <div className="mx-auto h-full w-[104px] border-y border-[#279F78]" />
      </div>

      <div
        ref={containerRef}
        className="h-full snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingBlock: EDGE_PAD }}
        onScroll={(e) => {
          const index = Math.round(e.currentTarget.scrollTop / ITEM_HEIGHT);
          const year = years[index];
          if (year !== undefined && year !== value) onChange(year);
        }}
      >
        {years.map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => {
              scrollToYear(year);
              onPick(year);
            }}
            className={`flex w-full snap-center items-center justify-center text-base transition-colors ${
              year === value
                ? "font-semibold text-[#279F78]"
                : "text-neutral-400"
            }`}
            style={{ height: ITEM_HEIGHT }}
          >
            {toPersianDigits(year)}
          </button>
        ))}
      </div>
    </div>
  );
}
