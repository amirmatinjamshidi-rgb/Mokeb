import { apiRequest } from "./client";
import type {
  AddOfficialCommand,
  EditOfficialCommand,
  OfficialDto,
} from "./types";

export async function getOfficials() {
  return apiRequest<OfficialDto[]>("/Officials", { method: "GET" });
}

export async function addOfficial(body: AddOfficialCommand) {
  return apiRequest<OfficialDto>("/Officials", {
    method: "POST",
    body: {
      name: body.name ?? null,
      lastName: body.lastName ?? null,
      phoneNumber: body.phoneNumber ?? null,
    },
  });
}

export async function editOfficial(
  officialId: string,
  body: Omit<EditOfficialCommand, "id">,
) {
  return apiRequest<void>(`/Officials/${officialId}`, {
    method: "PUT",
    body: {
      id: officialId,
      name: body.name ?? null,
      lastName: body.lastName ?? null,
      phoneNumber: body.phoneNumber ?? null,
    },
  });
}

export async function deleteOfficial(officialId: string) {
  return apiRequest<void>(`/Officials/${officialId}`, {
    method: "DELETE",
    body: { officialId },
  });
}
