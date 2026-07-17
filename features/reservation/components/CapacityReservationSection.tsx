"use client";

import { cn } from "@/features/shared/lib/utils";

import {
  sectionHeading,
  sectionSubtitle,
  sectionTitle,
} from "@/features/shared/lib/layout";

import { useReservationCapacityStore } from "../store/useReservationCapacityStore";

import { ReservationStepper } from "./ReservationStepper";

import { CapacityCheckForm } from "./CapacityCheckForm";

import { GuestInfoSection } from "./GuestInfoSection";

import { ReservationFinalStep } from "./ReservationFinalStep";

import {
  ReservationSectionPad,
  SiteReservationContentRow,
} from "../layouts/SiteReservationLayout";

type Props = {
  className?: string;
};

export function CapacityReservationSection({ className }: Props) {
  const activeStep = useReservationCapacityStore((s) => s.activeStep);

  const capacityAvailable = useReservationCapacityStore(
    (s) => s.capacityAvailable,
  );

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-10 bg-white pb-10 pt-0",

        className,
      )}
    >
      <ReservationStepper activeStep={activeStep} />

      <ReservationSectionPad>
        {activeStep === 0 ? (
          <>
            <div className={cn(sectionHeading, "mt-6 sm:mt-8")}>
              <h2 className={cn(sectionTitle, "w-full")}>
                بررسی ظرفیت رزرو عمومی
              </h2>

              <p className={cn(sectionSubtitle, "w-full")}>
                بازهٔ ورود و خروج و تعداد نفرات  را انتخاب
                کنید.
              </p>
            </div>

            <div className="mx-auto mt-6 w-full sm:mt-8">
              <SiteReservationContentRow>
                <div
                  className={cn(
                    "rounded-xl border bg-[#FAFAFA] px-3 py-5 transition-colors sm:px-6 md:px-8 md:py-6",

                    capacityAvailable ? "border-[#175E47]" : "border-black/6",
                  )}
                >
                  <CapacityCheckForm />
                </div>
              </SiteReservationContentRow>
            </div>
          </>
        ) : null}

        {activeStep === 1 ? (
          <>
            <div className="mx-auto mt-6 flex w-full max-w-265  flex-col items-stretch gap-2 px-0 text-right sm:mt-8 md:items-end">
              <h2 className="w-full text-xl font-medium text-[#175E47] sm:text-2xl md:text-[24px] md:leading-9">
                ثبت اطلاعات زائران
              </h2>

              <p className={cn(sectionSubtitle, "w-full")}>
                ثبت اطلاعات تکراری فقط یک بار محاسبه میشود. (حداکثر 5 نفر)
              </p>
            </div>

            <GuestInfoSection className="px-0" />
          </>
        ) : null}

        {activeStep === 2 ? <ReservationFinalStep className="px-0" /> : null}
      </ReservationSectionPad>
    </section>
  );
}
