import { z } from "zod";
import { zIranMobile } from "./formZodRules";

/** Settings caravan card — fields mapped to ChangePrincipal where possible. */
export const karvanInformationSchema = z.object({
  caravanName: z.string(),
  supervisorName: z
    .string()
    .trim()
    .min(2, "نام مسئول کاروان الزامی است"),
  mobile: zIranMobile,
  landline: z.string(),
  address: z.string(),
  gender: z.enum(["male", "female", "mixed"], {
    message: "جنسیت الزامی است",
  }),
});

export type KarvanInformationFormValues = z.infer<
  typeof karvanInformationSchema
>;

export const karvanInformationDefaultValues: KarvanInformationFormValues = {
  caravanName: "",
  supervisorName: "",
  mobile: "",
  landline: "",
  address: "",
  gender: "male",
};

export const representativeSchema = z.object({
  fullName: z.string().trim().min(2, "نام نماینده را وارد کنید"),
  mobile: zIranMobile,
});

export type RepresentativeFormValues = z.infer<typeof representativeSchema>;

export const representativeDefaultValues: RepresentativeFormValues = {
  fullName: "",
  mobile: "",
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(4, "رمز فعلی را وارد کنید"),
    newPassword: z
      .string()
      .min(6, "رمز جدید باید حداقل ۶ کاراکتر باشد")
      .refine((v) => /[A-Z]/.test(v), {
        message: "رمز جدید باید حداقل یک حرف بزرگ انگلیسی داشته باشد",
      })
      .refine((v) => v.includes("@"), {
        message: "رمز جدید باید شامل علامت @ باشد",
      }),
    confirmPassword: z.string().min(1, "تکرار رمز را وارد کنید"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "رمز جدید و تکرار آن یکسان نیست",
      });
    }
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
