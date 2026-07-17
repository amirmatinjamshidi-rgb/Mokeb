"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { individualApi, requestApi } from "@/lib/api";
import {
  accompanyToAddCommand,
  companionToAccompany,
  individualToProfileForm,
  profileFormToChangeCommand,
  requestToReservation,
} from "@/lib/api/mappers";
import { persianDateToIsoDate, persianDateToIsoDateTime } from "@/lib/api/dateFormat";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { ProfileFormValues } from "@/features/user-panel/lib/profileSchema";
import { useReservationCapacityStore } from "@/features/reservation/store/useReservationCapacityStore";

export const queryKeys = {
  profile: (id: string) => ["individual", "profile", id] as const,
  companions: (id: string, search?: string) =>
    ["individual", "companions", id, search ?? ""] as const,
  requests: (id: string) => ["individual", "requests", id] as const,
};

const DEV_INDIVIDUAL_ID =
  process.env.NEXT_PUBLIC_DEV_INDIVIDUAL_ID?.trim() || null;

function useIndividualId() {
  const authId = useAuthStore((s) =>
    s.principalType === "individual" ? s.principalId : null,
  );
  return authId ?? DEV_INDIVIDUAL_ID;
}

const MISSING_INDIVIDUAL_ID_MESSAGE =
  "شناسه کاربر یافت نشد. وارد شوید یا ";

export function useIndividualProfile() {
  const individualId = useIndividualId();

  return useQuery({
    queryKey: queryKeys.profile(individualId ?? ""),
    enabled: Boolean(individualId),
    queryFn: async () => {
      const dto = await individualApi.getIndividual(individualId!);
      return individualToProfileForm(dto);
    },
  });
}

export function useUpdateProfile() {
  const individualId = useIndividualId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!individualId) throw new Error("وارد حساب کاربری نشده‌اید.");
      await individualApi.changeIndividualProfile(
        individualId,
        profileFormToChangeCommand(individualId, values),
      );
      useAuthStore.getState().updateProfile({
        name: values.fullName.trim(),
        phone: values.mobile1,
        email: values.gmail.trim(),
      });
    },
    onSuccess: () => {
      if (individualId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.profile(individualId),
        });
        void queryClient.invalidateQueries({
          queryKey: ["principal-settings"],
        });
      }
    },
  });
}

export function useCompanions(search = "") {
  const individualId = useIndividualId();

  return useQuery({
    queryKey: queryKeys.companions(individualId ?? "", search),
    enabled: Boolean(individualId),
    queryFn: async () => {
      const list = await individualApi.searchCompanions(individualId!, search);
      const rows = Array.isArray(list) ? list : [];
      return rows.map((dto, index) => companionToAccompany(dto, index));
    },
  });
}

export function useAddCompanion() {
  const individualId = useIndividualId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!individualId) throw new Error("وارد حساب کاربری نشده‌اید.");
      return individualApi.addCompanion(
        individualId,
        accompanyToAddCommand(individualId, values),
      );
    },
    onSuccess: () => {
      if (individualId) {
        void queryClient.invalidateQueries({
          queryKey: ["individual", "companions", individualId],
        });
      }
    },
  });
}

export function useRemoveCompanion() {
  const individualId = useIndividualId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companionId: string) => {
      if (!individualId) throw new Error("وارد حساب کاربری نشده‌اید.");
      await individualApi.removeCompanion(individualId, {
        companionId,
      });
    },
    onSuccess: () => {
      if (individualId) {
        void queryClient.invalidateQueries({
          queryKey: ["individual", "companions", individualId],
        });
      }
    },
  });
}

export function useIndividualRequests() {
  const individualId = useIndividualId();

  return useQuery({
    queryKey: queryKeys.requests(individualId ?? ""),
    enabled: Boolean(individualId),
    queryFn: async () => {
      const list = await individualApi.getIndividualRequests(individualId!);
      const rows = Array.isArray(list) ? list : [];
      return rows.map((dto, index) => requestToReservation(dto, index));
    },
  });
}

/** Cancel / reject request — removes it from active lists for user (and admin). */
export function useCancelIndividualRequest() {
  const individualId = useIndividualId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      if (!requestId) throw new Error("شناسه رزرو نامعتبر است.");
      await requestApi.rejectRequest(requestId);
      return requestId;
    },
    onSuccess: (requestId) => {
      if (individualId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.requests(individualId),
        });
      }
      const state = useReservationCapacityStore.getState();
      if (
        state.submittedRequestId &&
        (state.submittedRequestId === requestId ||
          state.submittedRequestId
            .toLowerCase()
            .startsWith(requestId.slice(0, 8).toLowerCase()) ||
          requestId
            .toLowerCase()
            .startsWith(state.submittedRequestId.slice(0, 8).toLowerCase()))
      ) {
        state.resetReservation();
      }
    },
  });
}

export function useCheckCapacity() {
  const individualId = useIndividualId();

  return useMutation({
    mutationFn: async (input: {
      enterTime: string;
      exitTime: string;
      maleAmount: number;
      femaleAmount: number;
    }) => {
      if (!individualId) {
        throw new Error(MISSING_INDIVIDUAL_ID_MESSAGE);
      }
      return individualApi.checkCapacity(individualId, {
        enterTime: persianDateToIsoDate(input.enterTime),
        exitTime: persianDateToIsoDate(input.exitTime),
        maleAmount: input.maleAmount,
        femaleAmount: input.femaleAmount,
      });
    },
  });
}

export function useReserveRoom() {
  const individualId = useIndividualId();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      body: Omit<
        import("@/lib/api/types").ReserveRoomCommand,
        "individualId"
      >,
    ) => {
      if (!individualId) throw new Error(MISSING_INDIVIDUAL_ID_MESSAGE);
      return individualApi.reserveRoom(individualId, {
        ...body,
        dateOfEntrance: persianDateToIsoDateTime(body.dateOfEntrance),
        dateOfExit: persianDateToIsoDateTime(body.dateOfExit),
      });
    },
    onSuccess: () => {
      if (individualId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.requests(individualId),
        });
      }
    },
  });
}
