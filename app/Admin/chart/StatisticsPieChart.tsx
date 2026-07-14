"use client";

import { useState } from "react";
import {
  Pie,
  PieChart,
  PieLabelRenderProps,
  PieSectorShapeProps,
  Sector,
} from "recharts";

import { useGenderStats } from "@admin-kit/api/hooks";

const RADIAN = Math.PI / 180;
const COLORS = ["#2f5e97", "#8A1538"];

type YearKeys = "1404" | "1405";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

export default function StatisticsPieChart({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  const [selectedYear, setSelectedYear] = useState<YearKeys>("1404");
  const { data = [], isLoading, error } = useGenderStats(selectedYear);

  return (
    <div className="rounded-3xl bg-white px-8 py-6">
      <div className="flex items-center justify-between pb-2">
        <div className="border-b-3 border-amber-500 pb-2">
          <p className="text-lg font-semibold text-gray-500">
            جنسیت زائران امسال
          </p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value as YearKeys)}
          className="cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-1.5 pl-8 text-xs text-gray-600 focus:outline-none"
        >
          <option value="1404">سال ۱۴۰۴</option>
          <option value="1405">سال ۱۴۰۵</option>
        </select>
      </div>

      {isLoading ? (
        <p className="py-10 text-sm text-gray-500">در حال بارگذاری آمار...</p>
      ) : null}
      {error ? (
        <p className="py-10 text-sm text-red-500">
          {error instanceof Error
            ? error.message
            : "دریافت آمار جنسیت ناموفق بود"}
        </p>
      ) : null}
      {!isLoading && !error && data.length === 0 ? (
        <p className="py-10 text-sm text-gray-500">داده‌ای برای این سال نیست.</p>
      ) : null}

      {data.length > 0 ? (
        <div className="flex justify-center">
          <PieChart width={320} height={280}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={110}
              dataKey="value"
              isAnimationActive={isAnimationActive}
              shape={MyCustomPie}
            />
          </PieChart>
        </div>
      ) : null}
    </div>
  );
}
