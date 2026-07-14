import { create } from "zustand";

import type {
  PilgrimFormValues,
  RegistrationFormValues,
} from "@admin-kit/schemas/supervisorFormSchemas";

export type SupervisorFormState = {
  registrationDraft: RegistrationFormValues | null;
  setRegistrationDraft: (draft: RegistrationFormValues | null) => void;
  onSupervisorSubmit?: (draft: RegistrationFormValues) => void;
  setOnSupervisorSubmit: (
    handler: ((draft: RegistrationFormValues) => void) | undefined,
  ) => void;
};

export const useSupervisorFormStore = create<SupervisorFormState>((set) => ({
  registrationDraft: null,
  setRegistrationDraft: (draft) => set({ registrationDraft: draft }),
  onSupervisorSubmit: undefined,
  setOnSupervisorSubmit: (handler) => set({ onSupervisorSubmit: handler }),
}));

export type { PilgrimFormValues, RegistrationFormValues };
