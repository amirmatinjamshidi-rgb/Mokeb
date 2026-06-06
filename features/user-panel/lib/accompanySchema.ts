import type { ProfileFormValues } from "./profileSchema";

export type Accompany = ProfileFormValues & { id: number };

export function genderLabel(gender: ProfileFormValues["gender"]) {
  return gender === "female" ? "زن" : "مرد";
}

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function nationalityLabel(nationality: string) {
  return nationality === "foreign" ? "غیر ایرانی" : "ایرانی";
}
