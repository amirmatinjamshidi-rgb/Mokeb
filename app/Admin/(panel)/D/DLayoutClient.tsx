"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { DateCarousel } from "@admin-kit/ui/DateCarousel";
import { startOfDay } from "@admin-kit/ui/dateCarouselUtils";
import { useMediaQuery } from "@admin-kit/shared/hooks/useMediaQuery";

import { PanelDateProvider } from "./PanelDateContext";

type Props = {
  children: ReactNode;
};

export function DLayoutClient({ children }: Props) {
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const isMobile = useMediaQuery("(max-width: 1023px)");

  return (
    <PanelDateProvider value={{ selectedDate, setSelectedDate }}>
      <div className="flex w-full flex-col gap-8 px-4 pt-6 pb-8 sm:px-6 sm:gap-10">
        <DateCarousel
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          visibleSlides={isMobile ? 3 : undefined}
        />
        {children}
      </div>
    </PanelDateProvider>
  );
}
