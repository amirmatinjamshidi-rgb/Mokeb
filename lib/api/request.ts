import { apiRequest, getApiBaseUrl, getAuthToken } from "./client";
import type {
  AcceptRequestCommand,
  ChangeRequestDateCommand,
  GenderStatsInYearCommand,
  RejectRequestCommand,
  RequestStatusDto,
  RequestTypeStatsCommand,
  RoomAvailabilityToAcceptedRequestCommand,
} from "./types";

export async function getIncomingOrAccepted(date: string) {
  return apiRequest<RequestStatusDto[]>(`/IncomingOrAccepted/${date}`, {
    method: "GET",
  });
}

export async function getOutgoingOrAccepted(date: string) {
  return apiRequest<RequestStatusDto[]>(`/OutgoingOrAccepted/${date}`, {
    method: "GET",
  });
}

export async function addRoomAvailabilityToAcceptedRequest(
  requestId: string,
  roomAvailabilityId: string,
  body?: Partial<RoomAvailabilityToAcceptedRequestCommand>,
) {
  const payload: RoomAvailabilityToAcceptedRequestCommand = {
    requestId: body?.requestId ?? requestId,
    roomAvailabilityId: body?.roomAvailabilityId ?? roomAvailabilityId,
    amount: body?.amount ?? 1,
  };
  return apiRequest<void>(
    `/${requestId}/RoomAvailabilities/${roomAvailabilityId}/AddRoomAvailability`,
    {
      method: "PUT",
      body: payload,
    },
  );
}

export async function changeDateOfEntrance(
  requestId: string,
  body: ChangeRequestDateCommand,
) {
  return apiRequest<void>(`/${requestId}/ChangingDateOfEntrance`, {
    method: "PUT",
    body: {
      requestId: body.requestId ?? requestId,
      date: body.date,
    },
  });
}

export async function changeDateOfExit(
  requestId: string,
  body: ChangeRequestDateCommand,
) {
  return apiRequest<void>(`/${requestId}/ChangingExitDate`, {
    method: "PUT",
    body: {
      requestId: body.requestId ?? requestId,
      date: body.date,
    },
  });
}

export async function searchIncomingOrAccepted(date: string, input: string) {
  return apiRequest<RequestStatusDto[]>(
    `/Request/IncomingOrAccepted/${date}/Search/${encodeURIComponent(input)}`,
    {
      method: "GET",
    },
  );
}

export async function searchOutgoingOrAccepted(date: string, input: string) {
  return apiRequest<RequestStatusDto[]>(
    `/Request/OutgoingOrAccepted/${date}/Search/${encodeURIComponent(input)}`,
    {
      method: "GET",
    },
  );
}

export async function getRequestedRequests(entranceDate: string) {
  return apiRequest<RequestStatusDto[]>(
    `/Request/RequestedRequests/${entranceDate}`,
    {
      method: "GET",
    },
  );
}

export async function acceptRequest(
  requestId: string,
  roomAvailabilityIds: string[] = [],
) {
  const body: AcceptRequestCommand = {
    requestId,
    roomAvailabilityIds,
  };
  return apiRequest<void>(`/Request/${requestId}/AcceptRequest`, {
    method: "PUT",
    body,
  });
}

export async function rejectRequest(requestId: string) {
  const body: RejectRequestCommand = { requestId };
  return apiRequest<void>(`/Request/${requestId}/RejectRequest`, {
    method: "PUT",
    body,
  });
}

export async function genderStatsInYear(body: GenderStatsInYearCommand) {
  return apiRequest<unknown>("/Request/GenderStatsInAYear", {
    method: "POST",
    body: { year: body.year != null ? String(body.year) : "" },
  });
}

export async function requestTypeStats(body: RequestTypeStatsCommand) {
  return apiRequest<unknown>("/Request/RequestsTypeStats", {
    method: "POST",
    body: { year: body.year != null ? String(body.year) : "" },
  });
}

export async function requestedRequestsAmount(date: string) {
  return apiRequest<number>(`/Request/${date}/RequestedRequestsAmount`, {
    method: "GET",
  });
}

export async function downloadIndividualRequestPdf(requestId: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/Request/${requestId}/DownloadIndividualRequestPdf`,
    {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    throw new Error(`PDF download failed (${response.status})`);
  }
  return response.blob();
}
