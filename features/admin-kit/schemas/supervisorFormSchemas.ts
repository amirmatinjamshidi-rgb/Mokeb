import { z } from "zod";
import {
  zIranMobile,
  zIranNationalCode,
  zIranPhoneDigits,
  zPassportId,
  zTextNoDigits,
} from "@admin-kit/schemas/formZodRules";
import { BLOOD_TYPES } from "@/features/shared/constants/bloodTypes";


export const required = (label: string) =>
  z.string().trim().min(1, `${label} الزامی است`);

/**
 * یک زائر — نام‌ها با `zTextNoDigits`؛
 * `nationalCode` برای ایرانی = کد ملی، برای غیرایرانی = شماره پاسپورت (همان فیلد).
 */
export const pilgrimSchema = z
  .object({
    firstName: zTextNoDigits("نام"),
    lastName: zTextNoDigits("نام خانوادگی"),
    nickName: z.string(),
    fatherName: zTextNoDigits("نام پدر"),
    gender: z.enum(["male", "female"]),
    nationality: z.enum(["iranian", "foreign"]),
    nationalCode: z.string(),
    province: zTextNoDigits("استان محل سکونت"),
    city: zTextNoDigits("شهر محل سکونت"),
    mobile1: zIranMobile,
    mobile2: zIranMobile,
    relativePhone: zIranPhoneDigits,
    bloodType: z.enum(BLOOD_TYPES, { message: "گروه خونی را انتخاب کنید" }),
    diseaseHistory: z.string(),
  })
  .superRefine((data, ctx) => {
    const raw = data.nationalCode.trim();
    if (!raw.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.nationality === "iranian"
            ? "کد ملی الزامی است"
            : "شماره پاسپورت الزامی است",
        path: ["nationalCode"],
      });
      return;
    }
    if (data.nationality === "iranian") {
      const r = zIranNationalCode.safeParse(raw);
      if (!r.success) {
        for (const issue of r.error.issues) {
          ctx.addIssue({ ...issue, path: ["nationalCode"] });
        }
      }
    } else {
      const r = zPassportId.safeParse(raw);
      if (!r.success) {
        for (const issue of r.error.issues) {
          ctx.addIssue({ ...issue, path: ["nationalCode"] });
        }
      }
    }
  });

export type PilgrimFormValues = z.infer<typeof pilgrimSchema>;

export function pilgrimRegistrationSchema(pilgrimCount: number) {
  return z.object({
    pilgrims: z
      .array(pilgrimSchema)
      .length(
        pilgrimCount,
        `اطلاعات ${pilgrimCount} زائر را تکمیل کنید`,
      ),
  });
}

export type RegistrationFormValues = z.infer<
  ReturnType<typeof pilgrimRegistrationSchema>
>;

export function emptyPilgrim(): PilgrimFormValues {
  return {
    firstName: "",
    lastName: "",
    nickName: "",
    fatherName: "",
    gender: "male",
    nationality: "iranian",
    nationalCode: "",
    province: "",
    city: "",
    mobile1: "",
    mobile2: "",
    relativePhone: "",
    bloodType: "O+",
    diseaseHistory: "",
  };
}
