import { z } from "zod";

import { isValidIranNationalId } from "@/features/auth/schemas/loginSchemas";
import {
  BLOOD_TYPES,
  BLOOD_TYPE_OPTIONS,
} from "@/features/shared/constants/bloodTypes";

export { BLOOD_TYPE_OPTIONS };

export const accountTypeSchema = z.enum(["individual", "caravan"]);
export type SignInAccountType = z.infer<typeof accountTypeSchema>;

/** Step 1 — create credentials (before personal info). */
export const signInCredentialsSchema = z
  .object({
    accountType: accountTypeSchema,
    username: z
      .string()
      .trim()
      .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
      .max(40, "نام کاربری خیلی طولانی است"),
    password: z
      .string()
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد")
      .refine((v) => /[A-Z]/.test(v), {
        message: "رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد",
      })
      .refine((v) => v.includes("@"), {
        message: "رمز عبور باید شامل علامت @ باشد",
      }),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "رمز عبور و تکرار آن یکسان نیست",
      });
    }
  });

export type SignInCredentialsValues = z.infer<typeof signInCredentialsSchema>;

const iranMobile = z
  .string()
  .trim()
  .regex(/^09\d{9}$/, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");

/** Step 2 — personal / representative info (same payload for individual & caravan). */
export const signInProfileSchema = z.object({
  name: z.string().trim().min(2, "نام را وارد کنید"),
  familyName: z.string().trim().min(2, "نام خانوادگی را وارد کنید"),
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
  dateOfBirth: z
    .string()
    .min(1, "تاریخ تولد را وارد کنید")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ تولد نامعتبر است"),
  gender: z.enum(["male", "female"], {
    message: "جنسیت را انتخاب کنید",
  }),
  passportNumber: z.string().trim().min(1, "شماره پاسپورت را وارد کنید"),
  gmail: z
    .string()
    .trim()
    .min(1, "ایمیل الزامی است")
    .email("ایمیل معتبر وارد کنید"),
  phoneNumber: iranMobile,
  emergencyPhoneNumber: iranMobile,
  bloodType: z.enum(BLOOD_TYPES, {
    message: "گروه خونی را انتخاب کنید",
  }),
});

export type SignInProfileValues = z.infer<typeof signInProfileSchema>;

export const signInCredentialsDefaults: SignInCredentialsValues = {
  accountType: "individual",
  username: "",
  password: "",
  confirmPassword: "",
};

export const signInProfileDefaults: SignInProfileValues = {
  name: "",
  familyName: "",
  nationalCode: "",
  dateOfBirth: "",
  gender: "male",
  passportNumber: "",
  gmail: "",
  phoneNumber: "",
  emergencyPhoneNumber: "",
  bloodType: "O+",
};
