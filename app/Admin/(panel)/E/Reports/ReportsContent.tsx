"use client";

import StatisticsAreaChart from "@/chart/StatisticsAreaChart";
import StatisticsBarChart from "@/chart/StatisticsBarChart";
import StatisticsPieChart from "@/chart/StatisticsPieChart";

export function ReportsContent() {
  return (
    <div className="flex w-full flex-col gap-6 sm:gap-8" dir="rtl">
      <StatisticsBarChart />
      <StatisticsPieChart />
      <StatisticsAreaChart />
    </div>
  );
}
