import { create } from "zustand";
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
  guests: number;
  entryDate: string;
  exitDate: string;
  capacityAvailable: boolean | null;
  registrationConfirmation: RegistrationConfirmation | null;
  setActiveStep: (step: ReservationStep) => void;
  setGuests: (n: number) => void;
  setEntryDate: (isoDate: string) => void;
  setExitDate: (isoDate: string) => void;
  resetCapacityCheck: () => void;
  checkCapacity: (guests: number, entryDate: string, exitDate: string) => void;
  /** Moves from capacity check to guest registration. */
  continueReservation: () => void;
  /** Persists step-2 form outcome and moves to the confirmation step. */
  completeGuestRegistration: (payload: RegistrationConfirmation) => void;
};

export const useReservationCapacityStore = create<ReservationCapacityState>(
  (set) => ({
    activeStep: 0,
    guests: 1,
    entryDate: "",
    exitDate: "",
    capacityAvailable: null,
    registrationConfirmation: null,
    setActiveStep: (step) => set({ activeStep: step }),
    setGuests: (guests) =>
      set({ guests: Math.min(5, Math.max(1, Math.round(guests))) }),
    setEntryDate: (entryDate) => set({ entryDate }),
    setExitDate: (exitDate) => set({ exitDate }),
    resetCapacityCheck: () => set({ capacityAvailable: null }),
    checkCapacity: (guests, entryDate, exitDate) =>
      set({
        guests: Math.min(5, Math.max(1, Math.round(guests))),
        entryDate,
        exitDate,
        capacityAvailable: true,
      }),
    continueReservation: () =>
      set((s) =>
        s.activeStep === 0 && s.capacityAvailable
          ? { activeStep: 1 as ReservationStep }
          : s,
      ),
    completeGuestRegistration: (payload) =>
      set({
        registrationConfirmation: payload,
        activeStep: 2,
      }),
  }),
);
