"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDateCarouselStats } from "@admin-kit/api/hooks";
import {
  generateNextDays,
  startOfDay,
  toDateKey,
} from "@admin-kit/ui/dateCarouselUtils";
import { toPersianDigits } from "@admin-kit/shared/lib/format";

const StatisticsAreaChart = ({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) => {
  const start = useMemo(() => {
    const d = startOfDay(new Date());
    d.setDate(d.getDate() - 6);
    return d;
  }, []);
  const days = useMemo(() => generateNextDays(7, start), [start]);
  const dateKeys = useMemo(() => days.map(toDateKey), [days]);
  const { data: statsMap, isLoading, error } = useDateCarouselStats(dateKeys);

  const chartData = useMemo(
    () =>
      days.map((day, index) => {
        const key = toDateKey(day);
        const stats = statsMap?.get(key);
        return {
          name: toPersianDigits(String(index + 1)),
          uv: stats?.reserved ?? 0,
          pv: stats?.remaining ?? 0,
        };
      }),
    [days, statsMap],
  );

  return (
    <div className="w-full rounded-xl bg-white px-8 py-7 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <div className="border-b-3 border-amber-500 pb-2">
          <p className="text-lg font-semibold text-gray-500">
            ظرفیت رزرو شده / باقی‌مانده (۷ روز)
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="py-10 text-sm text-gray-500">در حال بارگذاری آمار...</p>
      ) : null}
      {error ? (
        <p className="py-10 text-sm text-red-500">
          {error instanceof Error ? error.message : "خطا در دریافت آمار"}
        </p>
      ) : null}

      {!isLoading && !error ? (
        <div className="mt-6 w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <AreaChart
              style={{
                width: "100%",
                maxHeight: "46vh",
                aspectRatio: 1.618,
              }}
              responsive
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
                isAnimationActive={isAnimationActive}
                name="رزرو شده"
              />
              <Area
                type="monotone"
                dataKey="pv"
                stroke="#82ca9d"
                fillOpacity={1}
                fill="url(#colorPv)"
                isAnimationActive={isAnimationActive}
                name="باقی‌مانده"
              />
            </AreaChart>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StatisticsAreaChart;
