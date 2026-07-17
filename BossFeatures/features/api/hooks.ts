"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { caravanApi, faqApi, requestApi } from "@/lib/api";
import {
  bloodTypeToApi,
  genderFromApi,
  genderToApi,
  individualToProfileForm,
  requestToReservation,
} from "@/lib/api/mappers";
import { isoDateToPersianDate, persianDateToIsoDate, persianDateToIsoDateTime } from "@/lib/api/dateFormat";
import { Gender } from "@/lib/api/types";
import type { CompanionDto, FaqDto, RequestDto } from "@/lib/api/types";
import type { BloodTypeOption } from "@/features/shared/constants/bloodTypes";
import type { Accompany } from "../components/ManagementSchema";
import type { ProfileFormValues } from "../lib/profileSchema";
import type { PilgrimFormValues } from "../components/AddKarevan/FormSchemas";

export function useBossId() {
  return useAuthStore((s) =>
    s.principalType === "caravan" ? (s.principalId ?? null) : null,
  );
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function readStr(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function requestToReservationList(dto: RequestDto, index: number) {
  const row = requestToReservation(dto, index);
  return {
    id: row.id,
    radif: row.radif,
    reservationCode: row.reservationCode,
    checkIn: row.checkIn,
    checkOut: row.checkOut,
    companionsCount: row.companionsCount,
    supervisorName: row.supervisorName,
    maleCount: row.maleCount,
    femaleCount: row.femaleCount,
    pilgrims: row.pilgrims,
    status: row.status,
    _apiId: row._apiId,
  };
}

function companionToBossAccompany(dto: CompanionDto, index: number): Accompany {
  const name = readStr(dto.name ?? dto.Name);
  const familyName = readStr(dto.familyName ?? dto.FamilyName);
  const genderVal = dto.gender ?? dto.Gender;
  const nationalCode = readStr(dto.nationalCode ?? dto.NationalCode);
  // Pilgrim delete API keys by nationalCode — keep it as the row id.
  const rawId =
    nationalCode ||
    readStr(dto.companionId ?? dto.CompanionId ?? dto.id ?? dto.Id) ||
    `temp-${index}`;

  return {
    id: rawId,
    fullName: [name, familyName].filter(Boolean).join(" "),
    fatherName: "",
    gender: genderFromApi(genderVal as never),
    birthDate: isoDateToPersianDate(readStr(dto.dateOfBirth ?? dto.DateOfBirth)),
    city: "",
    nationality: nationalCode ? "iranian" : "foreign",
    nationalCode,
    passportNumber: readStr(dto.passportNumber ?? dto.PassportNumber),
    passportExpiry: "",
    bloodType: "O+" satisfies BloodTypeOption,
    diseaseHistory: "",
    mobile1: readStr(dto.phoneNumber ?? dto.PhoneNumber),
    mobile2: "",
    relativePhone: readStr(dto.emergencyPhoneNumber ?? dto.EmergencyPhoneNumber),
    gmail: "",
  };
}

function normalizeList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    for (const key of ["value", "Value", "items", "Items", "data", "Data"]) {
      if (Array.isArray(r[key])) return r[key] as T[];
    }
  }
  return [];
}

// ─── Query keys ──────────────────────────────────────────────────────────────

export const bossQueryKeys = {
  requests: (id: string) => ["boss", "requests", id] as const,
  companions: (id: string, search: string) => ["boss", "companions", id, search] as const,
  profile: (id: string) => ["boss", "profile", id] as const,
  faqs: () => ["boss", "faqs"] as const,
};

// ─── Reservations ─────────────────────────────────────────────────────────────

export function useBossRequests() {
  const bossId = useBossId();
  return useQuery({
    queryKey: bossQueryKeys.requests(bossId ?? ""),
    queryFn: async () => {
      if (!bossId) return [];
      const raw = await caravanApi.getCaravanRequests(bossId);
      const list = normalizeList<RequestDto>(raw);
      return list.map(requestToReservationList);
    },
    enabled: !!bossId,
  });
}

export function useDownloadBossRequestPdf() {
  return useMutation({
    mutationFn: (requestId: string) =>
      requestApi.downloadIndividualRequestPdf(requestId),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reservation.pdf";
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}

// ─── Companions ───────────────────────────────────────────────────────────────

export function useBossCompanions(search = "") {
  const bossId = useBossId();
  return useQuery({
    queryKey: bossQueryKeys.companions(bossId ?? "", search),
    queryFn: async () => {
      if (!bossId) return [];
      const raw = search.trim()
        ? await caravanApi.searchPilgrims(bossId, search.trim())
        : await caravanApi.getPilgrims(bossId);
      const list = normalizeList<CompanionDto>(raw);
      return list.map(companionToBossAccompany);
    },
    enabled: !!bossId,
  });
}

export function useAddBossCompanion() {
  const qc = useQueryClient();
  const bossId = useBossId();
  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!bossId) throw new Error("وارد حساب کاروان نشده‌اید.");
      const parts = values.fullName.trim().split(/\s+/).filter(Boolean);
      const isForeign = values.nationality === "foreign";
      return caravanApi.addPilgrim(bossId, {
        name: parts[0] ?? "",
        familyName: parts.slice(1).join(" "),
        nationalCode: isForeign ? "" : values.nationalCode,
        passportNumber: isForeign
          ? values.passportNumber || values.nationalCode || ""
          : values.passportNumber || "",
        dateOfBirth: persianDateToIsoDate(values.birthDate),
        phoneNumber: values.mobile1 || "",
        emergencyPhoneNumber: values.relativePhone || "",
        gender: genderToApi(values.gender),
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["boss", "companions", bossId ?? ""] });
    },
  });
}

export function useRemoveBossCompanion() {
  const qc = useQueryClient();
  const bossId = useBossId();
  return useMutation({
    mutationFn: async (nationalCode: string) => {
      if (!bossId) throw new Error("وارد حساب کاروان نشده‌اید.");
      return caravanApi.removePilgrim(bossId, { nationalCode });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["boss", "companions", bossId ?? ""] });
    },
  });
}

export function useUploadBossCompanionFile() {
  const qc = useQueryClient();
  const bossId = useBossId();
  return useMutation({
    mutationFn: async (file: File) => {
      if (!bossId) throw new Error("وارد حساب کاروان نشده‌اید.");
      return caravanApi.uploadPilgrimsExcel(bossId, file);
    },
    onSuccess: (raw) => {
      if (bossId && Array.isArray(raw)) {
        const list = raw as CompanionDto[];
        qc.setQueryData(
          bossQueryKeys.companions(bossId, ""),
          list.map(companionToBossAccompany),
        );
      }
      void qc.invalidateQueries({ queryKey: ["boss", "companions", bossId ?? ""] });
    },
  });
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export function useBossProfile() {
  const bossId = useBossId();
  return useQuery({
    queryKey: bossQueryKeys.profile(bossId ?? ""),
    queryFn: async () => {
      if (!bossId) return null;
      const raw = await caravanApi.getCaravan(bossId);
      return individualToProfileForm(raw);
    },
    enabled: !!bossId,
  });
}

export function useUpdateBossProfile() {
  const qc = useQueryClient();
  const bossId = useBossId();
  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!bossId) throw new Error("وارد حساب کاروان نشده‌اید.");
      const parts = values.fullName.trim().split(/\s+/).filter(Boolean);
      const isForeign = values.nationality === "foreign";
      await caravanApi.changeCaravanPrincipal(bossId, {
        caravanId: bossId,
        name: parts[0] ?? "",
        familyName: parts.slice(1).join(" "),
        nationalCode: isForeign ? "" : values.nationalCode,
        passportNumber: isForeign
          ? values.passportNumber || values.nationalCode
          : values.passportNumber,
        dateOfBirth: persianDateToIsoDate(values.birthDate),
        phoneNumber: values.mobile1,
        emergencyPhoneNumber: values.relativePhone,
        gender: genderToApi(values.gender),
        bloodType: bloodTypeToApi(values.bloodType),
        gmail: values.gmail.trim(),
      });
      useAuthStore.getState().updateProfile({
        name: values.fullName.trim(),
        phone: values.mobile1,
        email: values.gmail.trim(),
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: bossQueryKeys.profile(bossId ?? "") });
      void qc.invalidateQueries({ queryKey: ["principal-settings"] });
    },
  });
}

// ─── Reserve (Caravan SendRequest) ───────────────────────────────────────────

type ReservePayload = {
  entryDate: string;
  exitDate: string;
  maleAmount: number;
  femaleAmount: number;
  supervisorName?: string;
  pilgrims?: PilgrimFormValues[];
};

export type ReserveResult = {
  /** Full request UUID from the API. */
  requestId: string;
  /** Short display code (first 8 chars of UUID). */
  reserveCode: string;
  maleCount: number;
  femaleCount: number;
  supervisorName: string;
  pilgrims: PilgrimFormValues[];
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function asIdString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function extractRequestIdFromResponse(raw: unknown): string | null {
  if (typeof raw === "string") {
    const trimmed = raw.trim().replace(/^"|"$/g, "");
    if (trimmed) return trimmed;
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const candidates = [
    r.requestId,
    r.RequestId,
    r.id,
    r.Id,
    r.reservationCode,
    r.ReservationCode,
    r.result,
    r.Result,
    r.response,
    r.Response,
    r.value,
    r.Value,
    r.data,
    r.Data,
  ];
  for (const value of candidates) {
    const nested = extractRequestIdFromResponse(value);
    if (nested) return nested;
    const direct = asIdString(value);
    if (direct && (UUID_RE.test(direct) || direct.length >= 8)) return direct;
  }
  return null;
}

async function resolveCaravanRequestId(
  caravanId: string,
  enterTime: string,
  maleAmount: number,
  femaleAmount: number,
  raw: unknown,
): Promise<string> {
  const fromResponse = extractRequestIdFromResponse(raw);
  if (fromResponse) return fromResponse;

  const enterDate = enterTime.slice(0, 10);
  const attempts = [0, 400, 900, 1600];

  for (const delay of attempts) {
    if (delay > 0) await sleep(delay);
    const listRaw = await caravanApi.getCaravanRequests(caravanId);
    const list = normalizeList<RequestDto>(listRaw);
    if (list.length === 0) continue;

    const scored = list
      .map((dto, index) => {
        const id =
          asIdString(dto.id) ??
          asIdString(dto.Id) ??
          asIdString(dto.requestId) ??
          asIdString(dto.RequestId) ??
          asIdString(dto.reservationCode) ??
          asIdString(dto.ReservationCode);
        const enter = readStr(dto.enterTime ?? dto.EnterTime).slice(0, 10);
        const male = dto.maleAmount ?? dto.MaleAmount;
        const female = dto.femaleAmount ?? dto.FemaleAmount;
        const state = dto.state ?? dto.State ?? 0;
        let score = index;
        if (enter === enterDate) score += 100;
        if (typeof male === "number" && male === maleAmount) score += 20;
        if (typeof female === "number" && female === femaleAmount) score += 20;
        if (state === 0 || state === 1) score += 10;
        return { id, score };
      })
      .filter((row): row is { id: string; score: number } => Boolean(row.id))
      .sort((a, b) => b.score - a.score);

    if (scored[0]?.id) return scored[0].id;
  }

  throw new Error(
    "درخواست ارسال شد ولی شناسه رزرو از سرور دریافت نشد. چند لحظه بعد صفحه را تازه کنید.",
  );
}

export function useBossReserve() {
  const bossId = useBossId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ReservePayload): Promise<ReserveResult> => {
      if (!bossId) throw new Error("وارد حساب کاروان نشده‌اید.");

      const enterTime = persianDateToIsoDateTime(payload.entryDate);
      const exitTime = persianDateToIsoDateTime(payload.exitDate);
      if (!enterTime || !exitTime) {
        throw new Error("تاریخ ورود و خروج را انتخاب کنید.");
      }
      if (payload.maleAmount + payload.femaleAmount < 1) {
        throw new Error("تعداد مرد یا زن باید حداقل ۱ باشد.");
      }

      // CaravanSendsRequestCommand — only counts + dates (no member names).
      const raw = await caravanApi.sendCaravanRequest(bossId, {
        maleAmount: payload.maleAmount,
        femaleAmount: payload.femaleAmount,
        enterTime,
        exitTime,
      });

      const requestId = await resolveCaravanRequestId(
        bossId,
        enterTime,
        payload.maleAmount,
        payload.femaleAmount,
        raw,
      );

      return {
        requestId,
        reserveCode: requestId.slice(0, 8).toUpperCase(),
        maleCount: payload.maleAmount,
        femaleCount: payload.femaleAmount,
        supervisorName: payload.supervisorName?.trim() || "—",
        pilgrims: payload.pilgrims ?? [],
      };
    },
    onSuccess: () => {
      if (bossId) {
        void qc.invalidateQueries({ queryKey: bossQueryKeys.requests(bossId) });
      }
    },
  });
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export function useFaqs() {
  return useQuery({
    queryKey: bossQueryKeys.faqs(),
    queryFn: async () => {
      const raw = await faqApi.getFaqs();
      const list = normalizeList<FaqDto>(raw);
      return list.map((f) => ({
        id: readStr(f.id ?? f.Id),
        question: readStr(f.question ?? f.Question),
        answer: readStr(f.answer ?? f.Answer),
      }));
    },
  });
}

export function useAddFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { question: string; answer: string }) =>
      faqApi.addFaq(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: bossQueryKeys.faqs() }),
  });
}

export function useEditFaq() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: { id: string; question: string; answer: string }) =>
      faqApi.editFaq(id, body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: bossQueryKeys.faqs() }),
  });
}
