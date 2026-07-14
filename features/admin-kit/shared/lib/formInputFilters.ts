/** Persian / Arabic-Indic digits → ASCII for numeric fields */
const digitMap: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
  "٫": "",
  "٬": "",
};

export function normalizeDigitsInput(value: string): string {
  let out = "";
  for (const ch of value) {
    out += digitMap[ch] ?? ch;
  }
  return out.replace(/\D/g, "");
}

/** Names / city / province: no numeric digits */
export function stripDigitsFromText(value: string): string {
  return value.replace(/[0-9\u06F0-\u06F9\u0660-\u0669]/g, "");
}

/** Passport-style: Latin letters + digits only */
export function filterPassportId(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "");
}
