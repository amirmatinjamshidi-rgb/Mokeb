import { apiRequest } from "./client";
import { normalizeLoginResult } from "./auth";
import {
  addCompanionCommandSchema,
  changingIndividualPrincipalInformationCommandSchema,
  checkCapacityForAmountQuerySchema,
  individualPrincipalLogInCommandSchema,
  individualPrincipalSignInCommandSchema,
  principalsChangePasswordCommandSchema,
  principalsLogOutCommandSchema,
  reserveRoomCommandSchema,
} from "./payloadSchemas";
import type {
  ActivateOrDeactivatePrincipalCommand,
  AddCompanionCommand,
  ChangeIndividualProfileCommand,
  CheckCapacityCommand,
  CheckCapacityResult,
  CompanionDto,
  DeleteIndividualCommand,
  IndividualLogInCommand,
  IndividualPrincipalDto,
  IndividualSignInCommand,
  LoginResult,
  PrincipalsChangePasswordCommand,
  PrincipalsLogOutCommand,
  RemoveCompanionCommand,
  RequestDto,
  ReserveRoomCommand,
  SearchPrincipalsQuery,
} from "./types";

export async function individualLogin(body: IndividualLogInCommand) {
  const payload = individualPrincipalLogInCommandSchema.parse(body);
  const result = await apiRequest<LoginResult | string>("/Individual/LogIn", {
    method: "POST",
    body: payload,
  });
  return normalizeLoginResult(result);
}

export async function individualSignIn(body: IndividualSignInCommand) {
  const payload = individualPrincipalSignInCommandSchema.parse(body);
  const result = await apiRequest<LoginResult | string>("/Individual/SignIn", {
    method: "POST",
    body: payload,
  });
  return normalizeLoginResult(result);
}

export async function individualLogout(
  individualId: string,
  body: PrincipalsLogOutCommand,
) {
  const payload = principalsLogOutCommandSchema.parse(body);
  return apiRequest<void>(`/Individual/${individualId}/LogOut`, {
    method: "POST",
    body: payload,
  });
}

export async function getIndividuals() {
  return apiRequest<IndividualPrincipalDto[]>("/Individual");
}

export async function searchIndividuals(input: string) {
  const body: SearchPrincipalsQuery = { input };
  return apiRequest<IndividualPrincipalDto[]>("/Individual/Search", {
    method: "POST",
    body,
  });
}

export async function getIndividual(individualId: string) {
  return apiRequest<IndividualPrincipalDto>(`/Individual/${individualId}`);
}

export async function activateOrDeactivateIndividual(
  individualId: string,
  active: boolean,
) {
  const body: ActivateOrDeactivatePrincipalCommand = {
    principalId: individualId,
    activeOrDeactive: active,
  };
  return apiRequest<void>(
    `/Individual/${individualId}/ActivateOrDeactivatePrincipal`,
    {
      method: "PUT",
      body,
    },
  );
}

export async function deleteIndividual(individualId: string) {
  const body: DeleteIndividualCommand = { individualId };
  return apiRequest<void>(`/Individual/${individualId}`, {
    method: "DELETE",
    body,
  });
}

export async function changeIndividualProfile(
  individualId: string,
  body: ChangeIndividualProfileCommand,
) {
  const payload = changingIndividualPrincipalInformationCommandSchema.parse(body);
  return apiRequest<void>(`/Individual/${individualId}/ChangePrincipal`, {
    method: "PUT",
    body: payload,
  });
}

export async function changeIndividualPassword(
  individualId: string,
  body: PrincipalsChangePasswordCommand,
) {
  const payload = principalsChangePasswordCommandSchema.parse(body);
  return apiRequest<void>(`/Individual/${individualId}/Password`, {
    method: "PUT",
    body: payload,
  });
}

export async function checkCapacity(
  individualId: string,
  body: Omit<CheckCapacityCommand, "individualId">,
) {
  const payload = checkCapacityForAmountQuerySchema.parse({
    ...body,
    individualId,
  });
  return apiRequest<CheckCapacityResult>(
    `/Individual/${individualId}/CheckCapacity`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function reserveRoom(
  individualId: string,
  body: Omit<ReserveRoomCommand, "individualId">,
) {
  const payload = reserveRoomCommandSchema.parse({
    ...body,
    individualId,
  });
  return apiRequest<unknown>(`/Individual/${individualId}/Reserve`, {
    method: "POST",
    body: payload,
  });
}

export async function getIndividualRequests(individualId: string) {
  return apiRequest<RequestDto[]>(`/Individual/${individualId}/Requests`);
}

export async function getIndividualRequestByDate(
  individualId: string,
  date: string,
) {
  return apiRequest<RequestDto>(
    `/Individual/${individualId}/Requests/${date}`,
  );
}

export async function getCompanions(individualId: string) {
  return apiRequest<CompanionDto[]>(
    `/Individual/${individualId}/Companions`,
  );
}

/** Backend requires non-empty `input` query — use getCompanions for full list. */
export async function searchCompanions(individualId: string, input: string) {
  const trimmed = input.trim();
  if (!trimmed) {
    return getCompanions(individualId);
  }
  return apiRequest<CompanionDto[]>(
    `/Individual/${individualId}/Companions/Search?input=${encodeURIComponent(trimmed)}`,
  );
}

export async function addCompanion(
  individualId: string,
  body: Omit<AddCompanionCommand, "individualId">,
) {
  const payload = addCompanionCommandSchema.parse({ ...body, individualId });
  return apiRequest<CompanionDto>(`/Individual/${individualId}/Companions`, {
    method: "POST",
    body: payload,
  });
}

export async function removeCompanion(
  individualId: string,
  body: Omit<RemoveCompanionCommand, "individualId">,
) {
  return apiRequest<void>(
    `/Individual/${individualId}/Companions/${body.companionId}`,
    {
      method: "DELETE",
      body: { ...body, individualId },
    },
  );
}

export async function uploadCompanionsExcel(individualId: string, file: File) {
  const form = new FormData();
  form.append("IndividualId", individualId);
  form.append("ExcelFile", file);
  return apiRequest<CompanionDto[] | void>(
    `/Individual/${individualId}/Companions/File`,
    {
      method: "POST",
      rawBody: form,
    },
  );
}
