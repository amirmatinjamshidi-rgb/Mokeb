import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PilgrimFormValues, RegistrationFormValues } from "./FormSchemas";

export type ReservationStep = 0 | 1 | 2 | 3 | 4;

export type RegistrationConfirmation = {
  maleCount: number;
  femaleCount: number;
  supervisorName: string;
  reserveCode: string;
  pilgrims: PilgrimFormValues[];
};

export type ReservationCapacityState = {
  activeStep: ReservationStep;
  /** Total guests expected after accept (= male + female). */
  guests: number;
  maleAmount: number;
  femaleAmount: number;
  entryDate: string;
  exitDate: string;
  capacityAvailable: boolean | null;
  registrationConfirmation: RegistrationConfirmation | null;
  /** Short display code (first 8 of request UUID). */
  submittedRequestCode: string | null;
  /** Full request UUID from SendRequest — used to match admin approval. */
  submittedRequestId: string | null;
  /** Last submitted step‑0 form (سرپرست) for مرحلهٔ بررسی */
  registrationDraft: RegistrationFormValues | null;
  /** Pilgrims collected in step 2 (sequential ثبت) before review step */
  draftPilgrims: PilgrimFormValues[];
  setActiveStep: (step: ReservationStep) => void;
  setGuests: (n: number) => void;
  setMaleAmount: (n: number) => void;
  setFemaleAmount: (n: number) => void;
  setEntryDate: (isoDate: string) => void;
  setExitDate: (isoDate: string) => void;
  setRequestMeta: (meta: {
    entryDate: string;
    exitDate: string;
    maleAmount: number;
    femaleAmount: number;
  }) => void;
  resetCapacityCheck: () => void;
  checkCapacity: (guests: number, entryDate: string, exitDate: string) => void;
  setRegistrationDraft: (draft: RegistrationFormValues | null) => void;
  continueReservation: () => void;
  /** Clear list and open guest registration (step 2). */
  goToGuestRegistration: () => void;
  setDraftPilgrims: (list: PilgrimFormValues[]) => void;
  appendDraftPilgrim: (p: PilgrimFormValues) => void;
  updateDraftPilgrim: (index: number, p: PilgrimFormValues) => void;
  removeDraftPilgrim: (index: number) => void;
  completeGuestRegistration: (payload: RegistrationConfirmation) => void;
  setSubmittedRequest: (payload: {
    requestId: string;
    requestCode: string;
  } | null) => void;
};

function totalGuests(male: number, female: number) {
  return Math.max(1, Math.round(male) + Math.round(female));
}

const INITIAL_STATE: Pick<
  ReservationCapacityState,
  | "activeStep"
  | "guests"
  | "maleAmount"
  | "femaleAmount"
  | "entryDate"
  | "exitDate"
  | "capacityAvailable"
  | "registrationConfirmation"
  | "submittedRequestCode"
  | "submittedRequestId"
  | "registrationDraft"
  | "draftPilgrims"
> = {
  activeStep: 0,
  guests: 1,
  maleAmount: 0,
  femaleAmount: 0,
  entryDate: "",
  exitDate: "",
  capacityAvailable: null,
  registrationConfirmation: null,
  submittedRequestCode: null,
  submittedRequestId: null,
  registrationDraft: null,
  draftPilgrims: [],
};

export const useReservationCapacityStore = create<ReservationCapacityState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setActiveStep: (step) => set({ activeStep: step }),
      setGuests: (guests) =>
        set({ guests: Math.min(500, Math.max(1, Math.round(guests))) }),
      setMaleAmount: (maleAmount) =>
        set((s) => {
          const male = Math.max(0, Math.round(maleAmount));
          return {
            maleAmount: male,
            guests: totalGuests(male, s.femaleAmount),
          };
        }),
      setFemaleAmount: (femaleAmount) =>
        set((s) => {
          const female = Math.max(0, Math.round(femaleAmount));
          return {
            femaleAmount: female,
            guests: totalGuests(s.maleAmount, female),
          };
        }),
      setEntryDate: (entryDate) => set({ entryDate }),
      setExitDate: (exitDate) => set({ exitDate }),
      setRequestMeta: ({ entryDate, exitDate, maleAmount, femaleAmount }) => {
        const male = Math.max(0, Math.round(maleAmount));
        const female = Math.max(0, Math.round(femaleAmount));
        set({
          entryDate,
          exitDate,
          maleAmount: male,
          femaleAmount: female,
          guests: totalGuests(male, female),
          capacityAvailable: true,
        });
      },
      resetCapacityCheck: () => set({ capacityAvailable: null }),
      checkCapacity: (guests, entryDate, exitDate) =>
        set({
          guests: Math.min(500, Math.max(1, Math.round(guests))),
          entryDate,
          exitDate,
          capacityAvailable: true,
        }),
      setRegistrationDraft: (draft) => set({ registrationDraft: draft }),
      continueReservation: () =>
        set((s) =>
          s.activeStep === 0
            ? {
                activeStep: 1 as ReservationStep,
                capacityAvailable: true,
              }
            : s,
        ),
      goToGuestRegistration: () =>
        set({
          activeStep: 2,
          draftPilgrims: [],
        }),
      setDraftPilgrims: (list) => set({ draftPilgrims: list }),
      appendDraftPilgrim: (p) =>
        set((s) => ({ draftPilgrims: [...s.draftPilgrims, p] })),
      updateDraftPilgrim: (index, p) =>
        set((s) => ({
          draftPilgrims: s.draftPilgrims.map((row, i) =>
            i === index ? p : row,
          ),
        })),
      removeDraftPilgrim: (index) =>
        set((s) => ({
          draftPilgrims: s.draftPilgrims.filter((_, i) => i !== index),
        })),
      setSubmittedRequest: (payload) =>
        set(
          payload
            ? {
                submittedRequestId: payload.requestId,
                submittedRequestCode: payload.requestCode,
              }
            : {
                submittedRequestId: null,
                submittedRequestCode: null,
              },
        ),
      completeGuestRegistration: (payload) =>
        set({
          registrationConfirmation: payload,
          activeStep: 4,
        }),
    }),
    {
      name: "mokeb-boss-reservation",
      partialize: (state) => ({
        activeStep: state.activeStep,
        guests: state.guests,
        maleAmount: state.maleAmount,
        femaleAmount: state.femaleAmount,
        entryDate: state.entryDate,
        exitDate: state.exitDate,
        capacityAvailable: state.capacityAvailable,
        registrationConfirmation: state.registrationConfirmation,
        submittedRequestCode: state.submittedRequestCode,
        submittedRequestId: state.submittedRequestId,
        registrationDraft: state.registrationDraft,
        draftPilgrims: state.draftPilgrims,
      }),
    },
  ),
);
