import { apiRequest } from "./client";
import type {
  AddRoomAvailabilityCommand,
  AddRoomCommand,
  ChangeRoomAvailabilityDateCommand,
  RemoveRoomCommand,
  RoomAvailabilityDto,
  RoomDto,
  RoomReportStatsDto,
} from "./types";

/**
 * Response shape for GET /Room/RoomAvailabilities/{enter}/{exit}
 * (also used as the reliable “list for a date” path).
 */
export type RoomAvailabilitiesByRangeDto = {
  maleRoomAvailabilities?: RoomAvailabilityDto[] | null;
  femaleRoomAvailabilities?: RoomAvailabilityDto[] | null;
  MaleRoomAvailabilities?: RoomAvailabilityDto[] | null;
  FemaleRoomAvailabilities?: RoomAvailabilityDto[] | null;
  maleAvailability?: RoomAvailabilityDto[] | null;
  femaleAvailability?: RoomAvailabilityDto[] | null;
  MaleAvailability?: RoomAvailabilityDto[] | null;
  FemaleAvailability?: RoomAvailabilityDto[] | null;
};

/** POST /Room — returns `{ id, roomId, message }`. */
export async function addRoom(body: AddRoomCommand) {
  return apiRequest<
    RoomDto | string | { id?: string; roomId?: string; Id?: string; RoomId?: string }
  >("/Room", {
    method: "POST",
    body: {
      name: body.name,
      gender: body.gender,
      capacity: body.capacity,
    },
  });
}

/** GET /Room — list of rooms with UUID. */
export async function getRooms() {
  return apiRequest<RoomDto[]>("/Room", {
    method: "GET",
  });
}

/** DELETE /Room/{roomId} — JSON body required (415 without Content-Type). */
export async function deleteRoom(roomId: string) {
  const body: RemoveRoomCommand = { roomId };
  return apiRequest<void | string>(`/Room/${roomId}`, {
    method: "DELETE",
    body,
  });
}

/** POST /Room/{roomId}/RoomAvailability */
export async function addRoomAvailability(
  roomId: string,
  body: Omit<AddRoomAvailabilityCommand, "roomId"> & { roomId?: string },
) {
  const payload: AddRoomAvailabilityCommand = {
    roomId: body.roomId ?? roomId,
    dateOfAvailability: body.dateOfAvailability,
  };
  return apiRequest<RoomAvailabilityDto | string | void>(
    `/Room/${roomId}/RoomAvailability`,
    {
      method: "POST",
      body: payload,
    },
  );
}

/** PUT /Room/{roomId}/{roomAvailabilityId}/ChangeDate */
export async function changeRoomAvailabilityDate(
  roomId: string,
  roomAvailabilityId: string,
  body: { newDate: string; availabilityId?: string },
) {
  const payload: ChangeRoomAvailabilityDateCommand = {
    availabilityId: body.availabilityId ?? roomAvailabilityId,
    newDate: body.newDate,
  };
  return apiRequest<void | string>(
    `/Room/${roomId}/${roomAvailabilityId}/ChangeDate`,
    {
      method: "PUT",
      body: payload,
    },
  );
}

/** GET /Room/{date}/ReportStats */
export async function getRoomReportStats(date: string) {
  return apiRequest<RoomReportStatsDto>(`/Room/${date}/ReportStats`, {
    method: "GET",
  });
}

/** GET /Room/RoomAvailabilities/{requestId}/DistinctRoomAvailabilities */
export async function getDistinctRoomAvailabilities(requestId: string) {
  return apiRequest<RoomAvailabilityDto[] | RoomAvailabilitiesByRangeDto>(
    `/Room/RoomAvailabilities/${requestId}/DistinctRoomAvailabilities`,
    {
      method: "GET",
    },
  );
}

/** GET /Room/RoomAvailabilities/{enterDate}/{exitDate} — reliable list (“get all” for a range). */
export async function getRoomAvailabilitiesByRange(
  enterDate: string,
  exitDate: string,
) {
  return apiRequest<RoomAvailabilityDto[] | RoomAvailabilitiesByRangeDto>(
    `/Room/RoomAvailabilities/${enterDate}/${exitDate}`,
    {
      method: "GET",
    },
  );
}

/** GET /Room/RoomAvailabilities/{date} */
export async function getRoomAvailabilitiesByDate(date: string) {
  return apiRequest<RoomAvailabilityDto[]>(
    `/Room/RoomAvailabilities/${date}`,
    { method: "GET" },
  );
}
