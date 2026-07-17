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
