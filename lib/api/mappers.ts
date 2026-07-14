import type { Gender, BloodType } from "./types";
import type { IndividualPrincipalDto, CompanionDto, RequestDto } from "./types";
import type { UserProfile } from "@/features/user-panel/types";
import type { Accompany } from "@/features/user-panel/lib/accompanySchema";
import type { PilgrimRow } from "@/features/shared/components/PilgrimsTable";
import type { BloodTypeOption } from "@/features/shared/constants/bloodTypes";

export type ReservationStatus =
  | "در انتظار تایید"
  | "رزرو فعال"
  | "لغو شده"
  | "عدم حضور";
import type { ProfileFormValues } from "@/features/user-panel/lib/profileSchema";
import type { TravelerDto } from "./types";
import type { PilgrimFormValues } from "@/features/reservation/components/registerForm/pilgrimRegistrationSchema";
import {
  isoDateToPersianDate,
  persianDateToIsoDate,
} from "./dateFormat";

function str(value: string | null | undefined, fallback = "") {
  return value ?? fallback;
}

export function genderFromApi(
  value: Gender | string | number | null | undefined,
): "male" | "female" {
  if (value === 1 || value === "1" || value === "Female" || value === "female") {
    return "female";
  }
  return "male";
}

export function genderToApi(value: "male" | "female"): Gender {
  return value === "female" ? 1 : 0;
}

export function bloodTypeLabel(value: BloodType | undefined): BloodTypeOption {
  const labels: BloodTypeOption[] = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
  ];
  if (value === undefined || value < 0 || value > 7) return "O+";
  return labels[value] ?? "O+";
}

const BLOOD_TYPE_BY_LABEL: Record<string, BloodType> = {
  "A+": 0,
  "A-": 1,
  "B+": 2,
  "B-": 3,
  "AB+": 4,
  "AB-": 5,
  "O+": 6,
  "O-": 7,
};

export function bloodTypeToApi(label: string): BloodType | undefined {
  const normalized = label.trim().toUpperCase();
  return BLOOD_TYPE_BY_LABEL[normalized];
}

export function individualToUserProfile(dto: IndividualPrincipalDto): UserProfile {
  const id = dto.id ?? dto.Id ?? "";
  const name = [dto.name ?? dto.Name, dto.familyName ?? dto.FamilyName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return {
    id,
    name: name || "زائر گرامی",
    phone: str(dto.phoneNumber ?? dto.PhoneNumber),
    email: str(dto.gmail ?? dto.Gmail),
  };
}

export function individualToProfileForm(
  dto: IndividualPrincipalDto,
): ProfileFormValues {
  const name = str(dto.name ?? dto.Name);
  const familyName = str(dto.familyName ?? dto.FamilyName);
  return {
    fullName: [name, familyName].filter(Boolean).join(" "),
    fatherName: "",
    gender: genderFromApi(dto.gender ?? dto.Gender),
    birthDate: isoDateToPersianDate(str(dto.dateOfBirth ?? dto.DateOfBirth)),
    city: "",
    nationality: dto.nationalCode ?? dto.NationalCode ? "iranian" : "foreign",
    nationalCode: str(dto.nationalCode ?? dto.NationalCode),
    passportNumber: str(dto.passportNumber ?? dto.PassportNumber),
    passportExpiry: "",
    bloodType: bloodTypeLabel(dto.bloodType ?? dto.BloodType),
    diseaseHistory: "",
    mobile1: str(dto.phoneNumber ?? dto.PhoneNumber),
    mobile2: "",
    relativePhone: str(
      dto.emergencyPhoneNumber ?? dto.EmergencyPhoneNumber,
    ),
  };
}

export function profileFormToChangeCommand(
  individualId: string,
  values: ProfileFormValues,
): {
  individualId: string;
  name: string;
  familyName: string;
  nationalCode: string;
  dateOfBirth: string;
  gender: Gender;
  passportNumber: string;
  gmail: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  bloodType?: BloodType;
} {
  const parts = values.fullName.trim().split(/\s+/).filter(Boolean);
  const name = parts[0] ?? "";
  const familyName = parts.slice(1).join(" ");
  return {
    individualId,
    name,
    familyName,
    nationalCode: values.nationalCode,
    dateOfBirth: persianDateToIsoDate(values.birthDate),
    gender: genderToApi(values.gender),
    passportNumber: values.passportNumber,
    gmail: "",
    phoneNumber: values.mobile1,
    emergencyPhoneNumber: values.relativePhone,
    bloodType: bloodTypeToApi(values.bloodType),
  };
}

export function companionToAccompany(dto: CompanionDto, index: number): Accompany {
  const apiId = String(
    dto.companionId ?? dto.CompanionId ?? dto.id ?? dto.Id ?? `temp-${index}`,
  );
  const name = str(dto.name ?? dto.Name);
  const familyName = str(dto.familyName ?? dto.FamilyName);
  return {
    id: apiId,
    fullName: [name, familyName].filter(Boolean).join(" "),
    fatherName: "",
    gender: genderFromApi(dto.gender ?? dto.Gender),
    birthDate: isoDateToPersianDate(str(dto.dateOfBirth ?? dto.DateOfBirth)),
    city: "",
    nationality: dto.nationalCode ?? dto.NationalCode ? "iranian" : "foreign",
    nationalCode: str(dto.nationalCode ?? dto.NationalCode),
    passportNumber: str(dto.passportNumber ?? dto.PassportNumber),
    passportExpiry: "",
    bloodType: "O+",
    diseaseHistory: "",
    mobile1: str(dto.phoneNumber ?? dto.PhoneNumber),
    mobile2: "",
    relativePhone: str(dto.emergencyPhoneNumber ?? dto.EmergencyPhoneNumber),
  };
}

export function accompanyToAddCommand(
  individualId: string,
  values: ProfileFormValues,
): {
  individualId: string;
  name: string;
  familyName: string;
  nationalCode: string;
  passportNumber: string;
  dateOfBirth: string;
  phoneNumber: string;
  emergencyPhoneNumber: string;
  gender: Gender;
} {
  const parts = values.fullName.trim().split(/\s+/).filter(Boolean);
  const isForeign = values.nationality === "foreign";
  return {
    individualId,
    name: parts[0] ?? "",
    familyName: parts.slice(1).join(" "),
    nationalCode: isForeign ? "" : values.nationalCode,
    // Backend [Required] even when OpenAPI says nullable — never omit.
    passportNumber: isForeign
      ? values.passportNumber || values.nationalCode || ""
      : values.passportNumber || "",
    dateOfBirth: persianDateToIsoDate(values.birthDate),
    phoneNumber: values.mobile1 || "",
    emergencyPhoneNumber: values.relativePhone || "",
    gender: genderToApi(values.gender),
  };
}

export function pilgrimToTravelerDto(pilgrim: PilgrimFormValues): TravelerDto {
  const isForeign = pilgrim.nationality === "foreign";
  return {
    name: pilgrim.firstName,
    lastName: pilgrim.lastName,
    gender: genderToApi(pilgrim.gender),
    phoneNumber: pilgrim.mobile1,
    emergencyPhoneNumber: pilgrim.relativePhone,
    nationalCode: isForeign ? null : pilgrim.nationalCode,
    passportNumber: isForeign ? pilgrim.nationalCode : null,
    dateOfBirth: undefined,
  };
}

export type RoomReservationList = {
  id: number;
  radif: number;
  reservationCode: string;
  checkIn: string;
  checkOut: string;
  companionsCount: number;
  supervisorName: string;
  maleCount: number;
  femaleCount: number;
  pilgrims: PilgrimRow[];
  status: ReservationStatus;
  _apiId?: string;
  /** Raw backend request state (0/1 pending, 2 accepted, 3 rejected) — kept for admin-approval flows. */
  rawState?: number;
};

function mapTravelers(dto: RequestDto): PilgrimRow[] {
  const travelers = dto.travelers ?? dto.Travelers ?? [];
  if (!Array.isArray(travelers)) return [];
  return travelers.map((t) => {
    const nc = str(t.nationalCode ?? t.NationalCode);
    const pp = str(t.passportNumber ?? t.PassportNumber);
    return {
      firstName: str(t.name ?? t.Name),
      lastName: str(t.lastName ?? t.LastName),
      gender: genderFromApi(t.gender ?? t.Gender),
      nationalCode: nc,
      passportNumber: pp,
    };
  });
}

function supervisorFromTravelers(pilgrims: PilgrimRow[]): string {
  const first = pilgrims[0];
  if (!first) return "—";
  return [first.firstName, first.lastName].filter(Boolean).join(" ").trim() || "—";
}

function mapRequestStatus(
  state?: number,
  stringState?: string | null,
): RoomReservationList["status"] {
  const label = (stringState ?? "").toLowerCase();
  if (
    state === 3 ||
    label.includes("reject") ||
    label.includes("cancel") ||
    label.includes("لغو") ||
    label.includes("رد")
  ) {
    return "لغو شده";
  }
  if (label.includes("no-show") || label.includes("عدم")) return "عدم حضور";
  if (
    state === 2 ||
    label.includes("accept") ||
    label.includes("approved") ||
    (label.includes("تایید") && !label.includes("انتظار"))
  ) {
    return "رزرو فعال";
  }
  // Pending / requested (state 0 or 1, or empty stringState)
  return "در انتظار تایید";
}

export function requestToReservation(
  dto: RequestDto,
  index: number,
): RoomReservationList {
  const id =
    dto.id ?? dto.Id ?? dto.requestId ?? dto.RequestId ?? String(index);
  const numericId =
    typeof id === "number"
      ? id
      : Number.parseInt(String(id).replace(/\D/g, "").slice(0, 9), 10) ||
        index + 1;
  const pilgrims = mapTravelers(dto);
  const maleFromTravelers = pilgrims.filter((p) => p.gender === "male").length;
  const femaleFromTravelers = pilgrims.filter(
    (p) => p.gender === "female",
  ).length;
  const maleFromDto = dto.maleAmount ?? dto.MaleAmount;
  const femaleFromDto = dto.femaleAmount ?? dto.FemaleAmount;
  const maleCount =
    typeof maleFromDto === "number" ? maleFromDto : maleFromTravelers;
  const femaleCount =
    typeof femaleFromDto === "number" ? femaleFromDto : femaleFromTravelers;
  const travelersAmount =
    dto.travelersAmount ??
    dto.TravelersAmount ??
    (maleCount + femaleCount > 0
      ? maleCount + femaleCount
      : pilgrims.length);
  return {
    id: numericId,
    radif: index + 1,
    reservationCode: String(id).slice(0, 8).toUpperCase(),
    checkIn: isoDateToPersianDate(
      str(dto.enterTime ?? dto.EnterTime).slice(0, 10),
    ),
    checkOut: isoDateToPersianDate(
      str(dto.exitTime ?? dto.ExitTime).slice(0, 10),
    ),
    companionsCount: travelersAmount,
    supervisorName: supervisorFromTravelers(pilgrims),
    maleCount,
    femaleCount,
    pilgrims,
    status: mapRequestStatus(
      dto.state ?? dto.State,
      dto.stringState ?? dto.StringState,
    ),
    _apiId: String(id),
    rawState: dto.state ?? dto.State,
  };
}
