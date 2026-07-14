"use client";

import { DownloadObserverActions } from "@/boss-features/components/AddKarevan/step4/downloadObserver";
import { PilgrimsTable } from "@/features/shared/components/PilgrimsTable";
import { ReserveSuccessMessage } from "@/boss-features/components/AddKarevan/step4/succesMessage";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import { cn } from "@/boss-features/lib/utils";

type Props = {
  className?: string;
};

export function AddKarvanConfirmationStep({ className }: Props) {
  const confirmation = useReservationCapacityStore(
    (s) => s.registrationConfirmation,
  );
  const reserveCode = confirmation?.reserveCode ?? "—";

  const pilgrimRows =
    confirmation?.pilgrims.map((p) => ({
      firstName: p.firstName,
      lastName: p.lastName,
      gender: p.gender,
      nationalCode: p.nationality === "iranian" ? p.nationalCode : "",
      passportNumber: p.nationality === "foreign" ? p.nationalCode : "",
    })) ?? [];

  return (
    <div
      className={cn("flex w-full flex-col gap-3", className)}
      dir="rtl"
    >
      <ReserveSuccessMessage reserveCode={reserveCode} />
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-[#175E47]">لیست زائران</h3>
        <PilgrimsTable pilgrims={pilgrimRows} />
      </div>
      <DownloadObserverActions />
    </div>
  );
}
