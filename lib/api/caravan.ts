import { apiRequest } from "./client";
import {
  addPilgrimCommandSchema,
  caravanSendsRequestCommandSchema,
  changingCaravansPrincipalCommandSchema,
  principalsChangePasswordCommandSchema,
  principalsLogOutCommandSchema,
  removePilgrimCommandSchema,
} from "./payloadSchemas";
import type {
  ActivateOrDeactivatePrincipalCommand,
  AddPilgrimCommand,
  CaravanPrincipalDto,
  CaravanSendsRequestCommand,
  ChangeCaravanProfileCommand,
  CompanionDto,
  DeleteCaravanCommand,
  PrincipalsChangePasswordCommand,
  PrincipalsLogOutCommand,
  RemovePilgrimCommand,
  RequestDto,
  SearchPrincipalsQuery,
} from "./types";

export async function getCaravans() {
  return apiRequest<CaravanPrincipalDto[]>("/Caravan");
}

export async function searchCaravans(input: string) {
  const body: SearchPrincipalsQuery = { input };
  return apiRequest<CaravanPrincipalDto[]>("/Caravan/Search", {
    method: "POST",
    body,
  });
}

export async function getCaravan(caravanId: string) {
  return apiRequest<CaravanPrincipalDto>(`/Caravan/${caravanId}`);
}

export async function activateOrDeactivateCaravan(
  caravanId: string,
  active: boolean,
) {
  const body: ActivateOrDeactivatePrincipalCommand = {
    principalId: caravanId,
    activeOrDeactive: active,
  };
  return apiRequest<void>(
    `/Caravan/${caravanId}/ActivateOrDeactivatePrincipal`,
    {
      method: "PUT",
      body,
    },
  );
}

export async function deleteCaravan(caravanId: string) {
  const body: DeleteCaravanCommand = { caravanId };
  return apiRequest<void>(`/Caravan/${caravanId}`, {
    method: "DELETE",
    body,
  });
}

export async function changeCaravanPrincipal(
  caravanId: string,
  body: ChangeCaravanProfileCommand,
) {
  const payload = changingCaravansPrincipalCommandSchema.parse(body);
  return apiRequest<void>(`/Caravan/${caravanId}/ChangePrincipal`, {
    method: "PUT",
    body: payload,
  });
}

export async function changeCaravanPassword(
  caravanId: string,
  body: PrincipalsChangePasswordCommand,
) {
  const payload = principalsChangePasswordCommandSchema.parse(body);
  return apiRequest<void>(`/Caravan/${caravanId}/Password`, {
    method: "PUT",
    body: payload,
  });
}

export async function caravanLogout(
  caravanId: string,
  body: PrincipalsLogOutCommand,
) {
  const payload = principalsLogOutCommandSchema.parse(body);
  return apiRequest<void>(`/Caravan/${caravanId}/LogOut`, {
    method: "POST",
    body: payload,
  });
}

export async function getPilgrims(caravanId: string) {
  return apiRequest<CompanionDto[]>(`/Caravan/${caravanId}/Pilgrims`);
}

export async function searchPilgrims(caravanId: string, input = "") {
  const query = input ? `?input=${encodeURIComponent(input)}` : "";
  return apiRequest<CompanionDto[]>(
    `/Caravan/${caravanId}/Pilgrims/Search${query}`,
  );
}

export async function addPilgrim(
  caravanId: string,
  body: Omit<AddPilgrimCommand, "caravanId">,
) {
  const payload = addPilgrimCommandSchema.parse({ ...body, caravanId });
  return apiRequest<CompanionDto>(`/Caravan/${caravanId}/Pilgrims`, {
    method: "POST",
    body: payload,
  });
}

export async function removePilgrim(
  caravanId: string,
  body: Omit<RemovePilgrimCommand, "caravanId">,
) {
  const nationalCode = body.nationalCode ?? "";
  const payload = removePilgrimCommandSchema.parse({
    caravanId,
    nationalCode,
  });
  return apiRequest<void>(
    `/Caravan/${caravanId}/Pilgrims/${encodeURIComponent(nationalCode)}`,
    {
      method: "DELETE",
      body: payload,
    },
  );
}

export async function uploadPilgrimsExcel(caravanId: string, file: File) {
  const form = new FormData();
  form.append("CaravanId", caravanId);
  form.append("ExcelFile", file);
  return apiRequest<void>(`/Caravan/${caravanId}/Pilgrims/File`, {
    method: "POST",
    rawBody: form,
  });
}

export async function getCaravanRequests(caravanId: string) {
  return apiRequest<RequestDto[]>(`/Caravan/${caravanId}/Requests`);
}

export async function sendCaravanRequest(
  caravanId: string,
  body: Omit<CaravanSendsRequestCommand, "caravanId">,
) {
  const payload = caravanSendsRequestCommandSchema.parse({
    ...body,
    caravanId,
  });
  return apiRequest<unknown>(`/Caravan/${caravanId}/SendRequest`, {
    method: "POST",
    body: payload,
  });
}
