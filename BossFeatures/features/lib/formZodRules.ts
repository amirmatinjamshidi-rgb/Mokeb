import { z } from "zod";

const digitsOnlyMsg = (label: string) =>
  `${label} فقط باید با اعداد انگلیسی (۰–۹) وارد شود`;

/** Required string of ASCII digits only (after client normalization) */
export function zDigitsOnly(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} الزامی است`)
    .regex(/^[0-9]+$/, digitsOnlyMsg(label));
}

export const zIranNationalCode = zDigitsOnly("کد ملی").length(
  10,
  "کد ملی باید دقیقا ۱۰ رقم باشد",
);

export const zIranMobile = zDigitsOnly("شماره موبایل").regex(
  /^09[0-9]{9}$/,
  "شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد",
);

/** Landline / contact: digits only, reasonable length */
export const zIranPhoneDigits = zDigitsOnly("شماره تلفن")
  .min(8, "شماره تلفن باید حداقل ۸ رقم باشد")
  .max(15, "شماره تلفن بیش از حد طولانی است");

const noDigitInTextMsg = (label: string) =>
  `${label} نباید شامل رقم باشد (فقط حروف و فاصله)`;

export function zTextNoDigits(label: string) {
  return z
    .string()
    .trim()
    .min(1, `${label} الزامی است`)
    .regex(
      /^[^0-9\u06F0-\u06F9\u0660-\u0669]+$/,
      noDigitInTextMsg(label),
    );
}

export const zPassportId = z
  .string()
  .trim()
  .min(1, "شماره پاسپورت الزامی است")
  .regex(
    /^[A-Za-z0-9]+$/,
    "شماره پاسپورت فقط باید شامل حروف انگلیسی و اعداد باشد",
  );
