import { apiRequest } from "./client";
import type {
  AddRoomAvailabilityCommand,
  AddRoomCommand,
  ChangeRoomAvailabilityDateCommand,
  RoomAvailabilityDto,
  RoomDto,
  RoomReportStatsDto,
} from "./types";

/** POST /Room — often returns plain text without a UUID. */
export async function addRoom(body: AddRoomCommand) {
  return apiRequest<
    RoomDto | string | { id?: string; roomId?: string; Id?: string; RoomId?: string }
  >("/Room", {
    method: "POST",
    body,
  });
}

/** DELETE /Room/{roomId} */
export async function deleteRoom(roomId: string) {
  return apiRequest<void>(`/Room/${roomId}`, {
    method: "DELETE",
    body: { roomId },
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
  return apiRequest<void>(`/Room/${roomId}/${roomAvailabilityId}/ChangeDate`, {
    method: "PUT",
    body: payload,
  });
}

/** GET /Room/{date}/ReportStats */
export async function getRoomReportStats(date: string) {
  return apiRequest<RoomReportStatsDto>(`/Room/${date}/ReportStats`, {
    method: "GET",
  });
}

/** GET /Room/RoomAvailabilities/{requestId}/DistinctRoomAvailabilities */
export async function getDistinctRoomAvailabilities(requestId: string) {
  return apiRequest<RoomAvailabilityDto[]>(
    `/Room/RoomAvailabilities/${requestId}/DistinctRoomAvailabilities`,
    {
      method: "GET",
    },
  );
}

/** GET /Room/RoomAvailabilities/{enterDate}/{exitDate} */
export async function getRoomAvailabilitiesByRange(
  enterDate: string,
  exitDate: string,
) {
  return apiRequest<RoomAvailabilityDto[]>(
    `/Room/RoomAvailabilities/${enterDate}/${exitDate}`,
    {
      method: "GET",
    },
  );
}

/**
 * GET /Room/RoomAvailabilities/{date}
 * Swagger lists a request body, but browsers cannot send GET bodies reliably —
 * the date in the path is enough for ASP.NET DateOnly binding.
 */
export async function getRoomAvailabilitiesByDate(date: string) {
  return apiRequest<RoomAvailabilityDto[]>(
    `/Room/RoomAvailabilities/${date}`,
    {
      method: "GET",
    },
  );
}
