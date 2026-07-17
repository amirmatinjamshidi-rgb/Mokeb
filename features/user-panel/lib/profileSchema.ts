import { z } from "zod";
import { BLOOD_TYPES } from "@/features/shared/constants/bloodTypes";

const gmailField = z
  .string()
  .trim()
  .min(1, "ایمیل الزامی است")
  .email("ایمیل معتبر وارد کنید");

/** Profile edit — only API-backed fields are required; others may stay empty. */
export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "نام و نام خانوادگی الزامی است"),
  fatherName: z.string(),
  gender: z.enum(["male", "female"], {
    message: "جنسیت الزامی است",
  }),
  birthDate: z.string().min(1, "تاریخ تولد الزامی است"),
  city: z.string(),
  nationality: z.string(),
  nationalCode: z.string().trim().min(1, "کد ملی الزامی است"),
  passportNumber: z.string(),
  passportExpiry: z.string(),
  bloodType: z.enum(BLOOD_TYPES, {
    message: "گروه خونی را انتخاب کنید",
  }),
  diseaseHistory: z.string().optional(),
  mobile1: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود"),
  mobile2: z.string(),
  relativePhone: z
    .string()
    .trim()
    .regex(/^09\d{9}$/, "تلفن اضطراری باید ۱۱ رقم و با ۰۹ شروع شود"),
  gmail: gmailField,
});

/** Companion / pilgrim forms — email is not sent to Companions/Pilgrims APIs. */
export const companionProfileSchema = profileSchema.extend({
  gmail: z.string().trim(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileDefaultValues: ProfileFormValues = {
  fullName: "",
  fatherName: "",
  gender: "male",
  birthDate: "",
  city: "",
  nationality: "iranian",
  nationalCode: "",
  passportNumber: "",
  passportExpiry: "",
  bloodType: "O+",
  diseaseHistory: "",
  mobile1: "",
  mobile2: "",
  relativePhone: "",
  gmail: "",
};
