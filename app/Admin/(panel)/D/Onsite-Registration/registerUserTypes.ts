export type RegisterUserGender = "آقایان" | "بانوان";

export type RegisterUserStatus = "ظرفیت موجود" | "در حال تکمیل" | "تکمیل";

export type RegisterUser = {
  id: string;
  classLabel: string;
  gender: RegisterUserGender;
  totalCapacity: number;
  registeredCapacity: number;
  remainingCapacity: number;
  status: RegisterUserStatus;
};

export function computeRegisterUserStatus(
  registered: number,
  total: number,
  remaining: number,
): RegisterUserStatus {
  if (remaining <= 0) return "تکمیل";
  if (registered > 0 && remaining / total <= 0.25) return "در حال تکمیل";
  return "ظرفیت موجود";
}
