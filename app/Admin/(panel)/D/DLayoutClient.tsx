"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { DateCarousel } from "@admin-kit/ui/DateCarousel";
import {
  DATE_CAROUSEL_DAYS,
  defaultDateCarouselStats,
  generateNextDays,
  startOfDay,
  toDateKey,
} from "@admin-kit/ui/dateCarouselUtils";
import { useMediaQuery } from "@admin-kit/shared/hooks/useMediaQuery";
import { useDateCarouselStats } from "@admin-kit/api/hooks";

import { PanelDateProvider } from "./PanelDateContext";

type Props = {
  children: ReactNode;
};

export function DLayoutClient({ children }: Props) {
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const carouselStart = useMemo(() => startOfDay(new Date()), []);
  const dateKeys = useMemo(
    () => generateNextDays(DATE_CAROUSEL_DAYS, carouselStart).map(toDateKey),
    [carouselStart],
  );
  const { data: statsMap } = useDateCarouselStats(dateKeys);

  return (
    <PanelDateProvider value={{ selectedDate, setSelectedDate }}>
      <div className="flex w-full flex-col gap-8 px-4 pt-6 pb-8 sm:px-6 sm:gap-10">
        <DateCarousel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          visibleSlides={isMobile ? 3 : undefined}
          startDate={carouselStart}
          getDateStats={(date) =>
            statsMap?.get(toDateKey(date)) ?? defaultDateCarouselStats()
          }
        />
        {children}
      </div>
    </PanelDateProvider>
  );
}
