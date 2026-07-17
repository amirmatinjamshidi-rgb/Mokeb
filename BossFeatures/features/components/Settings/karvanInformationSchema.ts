import { z } from "zod";
import {
  zIranMobile,
  zIranPhoneDigits,
} from "@/boss-features/lib/formZodRules";

export const karvanInformationSchema = z.object({
  caravanName: z.string(),
  supervisorName: z
    .string()
    .trim()
    .min(2, "نام مسئول کاروان الزامی است"),
  mobile: zIranMobile,
  landline: z.union([z.literal(""), zIranPhoneDigits]),
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
