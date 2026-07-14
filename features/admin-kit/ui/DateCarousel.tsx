"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";

import {
  DATE_CAROUSEL_DAYS,
  defaultDateCarouselStats,
  formatCarouselDateLabel,
  generateNextDays,
  isSameDay,
  toDateKey,
  type DateCarouselStats,
} from "./dateCarouselUtils";

export type { DateCarouselStats } from "./dateCarouselUtils";

export type DateCarouselProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  getDateStats?: (date: Date) => DateCarouselStats;
  daysCount?: number;
  startDate?: Date;
  /** When set, each slide takes equal share of carousel width (e.g. 3 on mobile). */
  visibleSlides?: number;
  className?: string;
};

const SLIDE_SIZE = 155;

const ARROW_CLASS =
  "flex h-[104px] w-12 shrink-0 items-center justify-center bg-[#F5F9F6] text-[#61756F] transition-colors hover:bg-[#E8F0EC] disabled:cursor-not-allowed disabled:opacity-40";

type DateCarouselItemProps = {
  date: Date;
  selected: boolean;
  stats: DateCarouselStats;
  hideDivider?: boolean;
  onSelect: () => void;
};

function DateCarouselItem({
  date,
  selected,
  stats,
  hideDivider,
  onSelect,
}: DateCarouselItemProps) {
  const mutedTextClass = cn(
    "text-sm transition-colors duration-200",
    selected ? "text-[#D8B648]" : "text-[#61756F]",
  );

  return (
    <button
      type="button"
      dir="rtl"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={formatCarouselDateLabel(date)}
      className={cn(
        "group relative flex h-[88px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[12px] px-3 outline-none transition-all duration-200",
        selected
          ? "z-10 border border-[#D8B648] bg-white shadow-sm"
          : "hover:bg-[#F5F9F6]/80",
      )}
    >
      {/* Absolute Vertical Divider */}
      {!selected && !hideDivider && (
        <div className="absolute left-0 top-[20%] h-[60%] w-[1px] bg-[#E6ECE8]" />
      )}

      {/* Row 1: Date Label */}
      <span
        className={cn(
          "whitespace-nowrap text-sm font-semibold tracking-wide",
          mutedTextClass,
        )}
      >
        {formatCarouselDateLabel(date)}
      </span>

     
      <div
        className="flex w-full items-center justify-between px-0.5"
        dir="rtl"
      >
     
        <div className="flex items-center gap-1 text-base font-bold" dir="ltr">
          <span className={cn("text-sm font-normal", mutedTextClass)}>(</span>
          <span className="text-[#8F2346]">
            {toPersianDigits(stats.remaining)}
          </span>
          <span className={cn("text-sm font-normal", mutedTextClass)}>,</span>
          <span className="text-[#5193E2]">
            {toPersianDigits(stats.reserved)}
          </span>
          <span className={cn("text-sm font-normal", mutedTextClass)}>)</span>
        </div>

        {/* Total Reservations with increased text size (text-base) */}
        <span className={cn("text-base font-bold", mutedTextClass)}>
          {toPersianDigits(stats.totalReservations)}
        </span>
      </div>
    </button>
  );
}

export function DateCarousel({
  selectedDate,
  onDateChange,
  getDateStats = defaultDateCarouselStats,
  daysCount = DATE_CAROUSEL_DAYS,
  startDate,
  visibleSlides,
  className,
}: DateCarouselProps) {
  const dates = useMemo(
    () => generateNextDays(daysCount, startDate),
    [daysCount, startDate],
  );

  const selectedIndex = useMemo(
    () => dates.findIndex((date) => isSameDay(date, selectedDate)),
    [dates, selectedDate],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "center",
    containScroll: "keepSnaps",
    dragFree: false,
    duration: 25,
  });

  const scrollToPrevious = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollToNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || selectedIndex < 0) return;
    emblaApi.scrollTo(selectedIndex, true);
  }, [emblaApi, selectedIndex]);

  return (
    <div
      dir="rtl"
      className={cn(
        "flex h-[104px] w-full overflow-hidden rounded-xl border border-[#E6ECE8] bg-white",
        className,
      )}
    >
      <button
        type="button"
        aria-label="تاریخ قبلی"
        className={cn(ARROW_CLASS, "border-l border-[#E6ECE8]")}
        onClick={scrollToPrevious}
      >
        <ChevronRight className="size-5" aria-hidden />
      </button>

      <div ref={emblaRef} className="min-w-0 flex-1 overflow-hidden px-1">
        <div className="flex h-[104px] items-center">
          {dates.map((date, i) => {
            const selected = isSameDay(date, selectedDate);
            const isNextSelected =
              i < dates.length - 1 && isSameDay(dates[i + 1], selectedDate);

            return (
              <div
                key={toDateKey(date)}
                className="flex h-[104px] shrink-0 items-center justify-center px-1"
                style={
                  visibleSlides
                    ? { flex: `0 0 ${100 / visibleSlides}%` }
                    : { flexBasis: SLIDE_SIZE }
                }
              >
                <DateCarouselItem
                  date={date}
                  selected={selected}
                  stats={getDateStats(date)}
                  hideDivider={isNextSelected}
                  onSelect={() => onDateChange(date)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        aria-label="تاریخ بعدی"
        className={cn(ARROW_CLASS, "border-r border-[#E6ECE8]")}
        onClick={scrollToNext}
      >
        <ChevronLeft className="size-5" aria-hidden />
      </button>
    </div>
  );
}
