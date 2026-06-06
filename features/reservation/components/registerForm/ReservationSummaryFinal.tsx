"use client";



import Divider from "@mui/material/Divider";

import { cn } from "@/features/shared/lib/utils";

import type { ReservationSummaryProps as BaseReservationSummaryProps } from "./ReservationSummary";



export type ReservationSummaryFinalProps = BaseReservationSummaryProps & {

  supervisorName?: string;

};



const dash = "—";



export default function ReservationSummaryFinal({

  guestCount,

  checkInDate,

  checkInTime = dash,

  checkOutDate,

  checkOutTime = dash,

  maleCount,

  femaleCount,

  supervisorName = dash,

  className,

}: ReservationSummaryFinalProps) {

  return (

    <div

      dir="rtl"

      className={cn(

        "flex w-full max-w-form-row flex-col items-stretch justify-center gap-6 rounded-3xl bg-white px-4 py-6 shadow-[0px_2px_4px_0px_#0000001F] sm:gap-8 sm:px-8 sm:py-8 md:flex-row md:items-center md:gap-12 md:px-10",

        className,

      )}

    >

      <span className="sr-only">{`تعداد نفرات رزرو: ${guestCount} نفر`}</span>



      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">

        <InfoRow label="تاریخ ورود" value={checkInDate || dash} />

        <InfoRow label="ساعت تقریبی" value={checkInTime} />

        <InfoRow

          label="زائران"

          value={

            maleCount || femaleCount

              ? `${maleCount} آقا، ${femaleCount} خانم`

              : dash

          }

        />

      </div>



      <Divider

        orientation="vertical"

        flexItem

        className="hidden border-[#E5E7EB] md:block"

      />

      <Divider className="border-[#E5E7EB] md:hidden" />



      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">

        <InfoRow label="تاریخ خروج" value={checkOutDate || dash} />

        <InfoRow label="ساعت تقریبی" value={checkOutTime} />

        <InfoRow label="سرپرست" value={supervisorName} />

      </div>

    </div>

  );

}



function InfoRow({ label, value }: { label: string; value: string }) {

  return (

    <div className="flex min-h-12 w-full items-center justify-between gap-3">

      <span className="shrink-0 text-sm text-[#61756F]">{label}</span>

      <span className="min-w-0 text-end text-sm font-medium text-[#1F2937]">

        {value}

      </span>

    </div>

  );

}

