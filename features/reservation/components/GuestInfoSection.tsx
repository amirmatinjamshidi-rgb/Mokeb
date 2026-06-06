"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/features/shared/ui/button";
import { cn } from "@/features/shared/lib/utils";
import { useReservationCapacityStore } from "../store/useReservationCapacityStore";
import { SiteReservationContentRow } from "../layouts/SiteReservationLayout";
import PilgrimInfoForm from "./registerForm/PilgrimInfoForm";
import ReservationSummary from "./registerForm/ReservationSummary";
import {
  emptyPilgrim,
  pilgrimRegistrationSchema,
  type PilgrimFormValues,
  type RegistrationFormValues,
} from "./registerForm/pilgrimRegistrationSchema";

type Props = {
  className?: string;
};

function countGender(
  pilgrims: PilgrimFormValues[] | undefined,
  g: "male" | "female",
) {
  if (!pilgrims?.length) return 0;
  return pilgrims.filter((p) => p?.gender === g).length;
}

export function GuestInfoSection({ className }: Props) {
  const guests = useReservationCapacityStore((s) => s.guests);
  const entryDate = useReservationCapacityStore((s) => s.entryDate);
  const exitDate = useReservationCapacityStore((s) => s.exitDate);
  const completeGuestRegistration = useReservationCapacityStore(
    (s) => s.completeGuestRegistration,
  );

  const schema = useMemo(() => pilgrimRegistrationSchema(guests), [guests]);

  const defaultValues = useMemo<RegistrationFormValues>(
    () => ({
      pilgrims: Array.from({ length: guests }, () => emptyPilgrim()),
    }),
    [guests],
  );

  const { control, handleSubmit } = useForm<RegistrationFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watchedPilgrims = useWatch({ control, name: "pilgrims" });
  const maleCount = countGender(watchedPilgrims, "male");
  const femaleCount = countGender(watchedPilgrims, "female");

  const onSubmit = (data: RegistrationFormValues) => {
    const p0 = data.pilgrims[0];
    const supervisorName =
      [p0?.firstName, p0?.lastName].filter(Boolean).join(" ").trim() || "—";
    completeGuestRegistration({
      maleCount,
      femaleCount,
      supervisorName,
      reserveCode: "TRK-9876",
      pilgrims: data.pilgrims,
    });
  };

  return (
    <div className={cn("mx-auto mt-6 w-full sm:mt-8", className)}>
      <SiteReservationContentRow>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-black/6 bg-[#FAFAFA] px-3 py-8 sm:px-6 md:px-8 md:py-10"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
            <div className="min-w-0 flex-1 space-y-8">
              {Array.from({ length: guests }).map((_, index) => (
                <PilgrimInfoForm
                  key={index}
                  control={control}
                  fieldPrefix={`pilgrims.${index}` as `pilgrims.${number}`}
                  title={index === 0 ? "سرپرست" : `زائر شماره ${index}`}
                />
              ))}
            </div>

            <ReservationSummary
              className="w-full shrink-0 lg:max-w-75 lg:self-start"
              guestCount={guests}
              checkInDate={entryDate}
              checkOutDate={exitDate}
              maleCount={maleCount}
              femaleCount={femaleCount}
            />
          </div>

          <div className="mt-8 flex justify-stretch pt-2 sm:justify-end">
            <Button
              type="submit"
              color="darkGreen"
              text="white"
              radius="md"
              border="none"
              size="twoxl"
              width="xl"
              className="w-full min-w-0 font-semibold sm:w-auto sm:min-w-43"
            >
              تایید و ادامه
            </Button>
          </div>
        </form>
      </SiteReservationContentRow>
    </div>
  );
}
