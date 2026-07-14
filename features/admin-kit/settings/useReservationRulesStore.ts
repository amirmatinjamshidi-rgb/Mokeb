"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PublicReservationRules = {
  pilgrimDeadlineMinutes: number;
  maxPersonsPerReservation: number;
  maxStayDays: number;
};

export type CaravanReservationRules = {
  pilgrimDeadlineDays: number;
  maxStayDays: number;
};

type ReservationRulesState = {
  publicRules: PublicReservationRules;
  caravanRules: CaravanReservationRules;
  setPublicRules: (rules: Partial<PublicReservationRules>) => void;
  setCaravanRules: (rules: Partial<CaravanReservationRules>) => void;
};

const DEFAULT_PUBLIC: PublicReservationRules = {
  pilgrimDeadlineMinutes: 30,
  maxPersonsPerReservation: 10,
  maxStayDays: 7,
};

const DEFAULT_CARAVAN: CaravanReservationRules = {
  pilgrimDeadlineDays: 3,
  maxStayDays: 14,
};

function clampPositive(value: number, fallback: number, max = 500) {
  if (!Number.isFinite(value) || value < 1) return fallback;
  return Math.min(max, Math.round(value));
}

export const useReservationRulesStore = create<ReservationRulesState>()(
  persist(
    (set) => ({
      publicRules: DEFAULT_PUBLIC,
      caravanRules: DEFAULT_CARAVAN,
      setPublicRules: (rules) =>
        set((state) => ({
          publicRules: {
            pilgrimDeadlineMinutes: clampPositive(
              rules.pilgrimDeadlineMinutes ??
                state.publicRules.pilgrimDeadlineMinutes,
              DEFAULT_PUBLIC.pilgrimDeadlineMinutes,
              24 * 60,
            ),
            maxPersonsPerReservation: clampPositive(
              rules.maxPersonsPerReservation ??
                state.publicRules.maxPersonsPerReservation,
              DEFAULT_PUBLIC.maxPersonsPerReservation,
              100,
            ),
            maxStayDays: clampPositive(
              rules.maxStayDays ?? state.publicRules.maxStayDays,
              DEFAULT_PUBLIC.maxStayDays,
              90,
            ),
          },
        })),
      setCaravanRules: (rules) =>
        set((state) => ({
          caravanRules: {
            pilgrimDeadlineDays: clampPositive(
              rules.pilgrimDeadlineDays ??
                state.caravanRules.pilgrimDeadlineDays,
              DEFAULT_CARAVAN.pilgrimDeadlineDays,
              60,
            ),
            maxStayDays: clampPositive(
              rules.maxStayDays ?? state.caravanRules.maxStayDays,
              DEFAULT_CARAVAN.maxStayDays,
              90,
            ),
          },
        })),
    }),
    { name: "mokeb-reservation-rules" },
  ),
);
