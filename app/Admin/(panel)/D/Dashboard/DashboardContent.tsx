"use client";

import DashboardAreaChart from "@/chart/DashboardAreaChart";
import DashboardCapacityStatisticsChart from "@/chart/DashboardCapacityStatisticsChart";

import { DashboardStatCards } from "./DashboardStatCards";

export function DashboardContent() {
  return (
    <div className="flex w-full flex-col gap-8" dir="rtl">
      <DashboardStatCards />

      <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-stretch">
        <div className="min-w-0 w-full lg:flex-[7]">
          <DashboardCapacityStatisticsChart />
        </div>
        <div className="min-w-0 w-full lg:flex-[13]">
          <DashboardAreaChart />
        </div>
      </div>
    </div>
  );
}
