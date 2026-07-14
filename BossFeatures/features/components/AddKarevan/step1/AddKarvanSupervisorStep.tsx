"use client";

import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { AddKarvanFormShell } from "@/boss-features/components/AddKarevan/AddKarvanFormShell";
import PilgrimInfoForm from "@/boss-features/components/AddKarevan/registerboxformComponents/addkarvanForminfo";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import {
  emptyPilgrim,
  pilgrimRegistrationSchema,
  type RegistrationFormValues,
} from "@/boss-features/components/AddKarevan/FormSchemas";
import Button from "@/boss-features/UI/button";
import { cn } from "@/boss-features/lib/utils";

type Props = {
  className?: string;
};

export function AddKarvanSupervisorStep({ className }: Props) {
  const { continueReservation, setRegistrationDraft, registrationDraft } =
    useReservationCapacityStore(
      useShallow((s) => ({
        continueReservation: s.continueReservation,
        setRegistrationDraft: s.setRegistrationDraft,
        registrationDraft: s.registrationDraft,
      })),
    );

  const schema = useMemo(() => pilgrimRegistrationSchema(1), []);

  const defaultValues = useMemo(
    () => registrationDraft ?? { pilgrims: [emptyPilgrim()] },
    [registrationDraft],
  );

  const methods = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });
  const { control, handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (registrationDraft) {
      reset(registrationDraft);
    }
  }, [registrationDraft, reset]);

  const onSubmit = (data: RegistrationFormValues) => {
    setRegistrationDraft(data);
    continueReservation();
  };

  return (
    <div
      className={cn("flex w-full flex-col", className)}
      dir="rtl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4 py-4 sm:py-6"
          noValidate
        >
          <AddKarvanFormShell>
            <PilgrimInfoForm
              control={control}
              setValue={setValue}
              fieldPrefix="pilgrims.0"
              title="سرپرست"
            />
          </AddKarvanFormShell>

          <div className="mt-auto flex justify-end pt-4">
            <Button
              type="submit"
              color="darkGreen"
              text="white"
              radius="md"
              border="none"
              size="twoxl"
              width="auto"
              className="min-w-40 w-full max-w-[502px] font-semibold"
            >
              درخواست رزرو
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
