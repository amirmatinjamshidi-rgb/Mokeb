import { z } from "zod";

/** Individual / Caravan / Admin login credentials. */
export const loginCredentialsSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید"),
  password: z.string().min(4, "رمز عبور باید حداقل ۴ کاراکتر باشد"),
});

export type LoginCredentialsValues = z.infer<typeof loginCredentialsSchema>;

/** اعتبارسنجی الگوریتمی کد ملی ایران (۱۰ رقم). */
export function isValidIranNationalId(code: string): boolean {
  const c = code.replace(/\s/g, "");
  if (!/^\d{10}$/.test(c)) return false;
  if (/^(\d)\1{9}$/.test(c)) return false;
  const check = Number(c[9]);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(c[i]) * (10 - i);
  const r = sum % 11;
  return (r < 2 && check === r) || (r >= 2 && check === 11 - r);
}

/** تکمیل اطلاعات نماینده کاروان (بعد از ورود). */
export const caravanRepresentativeSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "نام و نام خانوادگی را کامل وارد کنید"),
  nationalCode: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      const n = val.replace(/\s/g, "");
      if (!/^\d{10}$/.test(n)) {
        ctx.addIssue({
          code: "custom",
          message: "کد ملی باید ۱۰ رقم عددی باشد",
        });
        return;
      }
      if (!isValidIranNationalId(n)) {
        ctx.addIssue({
          code: "custom",
          message: "کد ملی معتبر نیست",
        });
      }
    }),
  caravanName: z
    .string()
    .trim()
    .min(2, "نام کاروان را وارد کنید"),
});

export type CaravanRepresentativeValues = z.infer<
  typeof caravanRepresentativeSchema
>;
