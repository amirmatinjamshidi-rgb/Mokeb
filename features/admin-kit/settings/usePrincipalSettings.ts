"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { caravanApi, individualApi } from "@/lib/api";
import {
  bloodTypeToApi,
  genderToApi,
  individualToProfileForm,
} from "@/lib/api/mappers";
import { persianDateToIsoDate } from "@/lib/api/dateFormat";
import type {
  CaravanPrincipalDto,
  IndividualPrincipalDto,
} from "@/lib/api/types";
import type { ProfileFormValues } from "@/features/user-panel/lib/profileSchema";
import type {
  KarvanInformationFormValues,
  RepresentativeFormValues,
} from "@admin-kit/schemas/karvanInformationSchema";

export const principalSettingsKeys = {
  profile: (type: string, id: string) =>
    ["principal-settings", type, id] as const,
};

function usePrincipalContext() {
  const principalId = useAuthStore((s) => s.principalId);
  const principalType = useAuthStore((s) => s.principalType);
  const user = useAuthStore((s) => s.user);
  const isCaravan = principalType === "caravan";
  const isIndividual = principalType === "individual";
  return {
    principalId,
    principalType,
    user,
    isCaravan,
    isIndividual,
    enabled: Boolean(principalId && (isCaravan || isIndividual)),
  };
}

function readDto(
  dto: IndividualPrincipalDto | CaravanPrincipalDto | null | undefined,
) {
  if (!dto) return null;
  return individualToProfileForm(dto);
}

function dtoToKarvanForm(
  dto: IndividualPrincipalDto | CaravanPrincipalDto,
  fallbackName = "",
): KarvanInformationFormValues {
  const profile = individualToProfileForm(dto);
  return {
    caravanName: fallbackName,
    supervisorName: profile.fullName,
    mobile: profile.mobile1,
    landline: "",
    address: "",
    gender:
      profile.gender === "female"
        ? "female"
        : profile.gender === "male"
          ? "male"
          : "male",
  };
}

function dtoToRepresentative(
  dto: IndividualPrincipalDto | CaravanPrincipalDto,
): RepresentativeFormValues {
  const profile = individualToProfileForm(dto);
  return {
    fullName: profile.fullName,
    mobile: profile.mobile1,
  };
}

async function fetchPrincipal(principalId: string, isCaravan: boolean) {
  return isCaravan
    ? caravanApi.getCaravan(principalId)
    : individualApi.getIndividual(principalId);
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    name: parts[0] ?? "",
    familyName: parts.slice(1).join(" "),
  };
}

export function usePrincipalSettingsProfile() {
  const ctx = usePrincipalContext();

  return useQuery({
    queryKey: principalSettingsKeys.profile(
      ctx.principalType ?? "",
      ctx.principalId ?? "",
    ),
    enabled: ctx.enabled,
    queryFn: async () => {
      const dto = await fetchPrincipal(ctx.principalId!, ctx.isCaravan);
      return {
        dto,
        profile: readDto(dto)!,
        karvan: dtoToKarvanForm(dto, ctx.user?.caravanName ?? ""),
        representative: dtoToRepresentative(dto),
        phone: individualToProfileForm(dto).mobile1,
        isActive: Boolean(
          (dto as IndividualPrincipalDto).isActive ??
            (dto as IndividualPrincipalDto).IsActive ??
            true,
        ),
      };
    },
  });
}

export function useSaveKarvanInformation() {
  const ctx = usePrincipalContext();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: KarvanInformationFormValues) => {
      if (!ctx.principalId) throw new Error("وارد حساب کاربری نشده‌اید.");
      const current = await fetchPrincipal(ctx.principalId, ctx.isCaravan);
      const currentProfile = individualToProfileForm(current);
      const { name, familyName } = splitName(values.supervisorName);
      const gender =
        values.gender === "female"
          ? genderToApi("female")
          : genderToApi("male");

      if (ctx.isCaravan) {
        await caravanApi.changeCaravanPrincipal(ctx.principalId, {
          caravanId: ctx.principalId,
          name,
          familyName,
          nationalCode: currentProfile.nationalCode || "",
          dateOfBirth: persianDateToIsoDate(currentProfile.birthDate) || undefined,
          gender,
          passportNumber: currentProfile.passportNumber || "",
          gmail: "",
          phoneNumber: values.mobile,
          emergencyPhoneNumber: currentProfile.relativePhone || "",
          bloodType: bloodTypeToApi(currentProfile.bloodType),
        });
      } else {
        await individualApi.changeIndividualProfile(ctx.principalId, {
          individualId: ctx.principalId,
          name,
          familyName,
          nationalCode: currentProfile.nationalCode || "",
          dateOfBirth: persianDateToIsoDate(currentProfile.birthDate) || undefined,
          gender,
          passportNumber: currentProfile.passportNumber || "",
          gmail: "",
          phoneNumber: values.mobile,
          emergencyPhoneNumber: currentProfile.relativePhone || "",
          bloodType: bloodTypeToApi(currentProfile.bloodType),
        });
      }

      if (values.caravanName.trim()) {
        useAuthStore.getState().updateProfile({
          caravanName: values.caravanName.trim(),
        });
      }
    },
    onSuccess: () => {
      if (ctx.principalId) {
        void qc.invalidateQueries({
          queryKey: principalSettingsKeys.profile(
            ctx.principalType ?? "",
            ctx.principalId,
          ),
        });
      }
    },
  });
}

export function useSaveRepresentative() {
  const ctx = usePrincipalContext();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: RepresentativeFormValues) => {
      if (!ctx.principalId) throw new Error("وارد حساب کاربری نشده‌اید.");
      const current = await fetchPrincipal(ctx.principalId, ctx.isCaravan);
      const currentProfile = individualToProfileForm(current);
      const { name, familyName } = splitName(values.fullName);

      if (ctx.isCaravan) {
        await caravanApi.changeCaravanPrincipal(ctx.principalId, {
          caravanId: ctx.principalId,
          name,
          familyName,
          nationalCode: currentProfile.nationalCode || "",
          dateOfBirth: persianDateToIsoDate(currentProfile.birthDate) || undefined,
          gender: genderToApi(currentProfile.gender),
          passportNumber: currentProfile.passportNumber || "",
          gmail: "",
          phoneNumber: values.mobile,
          emergencyPhoneNumber: currentProfile.relativePhone || "",
          bloodType: bloodTypeToApi(currentProfile.bloodType),
        });
      } else {
        await individualApi.changeIndividualProfile(ctx.principalId, {
          individualId: ctx.principalId,
          name,
          familyName,
          nationalCode: currentProfile.nationalCode || "",
          dateOfBirth: persianDateToIsoDate(currentProfile.birthDate) || undefined,
          gender: genderToApi(currentProfile.gender),
          passportNumber: currentProfile.passportNumber || "",
          gmail: "",
          phoneNumber: values.mobile,
          emergencyPhoneNumber: currentProfile.relativePhone || "",
          bloodType: bloodTypeToApi(currentProfile.bloodType),
        });
      }

      useAuthStore.getState().updateProfile({
        name: values.fullName.trim(),
        phone: values.mobile,
      });
    },
    onSuccess: () => {
      if (ctx.principalId) {
        void qc.invalidateQueries({
          queryKey: principalSettingsKeys.profile(
            ctx.principalType ?? "",
            ctx.principalId,
          ),
        });
      }
    },
  });
}

export function useChangePrincipalPassword() {
  const ctx = usePrincipalContext();

  return useMutation({
    mutationFn: async (input: {
      currentPassword: string;
      newPassword: string;
    }) => {
      if (!ctx.principalId) throw new Error("وارد حساب کاربری نشده‌اید.");
      const body = {
        id: ctx.principalId,
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      };
      if (ctx.isCaravan) {
        await caravanApi.changeCaravanPassword(ctx.principalId, body);
      } else {
        await individualApi.changeIndividualPassword(ctx.principalId, body);
      }
    },
  });
}

export function useSaveFullProfile() {
  const ctx = usePrincipalContext();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!ctx.principalId) throw new Error("وارد حساب کاربری نشده‌اید.");
      const { name, familyName } = splitName(values.fullName);
      const payload = {
        name,
        familyName,
        nationalCode: values.nationalCode || "",
        dateOfBirth: persianDateToIsoDate(values.birthDate) || undefined,
        gender: genderToApi(values.gender),
        passportNumber: values.passportNumber || "",
        gmail: "",
        phoneNumber: values.mobile1 || "",
        emergencyPhoneNumber: values.relativePhone || "",
        bloodType: bloodTypeToApi(values.bloodType),
      };

      if (ctx.isCaravan) {
        await caravanApi.changeCaravanPrincipal(ctx.principalId, {
          caravanId: ctx.principalId,
          ...payload,
        });
      } else {
        await individualApi.changeIndividualProfile(ctx.principalId, {
          individualId: ctx.principalId,
          ...payload,
        });
      }

      useAuthStore.getState().updateProfile({
        name: values.fullName.trim(),
        phone: values.mobile1,
      });
    },
    onSuccess: () => {
      if (ctx.principalId) {
        void qc.invalidateQueries({
          queryKey: principalSettingsKeys.profile(
            ctx.principalType ?? "",
            ctx.principalId,
          ),
        });
        void qc.invalidateQueries({
          queryKey: ["boss", "profile", ctx.principalId],
        });
        void qc.invalidateQueries({
          queryKey: ["individual", "profile", ctx.principalId],
        });
      }
    },
  });
}
