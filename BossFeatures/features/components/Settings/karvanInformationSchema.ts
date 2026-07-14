import { z } from "zod";
import {
  zIranMobile,
  zIranPhoneDigits,
  zTextNoDigits,
} from "@/boss-features/lib/formZodRules";

export const karvanInformationSchema = z.object({
  caravanName: zTextNoDigits("نام کاروان"),
  supervisorName: zTextNoDigits("نام مسئول کاروان"),
  mobile: zIranMobile,
  landline: z.union([z.literal(""), zIranPhoneDigits]),
  address: z.string().min(1, "نشانی الزامی است"),
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
