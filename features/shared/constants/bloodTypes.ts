export const BLOOD_TYPES = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodTypeOption = (typeof BLOOD_TYPES)[number];

export const BLOOD_TYPE_OPTIONS = BLOOD_TYPES;
