export type KarvanRequestStatus =
  | "در انتظار بررسی"
  | "رد شده"
  | "تایید شده";

export type KarvanRequest = {
  id: string;
  supervisorName: string;
  totalCapacity: number;
  maleCount: number;
  femaleCount: number;
  entryDate: string;
  exitDate: string;
  status: KarvanRequestStatus;
  reservationType: string;
  reservationClass: string;
  reservationCode: string;
  representativeFirstName: string;
  representativeLastName: string;
  mobile: string;
  stayDuration: string;
};
