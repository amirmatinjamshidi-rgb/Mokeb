"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isoDateToPersianDate, persianDateToIsoDateTime } from "@/lib/api/dateFormat";
import {
  bloodTypeToApi,
  caravanApi,
  genderToApi,
  individualApi,
  officialsApi,
  pilgrimToTravelerDto,
  requestApi,
  roomApi,
  BloodType,
  Gender,
  RequestState,
  type AddOfficialCommand,
  type AddRoomCommand,
  type CaravanPrincipalDto,
  type ChangeCaravanProfileCommand,
  type ChangeIndividualProfileCommand,
  type IndividualPrincipalDto,
  type IndividualSignInCommand,
  type OfficialDto,
  type RequestStatusDto,
  type RoomAvailabilityDto,
  type RoomDto,
  type RoomReportStatsDto,
} from "@/lib/api";
import type { PilgrimFormValues } from "@admin-kit/schemas/supervisorFormSchemas";

export type AdminUserRegistrationYear =
  | "1404"
  | "1405"
  | "1406"
  | "1407"
  | "1408";

export type AdminUserStatus = "فعال" | "غیر فعال";

export type AdminUserRow = {
  id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobile: string;
  registrationYear: AdminUserRegistrationYear;
  status: AdminUserStatus;
  accountType: "individual" | "caravan";
};

export type AdminOfficialRow = {
  id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  mobile: string;
  registrationYear: "1404" | "1405" | "1406" | "1407" | "1408";
  status: "فعال" | "غیر فعال";
};

function readString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  return fallback;
}

export function normalizeList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const container = value as Record<string, unknown>;
    // GET /Individual and GET /Caravan return wrapper objects, not bare arrays.
    const candidates = [
      container.individualPrincipals,
      container.IndividualPrincipals,
      container.caravanPrincipals,
      container.CaravanPrincipals,
      container.officials,
      container.Officials,
      container.requests,
      container.Requests,
      container.response,
      container.Response,
      container.value,
      container.Value,
      container.items,
      container.Items,
    ];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) return candidate as T[];
    }
  }
  return [];
}

export function mapOfficialDto(dto: OfficialDto): AdminOfficialRow {
  const id = readString(dto.id ?? dto.Id);
  return {
    id,
    firstName: readString(dto.name ?? dto.Name),
    lastName: readString(
      dto.lastName ??
        dto.LastName ??
        dto.familyName ??
        dto.FamilyName,
    ),
    nationalCode: readString(dto.nationalCode ?? dto.NationalCode),
    mobile: readString(dto.phoneNumber ?? dto.PhoneNumber),
    registrationYear: "1404",
    status: readBoolean(dto.isActive ?? dto.IsActive, true) ? "فعال" : "غیر فعال",
  };
}

export function mapPrincipalToAdminUser(
  dto: IndividualPrincipalDto | CaravanPrincipalDto,
  accountType: "individual" | "caravan",
): AdminUserRow {
  const id = readString(
    dto.principalId ??
      dto.PrincipalId ??
      dto.id ??
      dto.Id,
  );
  return {
    id,
    firstName: readString(dto.name ?? dto.Name),
    lastName: readString(dto.familyName ?? dto.FamilyName),
    nationalCode: readString(dto.nationalCode ?? dto.NationalCode),
    mobile: readString(dto.phoneNumber ?? dto.PhoneNumber),
    registrationYear: "1404",
    status: readBoolean(dto.isActive ?? dto.IsActive, true) ? "فعال" : "غیر فعال",
    accountType,
  };
}

/**
 * Backend State: Accepted=0, Rejected=1, Requested=2,
 * DelayInEntrance=3, DelayInExit=4, Entered=5, Exited=6.
 */
function mapRequestStatusLabel(dto: RequestStatusDto) {
  const raw = readString(dto.stringState ?? dto.StringState).toLowerCase();
  const numericRaw = dto.requestState ?? dto.RequestState ?? dto.state ?? dto.State;
  const numeric =
    typeof numericRaw === "number" && Number.isFinite(numericRaw)
      ? numericRaw
      : null;

  if (
    raw.includes("reject") ||
    raw.includes("رد") ||
    numeric === RequestState.Rejected
  ) {
    return "رد شده" as const;
  }
  if (
    raw.includes("delay") ||
    raw.includes("تاخیر") ||
    raw.includes("تأخیر") ||
    numeric === RequestState.DelayInEntrance ||
    numeric === RequestState.DelayInExit
  ) {
    return "تایید شده" as const;
  }
  if (
    raw.includes("accept") ||
    raw.includes("approved") ||
    raw.includes("وارد") ||
    raw.includes("خارج") ||
    (raw.includes("تایید") && !raw.includes("انتظار")) ||
    numeric === RequestState.Accepted ||
    numeric === RequestState.Entered ||
    numeric === RequestState.Exited
  ) {
    return "تایید شده" as const;
  }
  if (
    raw.includes("pending") ||
    raw.includes("انتظار") ||
    raw.includes("request") ||
    numeric === RequestState.Requested ||
    numeric === null
  ) {
    return "در انتظار بررسی" as const;
  }
  return "در انتظار بررسی" as const;
}

export function mapRequestDto(dto: RequestStatusDto) {
  const id = readString(dto.requestId ?? dto.RequestId ?? dto.id ?? dto.Id);
  const entryRaw = readString(
    dto.entranceDate ??
      dto.EntranceDate ??
      dto.enterDate ??
      dto.EnterDate ??
      dto.enterTime ??
      dto.EnterTime,
  ).slice(0, 10);
  const exitRaw = readString(
    dto.exitDate ?? dto.ExitDate ?? dto.exitTime ?? dto.ExitTime,
  ).slice(0, 10);
  const entryDate = entryRaw ? isoDateToPersianDate(entryRaw) : "—";
  const exitDate = exitRaw ? isoDateToPersianDate(exitRaw) : "—";
  const maleCount = readNumber(
    dto.maleAmount ?? dto.MaleAmount ?? dto.maleCount ?? dto.MaleCount,
  );
  const femaleCount = readNumber(
    dto.femaleAmount ?? dto.FemaleAmount ?? dto.femaleCount ?? dto.FemaleCount,
  );
  const totalCapacity =
    readNumber(
      dto.totalCapacity ??
        dto.TotalCapacity ??
        dto.overallCount ??
        dto.OverallCount,
    ) || maleCount + femaleCount;

  const name = readString(dto.name ?? dto.Name);
  const familyName = readString(dto.familyName ?? dto.FamilyName);
  const fullName = readString(
    dto.fullName ?? dto.FullName ?? dto.supervisorName ?? dto.SupervisorName,
    [name, familyName].filter(Boolean).join(" "),
  );
  const principalType = readString(dto.principalType ?? dto.PrincipalType);
  const reservationTypeDefault =
    principalType.toLowerCase() === "individual" ? "انفرادی" : "کاروان";

  // Incoming/Outgoing DTOs have no state — treat as already accepted.
  const hasStateField =
    dto.requestState != null ||
    dto.RequestState != null ||
    dto.state != null ||
    dto.State != null ||
    Boolean(dto.stringState ?? dto.StringState);
  const status = hasStateField
    ? mapRequestStatusLabel(dto)
    : ("تایید شده" as const);

  return {
    id,
    supervisorName: fullName || "—",
    totalCapacity,
    maleCount,
    femaleCount,
    entryDate,
    exitDate,
    status,
    stringState: readString(
      dto.stringState ?? dto.StringState,
      status === "تایید شده" ? "تایید شده" : "",
    ),
    reservationType: readString(
      dto.reservationType ?? dto.ReservationType,
      reservationTypeDefault,
    ),
    reservationClass: readString(dto.reservationClass ?? dto.ReservationClass, "—"),
    reservationCode: readString(dto.reservationCode ?? dto.ReservationCode ?? id, id),
    representativeFirstName: readString(
      dto.representativeFirstName ?? dto.RepresentativeFirstName ?? name,
      "—",
    ),
    representativeLastName: readString(
      dto.representativeLastName ?? dto.RepresentativeLastName ?? familyName,
      "—",
    ),
    mobile: readString(
      dto.mobile ?? dto.Mobile ?? dto.phoneNumber ?? dto.PhoneNumber,
    ),
    stayDuration: readString(dto.stayDuration ?? dto.StayDuration, "0"),
  };
}

export function mapRoomAvailabilityDto(
  dto: RoomAvailabilityDto,
  genderHint?: Gender,
) {
  // Backend RoomAvailabilityDto: roomAvailabilityId, roomId, roomName,
  // overallCapacity, reservedAmount, emptyCapacity (+ aliases id/capacity/…).
  const id = readString(
    dto.roomAvailabilityId ?? dto.RoomAvailabilityId ?? dto.id ?? dto.Id,
  );
  const roomId = readString(dto.roomId ?? dto.RoomId);
  const capacity = readNumber(
    dto.overallCapacity ?? dto.OverallCapacity ?? dto.capacity ?? dto.Capacity,
  );
  const reserved = readNumber(
    dto.reservedAmount ?? dto.ReservedAmount ?? dto.reserved ?? dto.Reserved,
  );
  const available = readNumber(
    dto.emptyCapacity ?? dto.EmptyCapacity ?? dto.available ?? dto.Available,
  );
  const remaining =
    available > 0 ? available : Math.max(0, capacity - reserved);
  const rawGender = dto.gender ?? dto.Gender ?? genderHint;
  // Backend Gender: 0 = Male, 1 = Female (same as lib/api Gender enum).
  const male = Number(rawGender ?? Gender.Female) === Gender.Male;
  return {
    id,
    roomId,
    className: readString(
      dto.roomName ?? dto.RoomName,
      roomId ? roomId.slice(0, 8) : "—",
    ),
    capacity,
    reserved,
    available,
    remaining,
    totalCapacity: capacity,
    registeredCapacity: reserved,
    gender: male ? ("مرد" as const) : ("زن" as const),
    genderLabel: male ? ("آقایان" as const) : ("بانوان" as const),
    reservationKind: "کاروان" as const,
    date: readString(dto.date ?? dto.Date ?? dto.enterDate ?? dto.EnterDate),
  };
}

export type RoomAvailabilityRow = ReturnType<typeof mapRoomAvailabilityDto>;

export function mapRoomReportStats(dto: RoomReportStatsDto | null | undefined) {
  const raw = (dto ?? {}) as Record<string, unknown>;
  const presentAmounts = (raw.presentAmounts ??
    raw.PresentAmounts ??
    {}) as Record<string, unknown>;
  const entryAmounts = (raw.entryAmounts ??
    raw.EntryAmounts ??
    {}) as Record<string, unknown>;
  const outboundAmounts = (raw.outboundAmounts ??
    raw.outBoundAmounts ??
    raw.OutBoundAmounts ??
    {}) as Record<string, unknown>;

  const filled = readNumber(
    dto?.amountOfFilledCapacity ?? dto?.AmountOfFilledCapacity,
  );
  const total =
    readNumber(dto?.totalCapacity ?? dto?.TotalCapacity) || filled;
  const male =
    readNumber(dto?.maleCapacity ?? dto?.MaleCapacity) ||
    readNumber(entryAmounts.maleOverall ?? entryAmounts.MaleOverall) ||
    readNumber(presentAmounts.maleOverall ?? presentAmounts.MaleOverall);
  const female =
    readNumber(dto?.femaleCapacity ?? dto?.FemaleCapacity) ||
    readNumber(entryAmounts.femaleOverall ?? entryAmounts.FemaleOverall) ||
    readNumber(presentAmounts.femaleOverall ?? presentAmounts.FemaleOverall);
  const available = readNumber(
    dto?.availableCapacity ?? dto?.AvailableCapacity,
  );
  const reservedFromPresent =
    readNumber(presentAmounts.maleCount ?? presentAmounts.MaleCount) +
    readNumber(presentAmounts.femaleCount ?? presentAmounts.FemaleCount);
  const reserved =
    readNumber(dto?.reservedCapacity ?? dto?.ReservedCapacity) ||
    reservedFromPresent ||
    (available > 0 ? Math.max(0, total - available) : 0);

  return {
    totalCapacity: total,
    maleCapacity: male,
    femaleCapacity: female,
    reservedCapacity: reserved,
    availableCapacity: available,
    presentAmounts,
    entryAmounts,
    outboundAmounts,
  };
}

export const adminQueryKeys = {
  officials: ["admin", "officials"] as const,
  individuals: (search: string) => ["admin", "individuals", search] as const,
  caravans: (search: string) => ["admin", "caravans", search] as const,
  principals: (search: string) => ["admin", "principals", search] as const,
  requestedRequests: (date: string) =>
    ["admin", "requestedRequests", date] as const,
  incoming: (date: string, search: string) =>
    ["admin", "incoming", date, search] as const,
  outgoing: (date: string, search: string) =>
    ["admin", "outgoing", date, search] as const,
  requests: (date: string, search: string) =>
    ["admin", "requests", date, search] as const,
  rooms: (date: string) => ["admin", "rooms", date] as const,
  roomsRange: (enter: string, exit: string) =>
    ["admin", "rooms-range", enter, exit] as const,
  distinctRooms: (requestId: string) =>
    ["admin", "distinct-rooms", requestId] as const,
  roomStats: (date: string) => ["admin", "room-stats", date] as const,
  roomStatsRange: (dates: string[]) =>
    ["admin", "room-stats-range", ...dates] as const,
};

function invalidateRequestQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  date: string,
  search = "",
) {
  void queryClient.invalidateQueries({
    queryKey: adminQueryKeys.requestedRequests(date),
  });
  void queryClient.invalidateQueries({
    queryKey: adminQueryKeys.requests(date, search),
  });
  void queryClient.invalidateQueries({
    queryKey: adminQueryKeys.incoming(date, search),
  });
  void queryClient.invalidateQueries({
    queryKey: adminQueryKeys.outgoing(date, search),
  });
}

async function fetchIncomingRequests(date: string, search: string) {
  const trimmed = search.trim();
  const raw =
    trimmed.length > 0
      ? await requestApi.searchIncomingOrAccepted(date, trimmed)
      : await requestApi.getIncomingOrAccepted(date);
  return normalizeList<RequestStatusDto>(raw)
    .map(mapRequestDto)
    .filter((row) => row.id.length > 0);
}

async function fetchOutgoingRequests(date: string, search: string) {
  const trimmed = search.trim();
  const raw =
    trimmed.length > 0
      ? await requestApi.searchOutgoingOrAccepted(date, trimmed)
      : await requestApi.getOutgoingOrAccepted(date);
  return normalizeList<RequestStatusDto>(raw)
    .map(mapRequestDto)
    .filter((row) => row.id.length > 0);
}

export function useOfficials() {
  return useQuery({
    queryKey: adminQueryKeys.officials,
    queryFn: async () => {
      const rows = normalizeList<OfficialDto>(await officialsApi.getOfficials());
      return rows.map(mapOfficialDto);
    },
  });
}

export function useAddOfficial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddOfficialCommand) => officialsApi.addOfficial(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.officials });
    },
  });
}

export function useEditOfficial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      officialId: string;
      name: string;
      lastName: string;
      phoneNumber: string;
    }) => {
      await officialsApi.editOfficial(input.officialId, {
        name: input.name,
        lastName: input.lastName,
        phoneNumber: input.phoneNumber,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.officials });
    },
  });
}

export function useToggleOfficialStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (row: AdminOfficialRow) => {
      await officialsApi.editOfficial(row.id, {
        name: row.firstName,
        lastName: row.lastName,
        phoneNumber: row.mobile,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.officials });
    },
  });
}

export function useDeleteOfficial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (officialId: string) => officialsApi.deleteOfficial(officialId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.officials });
    },
  });
}

export function useRequestedRequests(date: string) {
  return useQuery({
    queryKey: adminQueryKeys.requestedRequests(date),
    enabled: Boolean(date),
    queryFn: async () => {
      const raw = await requestApi.getRequestedRequests(date);
      return normalizeList<RequestStatusDto>(raw)
        .map(mapRequestDto)
        .filter((row) => row.id.length > 0);
    },
  });
}

export function useIncomingRequests(date: string, search: string) {
  return useQuery({
    queryKey: adminQueryKeys.incoming(date, search),
    enabled: Boolean(date),
    queryFn: () => fetchIncomingRequests(date, search),
  });
}

export function useOutgoingRequests(date: string, search: string) {
  return useQuery({
    queryKey: adminQueryKeys.outgoing(date, search),
    enabled: Boolean(date),
    queryFn: () => fetchOutgoingRequests(date, search),
  });
}

export function useRequests(date: string, search: string) {
  return useQuery({
    queryKey: adminQueryKeys.requests(date, search),
    enabled: Boolean(date),
    queryFn: async () => {
      const [incoming, outgoing] = await Promise.all([
        fetchIncomingRequests(date, search),
        fetchOutgoingRequests(date, search),
      ]);

      const unique = new Map<string, (typeof incoming)[number]>();
      for (const row of [...incoming, ...outgoing]) {
        unique.set(row.id, row);
      }
      return [...unique.values()];
    },
  });
}

export function useAcceptRequest(date: string, search = "") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      roomAvailabilityIds,
      assignAmount,
    }: {
      requestId: string;
      roomAvailabilityIds?: string[];
      /** When set, also calls AddRoomAvailability for each id (amount per call). */
      assignAmount?: number;
    }) => {
      const ids = roomAvailabilityIds ?? [];
      await requestApi.acceptRequest(requestId, ids);

      // Some backends ignore roomAvailabilityIds on Accept — assign explicitly.
      if (ids.length > 0 && typeof assignAmount === "number") {
        const amount = Math.max(1, assignAmount);
        await Promise.allSettled(
          ids.map((roomAvailabilityId) =>
            requestApi.addRoomAvailabilityToAcceptedRequest(
              requestId,
              roomAvailabilityId,
              {
                requestId,
                roomAvailabilityId,
                amount,
              },
            ),
          ),
        );
      }
    },
    onSuccess: () => {
      invalidateRequestQueries(queryClient, date, search);
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(date) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(date),
      });
    },
  });
}

export function useRejectRequest(date: string, search = "") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => requestApi.rejectRequest(requestId),
    onSuccess: () => {
      invalidateRequestQueries(queryClient, date, search);
    },
  });
}

/**
 * PUT /{requestId}/RoomAvailabilities/{roomAvailabilityId}/AddRoomAvailability
 * Assign (or top-up) a room slot on an already-accepted request.
 */
export function useAddRoomAvailabilityToAcceptedRequest(
  date: string,
  search = "",
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      roomAvailabilityId,
      amount = 1,
    }: {
      requestId: string;
      roomAvailabilityId: string;
      amount?: number;
    }) =>
      requestApi.addRoomAvailabilityToAcceptedRequest(
        requestId,
        roomAvailabilityId,
        {
          requestId,
          roomAvailabilityId,
          amount,
        },
      ),
    onSuccess: () => {
      invalidateRequestQueries(queryClient, date, search);
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(date) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(date),
      });
    },
  });
}

export function useChangeEntranceDate(date: string, search = "") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      date: newDate,
    }: {
      requestId: string;
      date: string;
    }) =>
      requestApi.changeDateOfEntrance(requestId, {
        requestId,
        date: newDate,
      }),
    onSuccess: () => {
      invalidateRequestQueries(queryClient, date, search);
    },
  });
}

export function useChangeExitDate(date: string, search = "") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      requestId,
      date: newDate,
    }: {
      requestId: string;
      date: string;
    }) =>
      requestApi.changeDateOfExit(requestId, {
        requestId,
        date: newDate,
      }),
    onSuccess: () => {
      invalidateRequestQueries(queryClient, date, search);
    },
  });
}

export function useDownloadRequestPdf() {
  return useMutation({
    mutationFn: (requestId: string) => requestApi.downloadIndividualRequestPdf(requestId),
  });
}

export function useRoomAvailabilities(date: string) {
  return useQuery({
    queryKey: adminQueryKeys.rooms(date),
    enabled: Boolean(date),
    queryFn: async () => {
      // Range endpoint returns RoomAvailabilityDto with roomId/roomName/ids.
      // Single-date GET returns a thinner DTO without room UUID — avoid it for management.
      const raw = await roomApi.getRoomAvailabilitiesByRange(date, date);
      return normalizeRoomAvailabilityList(raw);
    },
  });
}

export function useRoomAvailabilitiesRange(enterDate: string, exitDate: string) {
  return useQuery({
    queryKey: adminQueryKeys.roomsRange(enterDate, exitDate),
    enabled: Boolean(enterDate && exitDate),
    queryFn: async () => {
      const raw = await roomApi.getRoomAvailabilitiesByRange(enterDate, exitDate);
      return normalizeRoomAvailabilityList(raw);
    },
  });
}

export function useDistinctRoomAvailabilities(requestId: string) {
  return useQuery({
    queryKey: adminQueryKeys.distinctRooms(requestId),
    enabled: Boolean(requestId),
    queryFn: async () => {
      const raw = await roomApi.getDistinctRoomAvailabilities(requestId);
      return normalizeRoomAvailabilityList(raw);
    },
  });
}

function normalizeRoomAvailabilityList(raw: unknown): RoomAvailabilityRow[] {
  if (Array.isArray(raw)) {
    return (raw as RoomAvailabilityDto[]).map((dto) =>
      mapRoomAvailabilityDto(dto),
    );
  }
  if (raw && typeof raw === "object") {
    const grouped = raw as {
      // Range: MaleRoomAvailabilities / FemaleRoomAvailabilities
      maleRoomAvailabilities?: RoomAvailabilityDto[];
      femaleRoomAvailabilities?: RoomAvailabilityDto[];
      MaleRoomAvailabilities?: RoomAvailabilityDto[];
      FemaleRoomAvailabilities?: RoomAvailabilityDto[];
      // Distinct: MaleAvailability / FemaleAvailability
      maleAvailability?: RoomAvailabilityDto[];
      femaleAvailability?: RoomAvailabilityDto[];
      MaleAvailability?: RoomAvailabilityDto[];
      FemaleAvailability?: RoomAvailabilityDto[];
      rooms?: RoomAvailabilityDto[];
      Rooms?: RoomAvailabilityDto[];
      items?: RoomAvailabilityDto[];
      Items?: RoomAvailabilityDto[];
      value?: RoomAvailabilityDto[];
      Value?: RoomAvailabilityDto[];
    };
    const list =
      grouped.rooms ??
      grouped.Rooms ??
      grouped.items ??
      grouped.Items ??
      grouped.value ??
      grouped.Value ??
      null;
    if (Array.isArray(list)) {
      return list.map((dto) => mapRoomAvailabilityDto(dto));
    }
    const males = (
      grouped.maleRoomAvailabilities ??
      grouped.MaleRoomAvailabilities ??
      grouped.maleAvailability ??
      grouped.MaleAvailability ??
      []
    ).map((dto) => mapRoomAvailabilityDto(dto, Gender.Male));
    const females = (
      grouped.femaleRoomAvailabilities ??
      grouped.FemaleRoomAvailabilities ??
      grouped.femaleAvailability ??
      grouped.FemaleAvailability ??
      []
    ).map((dto) => mapRoomAvailabilityDto(dto, Gender.Female));
    return [...males, ...females];
  }
  return [];
}

export function useRoomReportStats(date: string) {
  return useQuery({
    queryKey: adminQueryKeys.roomStats(date),
    enabled: Boolean(date),
    queryFn: async () => {
      const data = await roomApi.getRoomReportStats(date);
      return mapRoomReportStats(data);
    },
  });
}

/** GET /Room — list of all rooms with UUID. */
export function useAllRooms(enabled = true) {
  return useQuery({
    queryKey: ["admin", "rooms", "all"] as const,
    enabled,
    queryFn: async () => {
      const raw = await roomApi.getRooms();
      if (Array.isArray(raw)) {
        return (raw as RoomDto[]).map((dto) => ({
          roomId: readString(
            (dto as { roomId?: string; RoomId?: string }).roomId ??
              (dto as { roomId?: string; RoomId?: string }).RoomId ??
              dto.id ??
              dto.Id,
          ),
          name: readString(dto.name ?? dto.Name),
          gender: dto.gender ?? dto.Gender,
          capacity: readNumber(dto.capacity ?? dto.Capacity),
        }));
      }
      return normalizeRoomAvailabilityList(raw).map((row) => ({
        roomId: row.roomId,
        name: row.className,
        gender: row.gender === "زن" ? Gender.Female : Gender.Male,
        capacity: row.capacity,
      }));
    },
    retry: false,
  });
}

/** Extract room UUID from POST /Room response `{ id, roomId, message }`. */
export function extractRoomId(created: unknown): string {
  if (typeof created === "string") {
    const match = created.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
    return match?.[0] ?? "";
  }
  if (!created || typeof created !== "object") return "";
  const row = created as Record<string, unknown>;
  const nested =
    (row.result as Record<string, unknown> | undefined) ??
    (row.Result as Record<string, unknown> | undefined) ??
    row;
  const raw =
    nested.id ??
    nested.Id ??
    nested.roomId ??
    nested.RoomId ??
    (typeof nested === "string" ? nested : "");
  if (typeof raw === "string" && raw.trim()) {
    const match = raw.match(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
    );
    return match?.[0] ?? raw.trim();
  }
  return "";
}

function mapRoomDto(dto: RoomDto & { roomId?: string; RoomId?: string }): {
  roomId: string;
  name: string;
  gender: Gender | undefined;
  capacity: number;
} {
  return {
    roomId: readString(dto.roomId ?? dto.RoomId ?? dto.id ?? dto.Id),
    name: readString(dto.name ?? dto.Name).trim().toLowerCase(),
    gender: dto.gender ?? dto.Gender,
    capacity: readNumber(dto.capacity ?? dto.Capacity),
  };
}

/** Resolve a newly created room UUID via GET /Room (if available) or range list. */
async function resolveRoomIdFromLists(match: {
  name?: string | null;
  gender?: Gender;
  capacity?: number;
}): Promise<string> {
  const nameKey = (match.name ?? "").trim().toLowerCase();

  try {
    const raw = await roomApi.getRooms();
    const list = Array.isArray(raw)
      ? (raw as RoomDto[]).map(mapRoomDto)
      : normalizeRoomAvailabilityList(raw).map((row) => ({
          roomId: row.roomId,
          name: row.className.trim().toLowerCase(),
          gender:
            row.gender === "زن" ? Gender.Female : Gender.Male,
          capacity: row.capacity,
        }));

    const hit = list.find((r) => {
      if (!r.roomId) return false;
      if (nameKey && r.name !== nameKey) return false;
      if (
        match.gender !== undefined &&
        r.gender !== undefined &&
        r.gender !== match.gender
      ) {
        return false;
      }
      if (
        typeof match.capacity === "number" &&
        match.capacity > 0 &&
        r.capacity > 0 &&
        r.capacity !== match.capacity
      ) {
        return false;
      }
      return true;
    });
    if (hit?.roomId) return hit.roomId;
  } catch {
    // GET /Room is currently 405 — fall through to availabilities list.
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const raw = await roomApi.getRoomAvailabilitiesByRange(today, today);
    const rows = normalizeRoomAvailabilityList(raw);
    const hit = rows.find((row) => {
      if (!row.roomId) return false;
      if (nameKey && row.className.trim().toLowerCase() !== nameKey) {
        return false;
      }
      if (match.gender !== undefined) {
        const rowGender =
          row.gender === "زن" ? Gender.Female : Gender.Male;
        if (rowGender !== match.gender) return false;
      }
      if (
        typeof match.capacity === "number" &&
        match.capacity > 0 &&
        row.capacity > 0 &&
        row.capacity !== match.capacity
      ) {
        return false;
      }
      return true;
    });
    if (hit?.roomId) return hit.roomId;
  } catch {
    // ignore
  }

  return "";
}

/** POST /Room only — does not attach availability. */
export function useCreateRoom() {
  return useMutation({
    mutationFn: async (body: AddRoomCommand) => {
      const created = await roomApi.addRoom({
        name: body.name,
        gender: body.gender,
        capacity: body.capacity,
      });
      let roomId = extractRoomId(created);
      if (!roomId) {
        roomId = await resolveRoomIdFromLists(body);
      }
      return { created, roomId };
    },
  });
}

/**
 * Create room (if needed) then POST RoomAvailability for `availabilityDate` or hook `date`.
 * When backend omits UUID, tries GET /Room (get-all) then date list; else pass `roomId` from form.
 */
export function useAddRoom(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      body: AddRoomCommand & {
        roomId?: string;
        availabilityDate?: string;
        exitDate?: string;
      },
    ) => {
      let roomId = body.roomId?.trim() ?? "";
      let created: unknown = null;

      if (!roomId) {
        created = await roomApi.addRoom({
          name: body.name,
          gender: body.gender,
          capacity: body.capacity,
        });
        roomId = extractRoomId(created);
        if (!roomId) {
          roomId = await resolveRoomIdFromLists({
            name: body.name,
            gender: body.gender,
            capacity: body.capacity,
          });
        }
      }

      if (!roomId) {
        throw new Error(
          "اتاق ساخته شد ولی بک‌اند شناسه (UUID) برنگرداند. شناسه اتاق را در فیلد UUID وارد کنید و دوباره ذخیره کنید تا تاریخ ظرفیت فعال شود.",
        );
      }

      const availabilityDate = body.availabilityDate?.trim() || date;
      const exitDate = body.exitDate?.trim() || availabilityDate;
      if (availabilityDate) {
        await roomApi.addRoomAvailability(roomId, {
          roomId,
          dateOfAvailability: availabilityDate,
          exitDate: exitDate !== availabilityDate ? exitDate : undefined,
        });
      }

      return { created, roomId, availabilityDate, exitDate };
    },
    onSuccess: (_data, variables) => {
      const target = variables.availabilityDate?.trim() || date;
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(date) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(date),
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "rooms", "all"],
      });
      if (target !== date) {
        void queryClient.invalidateQueries({
          queryKey: adminQueryKeys.rooms(target),
        });
        void queryClient.invalidateQueries({
          queryKey: adminQueryKeys.roomStats(target),
        });
      }
    },
  });
}

export function useGenderStats(year: string) {
  return useQuery({
    queryKey: ["admin", "gender-stats", year] as const,
    enabled: Boolean(year),
    queryFn: async () => {
      const raw = await requestApi.genderStatsInYear({ year });
      return normalizeGenderStats(raw);
    },
    retry: false,
  });
}

export function useRequestTypeStats(year: string) {
  return useQuery({
    queryKey: ["admin", "request-type-stats", year] as const,
    enabled: Boolean(year),
    queryFn: async () => {
      const raw = await requestApi.requestTypeStats({ year });
      return normalizeRequestTypeStats(raw);
    },
    retry: false,
  });
}

export function useRequestedRequestsAmount(date: string) {
  return useQuery({
    queryKey: ["admin", "requested-amount", date] as const,
    enabled: Boolean(date),
    queryFn: () => requestApi.requestedRequestsAmount(date),
    retry: false,
  });
}

function normalizeGenderStats(raw: unknown): { name: string; value: number }[] {
  if (!raw || typeof raw !== "object") return [];
  const row = raw as Record<string, unknown>;
  // GenderStatsInAYearDto: maleAmount / femaleAmount
  const male = readNumber(
    row.maleAmount ??
      row.MaleAmount ??
      row.maleCount ??
      row.MaleCount ??
      row.male ??
      row.Male,
  );
  const female = readNumber(
    row.femaleAmount ??
      row.FemaleAmount ??
      row.femaleCount ??
      row.FemaleCount ??
      row.female ??
      row.Female,
  );
  if (male || female) {
    return [
      { name: "مرد", value: male },
      { name: "زن", value: female },
    ];
  }
  const list =
    (row.items as unknown[]) ??
    (row.Items as unknown[]) ??
    (Array.isArray(raw) ? (raw as unknown[]) : null);
  if (!list) return [];
  return list.map((item) => {
    const r = (item ?? {}) as Record<string, unknown>;
    return {
      name: readString(r.name ?? r.Name ?? r.gender ?? r.Gender, "—"),
      value: readNumber(r.value ?? r.Value ?? r.count ?? r.Count),
    };
  });
}

function normalizeRequestTypeStats(
  raw: unknown,
): { name: string; uv: number; pv: number }[] {
  if (!raw || typeof raw !== "object") return [];
  const row = raw as Record<string, unknown>;

  // BiennialBookingStatsDto — current year = uv, previous year = pv
  const caravan = readNumber(row.caravanAmount ?? row.CaravanAmount);
  const individual = readNumber(
    row.individualAmount ?? row.IndividualAmount,
  );
  const prevCaravan = readNumber(
    row.previousCaravanAmount ?? row.PreviousCaravanAmount,
  );
  const prevIndividual = readNumber(
    row.previousIndividualAmount ?? row.PreviousIndividualAmount,
  );
  if (caravan || individual || prevCaravan || prevIndividual) {
    return [
      { name: "رزرو کاروان", uv: caravan, pv: prevCaravan },
      { name: "رزرو عمومی", uv: individual, pv: prevIndividual },
    ];
  }

  const list = Array.isArray(raw)
    ? raw
    : (row.items as unknown[]) ?? (row.Items as unknown[]) ?? [];
  if (!Array.isArray(list) || list.length === 0) {
    const onsite = readNumber(row.onsite ?? row.Onsite ?? row.walkIn);
    const publicRes = readNumber(row.public ?? row.Public ?? row.individual);
    const caravanLegacy = readNumber(row.caravan ?? row.Caravan);
    if (onsite || publicRes || caravanLegacy) {
      return [
        { name: "رزرو حضوری", uv: onsite, pv: onsite },
        { name: "رزرو عمومی", uv: publicRes, pv: publicRes },
        { name: "رزرو کاروان", uv: caravanLegacy, pv: caravanLegacy },
      ];
    }
    return [];
  }
  return list.map((item) => {
    const r = (item ?? {}) as Record<string, unknown>;
    const value = readNumber(r.value ?? r.Value ?? r.count ?? r.Count);
    return {
      name: readString(r.name ?? r.Name ?? r.type ?? r.Type, "—"),
      uv: readNumber(r.uv ?? r.UV ?? value),
      pv: readNumber(r.pv ?? r.PV ?? value),
    };
  });
}

export function useDeleteRoom(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (roomId: string) => roomApi.deleteRoom(roomId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(date) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(date),
      });
    },
  });
}

export function useAddRoomAvailability(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      date: availabilityDate,
      exitDate,
    }: {
      roomId: string;
      capacity?: number;
      date: string;
      exitDate?: string;
    }) => {
      const enter = availabilityDate.trim();
      const exit = (exitDate ?? enter).trim();
      return roomApi.addRoomAvailability(roomId, {
        roomId,
        dateOfAvailability: enter,
        exitDate: exit !== enter ? exit : undefined,
      });
    },
    onSuccess: (_data, variables) => {
      const target = variables.date || date;
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(target) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(target),
      });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(date) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(date),
      });
    },
  });
}

/** PUT /Room/{roomId}/{roomAvailabilityId}/ChangeDate */
export function useChangeRoomAvailabilityDate(date: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      roomAvailabilityId,
      newDate,
    }: {
      roomId: string;
      roomAvailabilityId: string;
      newDate: string;
    }) =>
      roomApi.changeRoomAvailabilityDate(roomId, roomAvailabilityId, {
        availabilityId: roomAvailabilityId,
        newDate,
      }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(date) });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(date),
      });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.rooms(variables.newDate),
      });
      void queryClient.invalidateQueries({
        queryKey: adminQueryKeys.roomStats(variables.newDate),
      });
    },
  });
}

export function useIndividuals(search = "") {
  const trimmed = search.trim();
  return useQuery({
    queryKey: adminQueryKeys.individuals(trimmed),
    queryFn: async () => {
      const raw =
        trimmed.length > 0
          ? await individualApi.searchIndividuals(trimmed)
          : await individualApi.getIndividuals();
      return normalizeList<IndividualPrincipalDto>(raw).map((dto) =>
        mapPrincipalToAdminUser(dto, "individual"),
      );
    },
  });
}

export function useCaravans(search = "") {
  const trimmed = search.trim();
  return useQuery({
    queryKey: adminQueryKeys.caravans(trimmed),
    queryFn: async () => {
      const raw =
        trimmed.length > 0
          ? await caravanApi.searchCaravans(trimmed)
          : await caravanApi.getCaravans();
      return normalizeList<CaravanPrincipalDto>(raw).map((dto) =>
        mapPrincipalToAdminUser(dto, "caravan"),
      );
    },
  });
}

export function useAllPrincipals(search = "") {
  const trimmed = search.trim();
  return useQuery({
    queryKey: adminQueryKeys.principals(trimmed),
    queryFn: async () => {
      const [individuals, caravans] = await Promise.all([
        trimmed.length > 0
          ? individualApi.searchIndividuals(trimmed)
          : individualApi.getIndividuals(),
        trimmed.length > 0
          ? caravanApi.searchCaravans(trimmed)
          : caravanApi.getCaravans(),
      ]);
      const individualRows = normalizeList<IndividualPrincipalDto>(individuals).map(
        (dto) => mapPrincipalToAdminUser(dto, "individual"),
      );
      const caravanRows = normalizeList<CaravanPrincipalDto>(caravans).map((dto) =>
        mapPrincipalToAdminUser(dto, "caravan"),
      );
      return [...individualRows, ...caravanRows];
    },
  });
}

export function useActivatePrincipal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      type,
      id,
      active,
    }: {
      type: "individual" | "caravan";
      id: string;
      active: boolean;
    }) => {
      if (type === "individual") {
        await individualApi.activateOrDeactivateIndividual(id, active);
        return;
      }
      await caravanApi.activateOrDeactivateCaravan(id, active);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "individuals"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "caravans"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "principals"] });
    },
  });
}

export function useDeleteCaravan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (caravanId: string) => caravanApi.deleteCaravan(caravanId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "caravans"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "principals"] });
    },
  });
}

export function useUpdateCaravan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      caravanId,
      body,
    }: {
      caravanId: string;
      body: Omit<ChangeCaravanProfileCommand, "caravanId">;
    }) =>
      caravanApi.changeCaravanPrincipal(caravanId, {
        ...body,
        caravanId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "caravans"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "principals"] });
    },
  });
}

export function useUpdateIndividual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      individualId,
      body,
    }: {
      individualId: string;
      body: Omit<ChangeIndividualProfileCommand, "individualId">;
    }) =>
      individualApi.changeIndividualProfile(individualId, {
        ...body,
        individualId,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "individuals"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "principals"] });
    },
  });
}

/** Onsite walk-ins have no birth date field — backend still marks it [Required]. */
const ONSITE_PLACEHOLDER_BIRTH_DATE = "2000-01-01";

function buildOnsiteSignInCommand(
  pilgrim: PilgrimFormValues,
): IndividualSignInCommand {
  const isForeign = pilgrim.nationality === "foreign";
  const nationalCode = pilgrim.nationalCode.trim();
  return {
    name: pilgrim.firstName.trim(),
    familyName: pilgrim.lastName.trim(),
    nationalCode: isForeign ? "" : nationalCode,
    dateOfBirth: ONSITE_PLACEHOLDER_BIRTH_DATE,
    gender: genderToApi(pilgrim.gender),
    passportNumber: isForeign ? nationalCode : "",
    gmail: "",
    phoneNumber: pilgrim.mobile1,
    emergencyPhoneNumber: pilgrim.relativePhone,
    username: nationalCode,
    password: nationalCode,
    bloodType: bloodTypeToApi(pilgrim.bloodType) ?? BloodType.OPositive,
  };
}

/** Registers the walk-in as a new individual, falling back to an existing match by national code. */
async function resolveOnsiteIndividualId(pilgrim: PilgrimFormValues): Promise<string> {
  const nationalCode = pilgrim.nationalCode.trim();

  try {
    const result = await individualApi.individualSignIn(
      buildOnsiteSignInCommand(pilgrim),
    );
    if (result.principalId) return result.principalId;
  } catch {
    // Most likely the individual already exists — fall through to search.
  }

  const matches = normalizeList<IndividualPrincipalDto>(
    await individualApi.searchIndividuals(nationalCode),
  );
  const found =
    matches.find(
      (dto) => readString(dto.nationalCode ?? dto.NationalCode) === nationalCode,
    ) ?? matches[0];
  const foundId = readString(found?.id ?? found?.Id);

  if (!foundId) {
    throw new Error("ثبت‌نام زائر ناموفق بود و کاربر مشابهی نیز یافت نشد.");
  }
  return foundId;
}

export function useOnsiteRegistration(dateKey: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pilgrims: PilgrimFormValues[]) => {
      const first = pilgrims[0];
      if (!first) throw new Error("اطلاعات زائر ثبت نشده است.");

      const individualId = await resolveOnsiteIndividualId(first);
      const dateOfEntrance = persianDateToIsoDateTime(dateKey);
      const maleAmount = pilgrims.filter((p) => p.gender === "male").length;
      const femaleAmount = pilgrims.filter((p) => p.gender === "female").length;

      return individualApi.reserveRoom(individualId, {
        dateOfEntrance,
        dateOfExit: dateOfEntrance,
        maleAmount,
        femaleAmount,
        travelers: pilgrims.map(pilgrimToTravelerDto),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.rooms(dateKey) });
      void queryClient.invalidateQueries({ queryKey: adminQueryKeys.roomStats(dateKey) });
      void queryClient.invalidateQueries({ queryKey: ["admin", "room-stats-range"] });
    },
  });
}

export function useDateCarouselStats(dates: string[]) {
  return useQuery({
    queryKey: adminQueryKeys.roomStatsRange(dates),
    enabled: dates.length > 0,
    queryFn: async () => {
      const results = await Promise.allSettled(
        dates.map(async (date) => {
          const stats = await roomApi.getRoomReportStats(date);
          return { date, stats: mapRoomReportStats(stats) };
        }),
      );

      const map = new Map<
        string,
        { totalReservations: number; reserved: number; remaining: number }
      >();

      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const { date, stats } = result.value;
        map.set(date, {
          totalReservations: stats.totalCapacity,
          reserved: stats.reservedCapacity,
          remaining: stats.availableCapacity,
        });
      }

      return map;
    },
  });
}
