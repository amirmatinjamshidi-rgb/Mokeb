"use client";

import { Fragment } from "react";
import { cn } from "@/features/shared/lib/utils";
import type { ReservationStep } from "../store/useReservationCapacityStore";
import { colors } from "../tokens";

const STEPS: { id: ReservationStep; label: string }[] = [
  { id: 0, label: "استعلام ظرفیت" },
  { id: 1, label: "ثبت اطلاعات زائران" },
  { id: 2, label: "تایید رزرو" },
];

type Props = {
  activeStep: ReservationStep;
  className?: string;
};

export function ReservationStepper({ activeStep, className }: Props) {
  return (
    <div
      className={cn(
        "flex min-h-16 w-full items-center justify-center border-b pt-20 border-black/5 bg-white px-1 sm:px-2 md:min-h-19",
        className,
      )}
    >
      <div className="flex w-full max-w-3xl flex-row items-center justify-center px-2 sm:max-w-4xl">
        {STEPS.map((step, index) => {
          const done = activeStep > step.id;
          const current = activeStep === step.id;
          const prevDone = index > 0 && activeStep > STEPS[index - 1]!.id;

          return (
            <Fragment key={step.id}>
              {index > 0 ? (
                <div
                  className="mx-1 h-0.5 min-w-4 flex-1 max-md:mx-0.5 sm:min-w-8"
                  style={{
                    backgroundColor: prevDone ? colors.primary06 : "#E5E7EB",
                  }}
                  aria-hidden
                />
              ) : null}
              <div className="flex w-[5.5rem] shrink-0 flex-col items-center gap-2 sm:w-28 md:w-32">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold sm:text-sm",
                    done || current
                      ? "border-[#279F78] bg-[#279F78] text-white"
                      : "border-[#ACB9B5] bg-white text-[#61756F]",
                  )}
                >
                  {done ? "✓" : index + 1}
                </div>
                <span
                  className={cn(
                    "text-center text-[10px] font-medium leading-tight sm:text-xs md:text-sm",
                    current ? "text-[#175E47]" : "text-[#61756F]",
                  )}
                >
                  {step.label}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
