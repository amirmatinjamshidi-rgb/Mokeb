const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Convert Western digits in any string/number to Persian digits. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function formatIrr(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("fa-IR").format(abs);
  if (amount < 0) return `−${formatted} ریال`;
  return `${formatted} ریال`;
}

export function formatDateFa(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
