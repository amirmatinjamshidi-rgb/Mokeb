import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";

const PERSIAN_DATE_PATTERN = /^\d{4}\/\d{2}\/\d{2}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}/;

/** Convert Persian/Arabic-Indic digits to ASCII so API DateOnly parsing works. */
export function toAsciiDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)));
}

/** Persian `YYYY/MM/DD` → API `YYYY-MM-DD` (DateOnly). */
export function persianDateToIsoDate(value: string): string {
  const trimmed = toAsciiDigits(value.trim());
  if (!trimmed) return "";

  if (ISO_DATE_PATTERN.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  if (!PERSIAN_DATE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  try {
    return new DateObject({
      date: trimmed,
      format: "YYYY/MM/DD",
      calendar: persian,
    })
      .convert(gregorian)
      .format("YYYY-MM-DD");
  } catch {
    return trimmed;
  }
}

/** Persian or ISO date → API `date-time` at midnight (for ReserveRoomCommand). */
export function persianDateToIsoDateTime(value: string): string {
  const isoDate = persianDateToIsoDate(value);
  return isoDate ? `${isoDate}T00:00:00` : "";
}

/** API `YYYY-MM-DD` → Persian `YYYY/MM/DD` for form controls (ASCII digits). */
export function isoDateToPersianDate(value: string): string {
  const trimmed = toAsciiDigits(value.trim());
  if (!trimmed) return "";

  if (PERSIAN_DATE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const iso = trimmed.slice(0, 10);
  if (!ISO_DATE_PATTERN.test(iso)) {
    return trimmed;
  }

  try {
    const [year, month, day] = iso.split("-").map(Number);
    return new DateObject({
      year,
      month,
      day,
      calendar: gregorian,
    })
      .convert(persian)
      .format("YYYY/MM/DD");
  } catch {
    return trimmed;
  }
}
