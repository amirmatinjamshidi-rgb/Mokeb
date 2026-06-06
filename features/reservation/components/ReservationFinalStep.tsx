"use client";



import { useRouter } from "next/navigation";

import Button from "@/features/shared/ui/button";

import { ROUTES } from "@/features/shared/config/navigation";

import { cn } from "@/features/shared/lib/utils";

import { SiteReservationContentRow } from "../layouts/SiteReservationLayout";

import { useReservationCapacityStore } from "../store/useReservationCapacityStore";

import ReservationSummaryFinal from "./registerForm/ReservationSummaryFinal";

import { ReserveSuccessMessage } from "./registerForm/ReserveSuccesMessage";

import { Download } from "lucide-react";



type Props = {

  className?: string;

};



export function ReservationFinalStep({ className }: Props) {

  const router = useRouter();

  const guests = useReservationCapacityStore((s) => s.guests);

  const entryDate = useReservationCapacityStore((s) => s.entryDate);

  const exitDate = useReservationCapacityStore((s) => s.exitDate);

  const confirmation = useReservationCapacityStore(

    (s) => s.registrationConfirmation,

  );



  if (!confirmation) {

    return null;

  }



  return (

    <div className={cn("mx-auto mt-6 w-full sm:mt-8", className)}>

      <SiteReservationContentRow>

        <div className="flex flex-col items-stretch gap-6 sm:gap-8">

          <ReserveSuccessMessage reserveCode={confirmation.reserveCode} />



          <ReservationSummaryFinal

            guestCount={guests}

            checkInDate={entryDate}

            checkOutDate={exitDate}

            maleCount={confirmation.maleCount}

            femaleCount={confirmation.femaleCount}

            supervisorName={confirmation.supervisorName}

          />



          <div

            className="w-full rounded-2xl border border-dashed border-[#175E47]/30 bg-[#FAFAFA]/80 px-4 py-12 text-center text-sm text-[#61756F] sm:py-16"

            role="status"

          >

            جدول جزئیات رزرو به‌زودی اضافه می‌شود

          </div>



          <div

            dir="rtl"

            className="mx-auto flex w-full max-w-site flex-col-reverse gap-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4"

          >

            <Button

              type="button"

              color="white"

              border="green"

              text="none"

              radius="md"

              size="twoxl"

              width="auto"

              className="flex w-full min-w-0 items-center justify-center gap-2 border-[#175E47] px-4 !text-[#175E47] sm:w-auto sm:min-w-[148px]"

              onClick={() => {

                /* اتصال دانلود PDF پس از API */

              }}

            >

              <Download className="size-5 shrink-0" aria-hidden />

              دانلود pdf

            </Button>



            <Button

              type="button"

              color="darkGreen"

              text="white"

              radius="md"

              border="none"

              size="twoxl"

              width="auto"

              className="w-full min-w-0 px-4 font-semibold sm:w-auto sm:min-w-[172px]"

              onClick={() => router.push(ROUTES.userPanel)}

            >

              رفتن به پنل کاربری

            </Button>

          </div>

        </div>

      </SiteReservationContentRow>

    </div>

  );

}

