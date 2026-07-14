"use client";

import { AddKarvanConfirmationStep } from "@/boss-features/components/AddKarevan/step4/AddKarvanConfirmationStep";
import { AddKarvanGuestReviewStep } from "@/boss-features/components/AddKarevan/step4/AddKarvanGuestReviewStep";
import { AddKarvanGuestsStep } from "@/boss-features/components/AddKarevan/step3/AddKarvanGuestsStep";
import { AddKarvanReviewStep } from "@/boss-features/components/AddKarevan/step2/AddKarvanReviewStep";
import { AddKarvanSupervisorStep } from "@/boss-features/components/AddKarevan/step1/AddKarvanSupervisorStep";
import { ReservationStepper } from "@/boss-features/components/AddKarevan/ReservationStepper";
import type { ReservationStep } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import { useReservationCapacityStore } from "@/boss-features/components/AddKarevan/useReservationCapacityStore";
import { useIsClient } from "@/boss-features/hooks/useIsClient";

function AddKarvanStepContent({ activeStep }: { activeStep: ReservationStep }) {
  switch (activeStep) {
    case 0:
      return <AddKarvanSupervisorStep />;
    case 1:
      return <AddKarvanReviewStep />;
    case 2:
      return <AddKarvanGuestsStep />;
    case 3:
      return <AddKarvanGuestReviewStep />;
    case 4:
      return <AddKarvanConfirmationStep />;
    default:
      return null;
  }
}

export default function AddKarvanPage() {
  const activeStep = useReservationCapacityStore((s) => s.activeStep);
  const isClient = useIsClient();

  return (
    <div className="w-full bg-[#F5F9F6] px-4 py-5 sm:px-6" dir="rtl">
      <div className="mx-auto flex w-full max-w-none flex-col gap-4">
        <ReservationStepper activeStep={activeStep} />

        <div className="w-full min-w-0">
          {isClient ? (
            <AddKarvanStepContent activeStep={activeStep} />
          ) : (
            <div
              className="flex min-h-[200px] w-full items-center justify-center rounded-2xl bg-white shadow-md"
              aria-hidden
            >
              <p className="text-sm text-[#61756F]">در حال بارگذاری...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
