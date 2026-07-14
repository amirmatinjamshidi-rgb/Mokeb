"use client";

import { Fragment, memo } from "react";
import { cn } from "@/boss-features/lib/utils";
import type { ReservationStep } from "./useReservationCapacityStore";
import { colors } from "@/boss-features/tokens";

const STEPS: { id: ReservationStep; label: string }[] = [
  { id: 0, label: "درخواست رزرو" },
  { id: 1, label: "بررسی درخواست" },
  { id: 2, label: "اطلاعات زائران" },
  { id: 3, label: "مرور اطلاعات" },
  { id: 4, label: "تایید نهایی" },
];

type Props = {
  activeStep: ReservationStep;
  className?: string;
};

function ReservationStepperInner({ activeStep, className }: Props) {
  return (
    <div
      dir="rtl"
      className={cn(
        "flex min-h-16 w-full items-center justify-center px-1 sm:px-2 md:min-h-19",
        className,
      )}
    >
      <div className="flex w-full flex-row items-center justify-center px-2">
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
              <div className="flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-22 md:w-28">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-xs font-semibold sm:text-sm",
                    done || current
                      ? "border-[#279F78] bg-[#279F78] text-white"
                      : "border-[#ACB9B5] bg-transparent text-[#61756F]",
                  )}
                >
                  {done ? "✓" : index + 1}
                </div>
                <span
                  className={cn(
                    "text-center text-[9px] font-medium leading-tight sm:text-xs md:text-sm",
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

export const ReservationStepper = memo(ReservationStepperInner);
