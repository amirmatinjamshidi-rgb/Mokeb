import { z } from "zod";

import { BloodType, Gender } from "./types";

const genderSchema = z.nativeEnum(Gender);
const bloodTypeSchema = z.nativeEnum(BloodType);

const nullableString = z.string().nullable().optional();

export const adminLogInCommandSchema = z.object({
  username: nullableString,
  password: nullableString,
});

export const caravanPrincipalLogInCommandSchema = z.object({
  username: nullableString,
  password: nullableString,
});

export const individualPrincipalLogInCommandSchema = z.object({
  username: nullableString,
  password: nullableString,
});

const principalSignInFields = {
  name: nullableString,
  familyName: nullableString,
  nationalCode: nullableString,
  dateOfBirth: z.string().optional(),
  gender: genderSchema.optional(),
  passportNumber: nullableString,
  gmail: nullableString,
  phoneNumber: nullableString,
  emergencyPhoneNumber: nullableString,
  username: nullableString,
  password: nullableString,
  bloodType: bloodTypeSchema.optional(),
};

export const individualPrincipalSignInCommandSchema = z.object(
  principalSignInFields,
);

export const caravanPrincipalSignInCommandSchema = z.object(
  principalSignInFields,
);

export const checkCapacityForAmountQuerySchema = z.object({
  individualId: z.string().min(1),
  enterTime: z.string().min(1),
  exitTime: z.string().min(1),
  maleAmount: z.number().int().nonnegative(),
  femaleAmount: z.number().int().nonnegative(),
});

/** CaravanSendsRequestCommand */
export const caravanSendsRequestCommandSchema = z.object({
  caravanId: z.string().min(1),
  maleAmount: z.number().int().nonnegative(),
  femaleAmount: z.number().int().nonnegative(),
  enterTime: z.string().min(1),
  exitTime: z.string().min(1),
});

export const travelerDtoSchema = z.object({
  name: nullableString,
  lastName: nullableString,
  gender: genderSchema.optional(),
  phoneNumber: nullableString,
  emergencyPhoneNumber: nullableString,
  nationalCode: nullableString,
  passportNumber: nullableString,
  dateOfBirth: z.string().optional(),
});

export const reserveRoomCommandSchema = z.object({
  individualId: z.string().min(1),
  dateOfEntrance: z.string().min(1),
  dateOfExit: z.string().min(1),
  maleAmount: z.number().int().nonnegative(),
  femaleAmount: z.number().int().nonnegative(),
  travelers: z.array(travelerDtoSchema).nullable().optional(),
});

export const addCompanionCommandSchema = z.object({
  individualId: z.string().min(1),
  name: nullableString,
  familyName: nullableString,
  nationalCode: nullableString,
  passportNumber: nullableString,
  dateOfBirth: z.string().optional(),
  phoneNumber: nullableString,
  emergencyPhoneNumber: nullableString,
  gender: genderSchema.optional(),
});

export const changingIndividualPrincipalInformationCommandSchema = z.object({
  individualId: z.string().min(1),
  name: nullableString,
  familyName: nullableString,
  nationalCode: nullableString,
  dateOfBirth: z.string().optional(),
  gender: genderSchema.optional(),
  passportNumber: nullableString,
  gmail: nullableString,
  phoneNumber: nullableString,
  emergencyPhoneNumber: nullableString,
  bloodType: bloodTypeSchema.optional(),
});

export const principalsLogOutCommandSchema = z.object({
  id: z.string().min(1),
});

export const changingCaravansPrincipalCommandSchema = z.object({
  caravanId: z.string().min(1),
  name: nullableString,
  familyName: nullableString,
  nationalCode: nullableString,
  dateOfBirth: z.string().optional(),
  gender: genderSchema.optional(),
  passportNumber: nullableString,
  gmail: nullableString,
  phoneNumber: nullableString,
  emergencyPhoneNumber: nullableString,
  bloodType: bloodTypeSchema.optional(),
});

export const addPilgrimCommandSchema = z.object({
  caravanId: z.string().min(1),
  name: nullableString,
  familyName: nullableString,
  nationalCode: nullableString,
  passportNumber: nullableString,
  dateOfBirth: z.string().optional(),
  phoneNumber: nullableString,
  emergencyPhoneNumber: nullableString,
  gender: genderSchema.optional(),
});

export const removePilgrimCommandSchema = z.object({
  caravanId: z.string().min(1),
  nationalCode: nullableString,
});

export const principalsChangePasswordCommandSchema = z.object({
  id: z.string().min(1),
  currentPassword: nullableString,
  newPassword: nullableString,
});
