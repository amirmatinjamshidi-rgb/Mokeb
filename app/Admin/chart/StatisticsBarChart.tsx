"use client";

import { useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useRequestTypeStats } from "@admin-kit/api/hooks";

type YearKeys = "1404" | "1405";

export default function StatisticsBarChart() {
  const [selectedYear, setSelectedYear] = useState<YearKeys>("1404");
  const { data = [], isLoading, error } = useRequestTypeStats(selectedYear);

  const renderCustomDot = (props: {
    cx?: number;
    cy?: number;
    value?: number;
  }) => {
    const { cx, cy, value } = props;
    if (cx == null || cy == null) return null;
    return (
      <g key={`dot-${cx}-${cy}`}>
        <circle cx={cx} cy={cy} r={6} fill="#C69F34" />
        <circle cx={cx} cy={cy} r={3} fill="#FFF" />
        <text
          x={cx}
          y={cy - 12}
          fill="#71717a"
          fontSize={12}
          fontWeight="bold"
          textAnchor="middle"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <div className="rounded-3xl bg-white px-8 py-6">
      <div className="flex items-center justify-between pb-2">
        <div className="border-b-3 border-amber-500 pb-2">
          <p className="text-lg font-semibold text-gray-500">نوع رزرو</p>
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
            : "دریافت آمار نوع رزرو ناموفق بود"}
        </p>
      ) : null}
      {!isLoading && !error && data.length === 0 ? (
        <p className="py-10 text-sm text-gray-500">داده‌ای برای این سال نیست.</p>
      ) : null}

      {data.length > 0 ? (
        <div className="w-130">
          <ComposedChart
            style={{
              width: "100%",
              maxWidth: "700px",
              maxHeight: "70vh",
              aspectRatio: 1.618,
            }}
            responsive
            data={data}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey="name"
              scale="band"
              tickLine={false}
              tick={{ fontSize: 14, fill: "#9ca3bf", dy: 10 }}
            />
            <YAxis
              width="auto"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#9ca3bf", dy: -5, dx: -30 }}
            />
            <Tooltip cursor={{ fill: "#f4f4f5", opacity: 0.4 }} />
            <Bar dataKey="uv" barSize={50} fill="#9CBFAD" />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#C69F34"
              strokeWidth={2}
              dot={renderCustomDot}
            />
          </ComposedChart>
        </div>
      ) : null}
    </div>
  );
}
