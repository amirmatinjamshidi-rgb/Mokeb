import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PilgrimFormValues } from "../components/registerForm/pilgrimRegistrationSchema";

export type ReservationStep = 0 | 1 | 2;

/** Filled at end of step 2; drives step 3 summary and success UI. */
export type RegistrationConfirmation = {
  maleCount: number;
  femaleCount: number;
  supervisorName: string;
  reserveCode: string;
  /** برای جدول جزئیات رزرو در گام بعد */
  pilgrims: PilgrimFormValues[];
};

export type ReservationCapacityState = {
  activeStep: ReservationStep;
  /** Total guests = maleCount + femaleCount (kept for legacy UI). */
  guests: number;
  maleCount: number;
  femaleCount: number;
  entryDate: string;
  exitDate: string;
  capacityAvailable: boolean | null;
  registrationConfirmation: RegistrationConfirmation | null;
  /** Request id returned by Reserve; used to look up admin approval status after reload. */
  submittedRequestId: string | null;
  setActiveStep: (step: ReservationStep) => void;
  setGuests: (n: number) => void;
  setEntryDate: (isoDate: string) => void;
  setExitDate: (isoDate: string) => void;
  resetCapacityCheck: () => void;
  checkCapacity: (
    maleCount: number,
    femaleCount: number,
    entryDate: string,
    exitDate: string,
  ) => void;
  /** Moves from capacity check to guest registration. */
  continueReservation: () => void;
  /** Persists step-2 form outcome, the created request id, and moves to the confirmation step. */
  completeGuestRegistration: (
    payload: RegistrationConfirmation,
    submittedRequestId?: string | null,
  ) => void;
  /** Clears the wizard back to step 0 (e.g. to start over after a rejection). */
  resetReservation: () => void;
};

const INITIAL_STATE: Pick<
  ReservationCapacityState,
  | "activeStep"
  | "guests"
  | "maleCount"
  | "femaleCount"
  | "entryDate"
  | "exitDate"
  | "capacityAvailable"
  | "registrationConfirmation"
  | "submittedRequestId"
> = {
  activeStep: 0,
  guests: 1,
  maleCount: 1,
  femaleCount: 0,
  entryDate: "",
  exitDate: "",
  capacityAvailable: null,
  registrationConfirmation: null,
  submittedRequestId: null,
};

export const useReservationCapacityStore = create<ReservationCapacityState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setActiveStep: (step) => set({ activeStep: step }),
      setGuests: (guests) =>
        set({ guests: Math.max(1, Math.round(guests)) }),
      setEntryDate: (entryDate) => set({ entryDate }),
      setExitDate: (exitDate) => set({ exitDate }),
      resetCapacityCheck: () => set({ capacityAvailable: null }),
      checkCapacity: (maleCount, femaleCount, entryDate, exitDate) => {
        const male = Math.max(0, Math.round(maleCount));
        const female = Math.max(0, Math.round(femaleCount));
        const total = Math.max(1, male + female);
        set({
          maleCount: male,
          femaleCount: female,
          guests: total,
          entryDate,
          exitDate,
          capacityAvailable: true,
        });
      },
      continueReservation: () =>
        set((s) =>
          s.activeStep === 0 && s.capacityAvailable
            ? { activeStep: 1 as ReservationStep }
            : s,
        ),
      completeGuestRegistration: (payload, submittedRequestId = null) =>
        set({
          registrationConfirmation: payload,
          submittedRequestId,
          activeStep: 2,
        }),
      resetReservation: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "mokeb-general-reservation",
      partialize: (state) => ({
        activeStep: state.activeStep,
        guests: state.guests,
        maleCount: state.maleCount,
        femaleCount: state.femaleCount,
        entryDate: state.entryDate,
        exitDate: state.exitDate,
        capacityAvailable: state.capacityAvailable,
        registrationConfirmation: state.registrationConfirmation,
        submittedRequestId: state.submittedRequestId,
      }),
    },
  ),
);
