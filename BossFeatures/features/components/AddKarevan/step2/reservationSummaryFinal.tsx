"use client";

import Divider from "@mui/material/Divider";

import { cn } from "@/boss-features/lib/utils";
import { toPersianDigits } from "@/boss-features/lib/format";

export type ReservationSummaryFinalProps = {
  checkInDate: string;
  checkOutDate: string;
  checkInTime?: string;
  maleCount?: number;
  femaleCount?: number;
  supervisorName?: string;
  reserveCode?: string;
  reservationType?: string;
  className?: string;
};

const dash = "—";

export default function ReservationSummaryFinal({
  checkInDate,
  checkOutDate,
  checkInTime = dash,
  maleCount = 0,
  femaleCount = 0,
  reserveCode,
  supervisorName = dash,
  reservationType = "کاروانی",
  className,
}: ReservationSummaryFinalProps) {
  const membersLabel = `مرد ${toPersianDigits(maleCount)}    زن ${toPersianDigits(femaleCount)}`;

  return (
    <div
      dir="rtl"
      className={cn(
        "flex w-full flex-col items-stretch justify-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0px_2px_4px_0px_#0000001F] sm:gap-4 sm:px-8 sm:py-4 md:flex-row md:items-center md:gap-6 md:px-10",
        className,
      )}
    >
      <span className="sr-only">
        {`اعضای کاروان: ${membersLabel}، تاریخ ورود: ${checkInDate || dash}`}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
        <InfoRow label="کد درخواست :" value={reserveCode || dash} />
        <InfoRow label="تاریخ ثبت درخواست :" value={checkInTime} />
        <InfoRow label="مدیر کاروان :" value={supervisorName} />
      </div>

      <Divider
        orientation="vertical"
        flexItem
        className="hidden border-[#E5E7EB] md:block"
      />
      <Divider className="border-[#E5E7EB] md:hidden" />

      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
        <InfoRow label="نوع رزرو :" value={reservationType} />
        <InfoRow
          label="تاریخ ورود درخواستی :"
          value={
            checkInDate && checkOutDate
              ? `${checkInDate} — ${checkOutDate}`
              : checkInDate || checkOutDate || dash
          }
        />
        <InfoRow label="اعضای کاروان :" value={membersLabel} />
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
