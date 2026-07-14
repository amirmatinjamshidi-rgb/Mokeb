import { z } from "zod";

import { BLOOD_TYPES } from "@/features/shared/constants/bloodTypes";

const required = (label: string) =>
  z.string().trim().min(1, `${label} الزامی است`);


export const pilgrimSchema = z.object({
  firstName: required("نام"),
  lastName: required("نام خانوادگی"),
  nickName: z.string(),
  fatherName: required("نام پدر"),
  gender: z.enum(["male", "female"]),
  nationality: z.enum(["iranian", "foreign"]),
  nationalCode: required("کد ملی"),
  province: required("استان محل سکونت"),
  city: required("شهر محل سکونت"),
  mobile1: required("موبایل ۱"),
  mobile2: required("موبایل ۲"),
  relativePhone: required("تلفن آشنا"),
  bloodType: z.enum(BLOOD_TYPES, { message: "گروه خونی را انتخاب کنید" }),
  diseaseHistory: z.string(),
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
