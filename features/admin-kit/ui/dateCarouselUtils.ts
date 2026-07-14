import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { toPersianDigits } from "@admin-kit/shared/lib/format";

export type DateCarouselStats = {
  totalReservations: number;
  reserved: number;
  remaining: number;
};

export const DATE_CAROUSEL_DAYS = 90;

export function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function toDateKey(date: Date): string {
  const d = startOfDay(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function generateNextDays(
  count: number = DATE_CAROUSEL_DAYS,
  startDate: Date = new Date(),
): Date[] {
  const base = startOfDay(startDate);
  return Array.from({ length: count }, (_, index) => {
    const next = new Date(base);
    next.setDate(base.getDate() + index);
    return startOfDay(next);
  });
}

export function formatCarouselDateLabel(date: Date): string {
  const persianDate = new DateObject({
    date,
    calendar: persian,
    locale: persian_fa,
  });
  const weekday = persianDate.weekDay.name;
  const month = String(persianDate.month.number).padStart(2, "0");
  const day = String(persianDate.day).padStart(2, "0");
  return toPersianDigits(`${weekday} - ${month}/${day}`);
}

export const defaultDateCarouselStats = (): DateCarouselStats => ({
  totalReservations: 0,
  reserved: 0,
  remaining: 0,
});
