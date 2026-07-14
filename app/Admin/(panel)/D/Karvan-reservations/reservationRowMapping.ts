import type { mapRequestDto } from "@admin-kit/api/hooks";
import type { EntryExitTabId } from "@admin-kit/index";

import type { ReservationRow } from "./mockEntryExitRows";

export type MappedRequest = ReturnType<typeof mapRequestDto>;

function isDelayed(stringState: string): boolean {
  return (
    stringState.includes("تاخیر") ||
    stringState.includes("تأخیر") ||
    stringState.toLowerCase().includes("delay")
  );
}

function mapEntryStatus(request: MappedRequest): ReservationRow["status"] {
  if (isDelayed(request.stringState)) return "تاخیر در ورود";
  if (request.status === "تایید شده") return "پذیرش شده";
  return "در انتظار";
}

function mapExitStatus(request: MappedRequest): ReservationRow["status"] {
  if (isDelayed(request.stringState)) return "تاخیر در خروج";
  if (request.status === "تایید شده") return "خروج ثبت شده";
  if (request.status === "رد شده") return "عدم خروج";
  return "در انتظار خروج";
}

export function mapRequestToReservationRow(
  request: MappedRequest,
  tab: EntryExitTabId,
): ReservationRow {
  return {
    id: request.id,
    supervisorName: request.supervisorName,
    reservationType: request.reservationType,
    reservationClass: request.reservationClass,
    totalCount: request.totalCapacity,
    maleCount: request.maleCount,
    femaleCount: request.femaleCount,
    status: tab === "entry" ? mapEntryStatus(request) : mapExitStatus(request),
    reservationCode: request.reservationCode,
    representativeFirstName: request.representativeFirstName,
    representativeLastName: request.representativeLastName,
    entryDate: request.entryDate,
    exitDate: request.exitDate,
    mobile: request.mobile,
    stayDuration: request.stayDuration,
  };
}
