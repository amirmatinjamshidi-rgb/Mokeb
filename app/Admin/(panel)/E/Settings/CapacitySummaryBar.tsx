"use client";

import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";

import { SETTINGS_PANEL_CLASS } from "./settingsStyles";

type Stats = {
  totalCapacity: number;
  maleCapacity: number;
  femaleCapacity: number;
  reservedCapacity: number;
  availableCapacity: number;
};

const EMPTY_SEGMENTS = [
  { title: "ظرفیت کل", partA: 0, partB: 0, total: 0 },
  { title: "رزرو شده", partA: 0, partB: 0, total: 0 },
  { title: "باقی مانده", partA: 0, partB: 0, total: 0 },
];

function ValueRow({
  partA,
  partB,
  total,
}: {
  partA: number;
  partB: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-4 text-lg font-bold leading-none">
      <span className="text-[#2E7DDC]">({toPersianDigits(partA)},</span>
      <span className="text-[#D22B23]">{toPersianDigits(partB)})</span>
      <span className="text-[#CBA52C]">{toPersianDigits(total)}</span>
    </div>
  );
}

function Divider() {
  return (
    <div
      className="mx-4 hidden h-12 w-px shrink-0 bg-gray-200 sm:block"
      aria-hidden
    />
  );
}

export function CapacitySummaryBar({ stats }: { stats?: Stats | null }) {
  const segments = stats
    ? [
        {
          title: "ظرفیت کل",
          partA: stats.maleCapacity,
          partB: stats.femaleCapacity,
          total: stats.totalCapacity,
        },
        {
          title: "رزرو شده",
          partA: stats.reservedCapacity,
          partB: 0,
          total: stats.reservedCapacity,
        },
        {
          title: "باقی مانده",
          partA: stats.availableCapacity,
          partB: 0,
          total: stats.availableCapacity,
        },
      ]
    : EMPTY_SEGMENTS;

  return (
    <div
      className={cn(
        SETTINGS_PANEL_CLASS,
        "flex w-full flex-col items-center justify-center gap-8 px-6 py-6 sm:h-[110px] sm:flex-row sm:gap-0 sm:py-5 sm:px-[72px]",
      )}
      dir="rtl"
    >
      {segments.map((segment, index) => (
        <div
          key={segment.title}
          className="flex w-full flex-col items-center sm:w-auto sm:flex-row"
        >
          {index > 0 ? <Divider /> : null}
          <div className="flex flex-col items-center justify-center gap-4 px-4 text-center">
            <ValueRow
              partA={segment.partA}
              partB={segment.partB}
              total={segment.total}
            />
            <span className="text-sm font-medium text-gray-500">
              {segment.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
