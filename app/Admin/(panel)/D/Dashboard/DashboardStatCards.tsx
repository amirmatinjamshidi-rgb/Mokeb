"use client";

import type { ComponentType } from "react";
import {
  Profile2User,
  Receipt,
  UserAdd,
  UserMinus,
} from "iconsax-reactjs";
import { ArrowDown, ArrowUp } from "lucide-react";

import {
  useIncomingRequests,
  useOutgoingRequests,
  useRequestedRequestsAmount,
  useRoomReportStats,
} from "@admin-kit/api/hooks";
import { toPersianDigits } from "@admin-kit/shared/lib/format";
import { cn } from "@admin-kit/shared/lib/utils";
import { toDateKey } from "@admin-kit/ui/dateCarouselUtils";

import { usePanelDate } from "../PanelDateContext";

type StatTrend = {
  value: number;
  changePercent: number;
};

type StatConfig = {
  id: string;
  title: string;
  icon: ComponentType<{
    variant?: "Outline";
    color?: string;
    size?: string | number;
  }>;
};

const STAT_CONFIG: StatConfig[] = [
  { id: "entries", title: "ورودی های امروز", icon: UserAdd },
  { id: "exits", title: "خروجی های امروز", icon: UserMinus },
  {
    id: "remainingCapacity",
    title: "ظرفیت باقی مانده (عمومی)",
    icon: Profile2User,
  },
  { id: "unseenRequests", title: "درخواست های دیده نشده", icon: Receipt },
];

function StatCard({
  title,
  value,
  changePercent,
  icon: Icon,
}: StatConfig & StatTrend) {
  const isUp = changePercent >= 0;
  const TrendIcon = isUp ? ArrowUp : ArrowDown;

  return (
    <article
      className="flex h-[164px] w-full flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-md"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-2">
        <Icon variant="Outline" color="#279F78" size={28} aria-hidden />

        <div className="flex flex-row flex-wrap items-center justify-end gap-1">
          <TrendIcon
            className={cn(
              "size-4 shrink-0",
              isUp ? "text-[#279F78]" : "text-[#D22B23]",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "text-sm font-semibold",
              isUp ? "text-[#279F78]" : "text-[#D22B23]",
            )}
          >
            ({toPersianDigits(`${Math.abs(changePercent)}%`)})
          </span>
          <span className="text-xs text-[#61756F]">نسبت به دیروز</span>
        </div>
      </div>

      <p className="text-3xl font-bold leading-none text-[#CBA52C]">
        {toPersianDigits(value)}
      </p>

      <p className="mt-auto text-sm font-medium text-gray-500">{title}</p>
    </article>
  );
}

export function DashboardStatCards() {
  const { selectedDate } = usePanelDate();
  const dateKey = toDateKey(selectedDate);
  const yesterday = new Date(selectedDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toDateKey(yesterday);

  const { data: roomStats } = useRoomReportStats(dateKey);
  const { data: yesterdayStats } = useRoomReportStats(yesterdayKey);
  const { data: incoming = [] } = useIncomingRequests(dateKey, "");
  const { data: outgoing = [] } = useOutgoingRequests(dateKey, "");
  const { data: requestAmount } = useRequestedRequestsAmount(dateKey);
  const { data: yesterdayIncoming = [] } = useIncomingRequests(yesterdayKey, "");
  const { data: yesterdayOutgoing = [] } = useOutgoingRequests(yesterdayKey, "");

  const pct = (today: number, prior: number) => {
    if (prior <= 0) return today > 0 ? 100 : 0;
    return Math.round(((today - prior) / prior) * 100);
  };

  const entries = incoming.length;
  const exits = outgoing.length;
  const remaining = roomStats?.availableCapacity ?? 0;
  const unseen =
    typeof requestAmount === "number" ? requestAmount : Number(requestAmount) || 0;

  const stats: Record<string, StatTrend> = {
    entries: {
      value: entries,
      changePercent: pct(entries, yesterdayIncoming.length),
    },
    exits: {
      value: exits,
      changePercent: pct(exits, yesterdayOutgoing.length),
    },
    remainingCapacity: {
      value: remaining,
      changePercent: pct(
        remaining,
        yesterdayStats?.availableCapacity ?? 0,
      ),
    },
    unseenRequests: {
      value: unseen,
      changePercent: 0,
    },
  };

  return (
    <div
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      dir="rtl"
      aria-label={`آمار داشبورد برای ${dateKey}`}
    >
      {STAT_CONFIG.map((config) => (
        <StatCard key={config.id} {...config} {...stats[config.id]} />
      ))}
    </div>
  );
}
