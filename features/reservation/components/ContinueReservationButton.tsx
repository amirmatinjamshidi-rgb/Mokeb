"use client";

import Button from "@/features/shared/ui/button";
import { useReservationCapacityStore } from "../store/useReservationCapacityStore";

export function ContinueReservationButton() {
  const activeStep = useReservationCapacityStore((s) => s.activeStep);
  const capacityAvailable = useReservationCapacityStore(
    (s) => s.capacityAvailable,
  );
  const continueReservation = useReservationCapacityStore(
    (s) => s.continueReservation,
  );

  if (activeStep !== 0 || !capacityAvailable) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-stretch sm:justify-end">
      <Button
        type="button"
        color="darkGreen"
        text="white"
        radius="md"
        border="none"
        size="lg"
        width="xl"
        className="w-full min-w-0 font-semibold sm:w-auto sm:min-w-43"
        onClick={continueReservation}
      >
        ادامه رزرو
      </Button>
    </div>
  );
}
