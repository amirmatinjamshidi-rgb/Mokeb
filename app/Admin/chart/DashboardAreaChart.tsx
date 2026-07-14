"use client";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const dataByYear = {
  "1447": [
    { name: "شنبه", uv: 580, pv: 500 },
    { name: "یکشنبه", uv: 640, pv: 680 },
    { name: "دوشنبه", uv: 580, pv: 620 },
    { name: "سه شنبه", uv: 560, pv: 650 },
    { name: "چهارشنبه", uv: 600, pv: 640 },
    { name: "پنچشنبه", uv: 780, pv: 600 },
    { name: "جمعه", uv: 500, pv: 480 },
  ],
  "1448": [
    { name: "شنبه", uv: 600, pv: 520 },
    { name: "یکشنبه", uv: 700, pv: 610 },
    { name: "دوشنبه", uv: 620, pv: 580 },
    { name: "سه شنبه", uv: 590, pv: 600 },
    { name: "چهارشنبه", uv: 650, pv: 670 },
    { name: "پنچشنبه", uv: 800, pv: 720 },
    { name: "جمعه", uv: 550, pv: 510 },
  ],
};

const DashboardAreaChart = ({ isAnimationActive = true }) => {
  type YearKeys = keyof typeof dataByYear;
  const [selectedYear, setSelectedYear] = useState<YearKeys>("1448");
  const currentData = dataByYear[selectedYear] || dataByYear["1447"];

  return (
    <div className="bg-white rounded-xl shadow-sm px-8 py-7">
      <div className="flex justify-between items-center pb-2">
        <div className="border-b-3 border-amber-500 pb-2">
          <p className="text-lg text-gray-500 font-semibold">ورودی / خروجی</p>
        </div>

        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value as YearKeys)}
            className="appearance-none text-xs bg-white border border-gray-300 rounded-lg px-4 py-1.5 pl-8 text-gray-600 cursor-pointer focus:outline-none"
          >
            <option value="1447" className="cursor-pointer text-xs">
              سال 1447
            </option>
            <option value="1448" className="cursor-pointer text-xs">
              سال 1448
            </option>
          </select>
        </div>
      </div>
      <div className="mt-6 w-full overflow-x-auto">
        <div className="min-w-[640px]">
          <AreaChart
          style={{
            width: "100%",
            maxWidth: "750px",
            maxHeight: "40vh",
            aspectRatio: 1.618,
          }}
          responsive
          data={currentData}
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
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis
            dataKey="name"
            tickLine={false}
            tick={{ fontSize: 14, fill: "#9ca3bf", dy: 10 }}
            axisLine={false}
          />
          <YAxis
            width="auto"
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3bf", dx: -20, dy: -4 }}
            axisLine={false}
            domain={[0, 1000]}
            ticks={[200, 400, 600, 800, 1000]}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="pv"
            stroke="#8884d8"
            fillOpacity={1}
            fill="#8884d840"
            isAnimationActive={isAnimationActive}
          />
          <Area
            type="monotone"
            dataKey="uv"
            stroke="#82ca9d"
            fillOpacity={1}
            fill="#82ca9d40"
            isAnimationActive={isAnimationActive}
          />
        </AreaChart>
        </div>
      </div>
      <div className="flex justify-center gap-x-8 mt-10">
        <div className="flex items-center gap-x-3">
          <span className="w-3 h-3 rounded-full bg-[#82ca9d]"></span>
          <p className="text-gray-600 text-sm">ورودی</p>
        </div>
        <div className="flex items-center gap-x-3">
          <span className="w-3 h-3 rounded-full bg-[#8884d8]"></span>
          <p className="text-gray-600 text-sm">خروجی</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAreaChart;
