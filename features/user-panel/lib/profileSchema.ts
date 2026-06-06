import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "نام و نام خانوادگی الزامی است"),
  fatherName: z.string().min(1, "نام پدر الزامی است"),
  gender: z.enum(["male", "female"], {
    message: "جنسیت الزامی است",
  }),
  birthDate: z.string().min(1, "تاریخ تولد الزامی است"),
  city: z.string().min(1, "شهر الزامی است"),
  nationality: z.string().min(1, "ملیت الزامی است"),
  nationalCode: z.string().min(1, "کد ملی الزامی است"),
  passportNumber: z.string().min(1, "شماره پاسپورت الزامی است"),
  passportExpiry: z.string().min(1, "تاریخ انقضای پاسپورت الزامی است"),
  bloodType: z.string().min(1, "گروه خونی الزامی است"),
  diseaseHistory: z.string().optional(),
  mobile1: z.string().min(1, "شماره موبایل اول الزامی است"),
  mobile2: z.string().min(1, "شماره موبایل دوم الزامی است"),
  relativePhone: z.string().min(1, "تلفن آشنا الزامی است"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const profileDefaultValues: ProfileFormValues = {
  fullName: "",
  fatherName: "",
  gender: "male",
  birthDate: "",
  city: "",
  nationality: "",
  nationalCode: "",
  passportNumber: "",
  passportExpiry: "",
  bloodType: "",
  diseaseHistory: "",
  mobile1: "",
  mobile2: "",
  relativePhone: "",
};
