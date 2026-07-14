"use client";

import { useEffect, useRef } from "react";

const ITEM_HEIGHT = 48;

type Props = {
  value: number;
  years: number[];
  onChange: (year: number) => void;
};

export default function YearWheelPicker({ value, years, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const index = years.indexOf(value);

    if (index < 0) return;

    containerRef.current?.scrollTo({
      top: index * ITEM_HEIGHT,
      behavior: "smooth",
    });
  }, [value, years]);

  return (
    <div className="relative w-20">
      <div className="pointer-events-none absolute top-1/2 right-0 left-0 z-20 h-12 -translate-y-1/2 border-y border-[#175E47]" />

      <div
        ref={containerRef}
        className="h-[280px] snap-y snap-mandatory overflow-y-auto py-2 scrollbar-none"
        onScroll={(e) => {
          const target = e.currentTarget;

          const index = Math.round(target.scrollTop / ITEM_HEIGHT);

          const year = years[index];

          if (year !== undefined && year !== value) {
            onChange(year);
          }
        }}
      >
        {years.map((year) => (
          <div
            key={year}
            className={`flex h-12 snap-center items-center justify-center text-sm transition-all ${
              year === value
                ? "font-semibold text-[#175E47]"
                : "text-neutral-400"
            }`}
          >
            {year}
          </div>
        ))}
      </div>
    </div>
  );
}
