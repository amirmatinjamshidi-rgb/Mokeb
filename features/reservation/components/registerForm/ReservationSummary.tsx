"use client";

import Divider from "@mui/material/Divider";
import { cn } from "@/features/shared/lib/utils";

export type ReservationSummaryProps = {
  guestCount: number;
  checkInDate: string;
  checkInTime?: string;
  checkOutDate: string;
  checkOutTime?: string;
  maleCount: number;
  femaleCount: number;
  className?: string;
};

const dash = "—";

export default function ReservationSummary({
  guestCount,
  checkInDate,
  checkInTime = dash,
  checkOutDate,
  checkOutTime = dash,
  maleCount,
  femaleCount,
  className,
}: ReservationSummaryProps) {
  return (
    <aside
      className={cn(
        "h-fit w-full rounded-2xl bg-white shadow-[0px_4px_12px_0px_#00000024] lg:sticky lg:top-6",
        className,
      )}
    >
      <div className="flex flex-col gap-6 p-6">
        <div className="py-2">
          <h2 className="text-lg font-bold text-[#175E47]">رزرو اسکان عمومی</h2>
        </div>

        <Divider />

        <SectionTitle title="ظرفیت و نفرات" />
        <div className="flex flex-col gap-4">
          <InfoRow
            label="تعداد نفرات"
            value={guestCount >= 1 && guestCount <= 5 ? `${guestCount} نفر` : dash}
          />
        </div>

        <Divider />

        <SectionTitle title="ورود" />
        <div className="flex flex-col gap-4">
          <InfoRow label="تاریخ" value={checkInDate || dash} />
          <InfoRow label="ساعت تقریبی" value={checkInTime} />
        </div>

        <Divider />

        <SectionTitle title="خروج" />
        <div className="flex flex-col gap-4">
          <InfoRow label="تاریخ" value={checkOutDate || dash} />
          <InfoRow label="ساعت تقریبی" value={checkOutTime} />
        </div>

        <Divider />

        <SectionTitle title="زائران" />
        <div className="flex flex-col gap-4">
          <InfoRow label="آقا" value={`${maleCount} نفر`} />
          <InfoRow label="خانم" value={`${femaleCount} نفر`} />
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-base font-semibold text-[#175E47]">{title}</h3>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-[#61756F]">{label}</span>
      <span className="text-sm font-medium text-[#1F2937]">{value}</span>
    </div>
  );
}
