"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, TooltipIndex } from "recharts";
const dataByYear = {
  "1447": [
    { id: 1, name: "کاروان ها", value: 400, color: "#8A1538" },
    { id: 2, name: "عمومی", value: 200, color: "#D1AC3A" },
    { id: 3, name: "باقی مانده", value: 100, color: "#4E8470" },
  ],
  "1448": [
    { id: 1, name: "کاروان ها", value: 600, color: "#8A1538" },
    { id: 2, name: "عمومی", value: 300, color: "#D1AC3A" },
    { id: 3, name: "باقی مانده", value: 100, color: "#4E8470" },
  ],
};

type YearKeys = keyof typeof dataByYear;

export default function CustomActiveShapePieChart({
  isAnimationActive = true,
  defaultIndex = undefined,
}: {
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
}) {
  const [selectedYear, setSelectedYear] = useState<YearKeys>("1448");
  const currentData = dataByYear[selectedYear] || dataByYear["1447"];
  const totalCapacity = currentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col bg-white py-6 px-5 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center pb-4">
        <div className="border-b-3 border-amber-500 pb-2">
          <p className="text-base text-gray-500 font-bold">آمار ظرفیت</p>
        </div>

        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value as YearKeys)}
            className="appearance-none border border-gray-200 rounded-lg px-4 py-1.5 pl-8 text-xs text-gray-600 
            cursor-pointer focus:outline-none"
          >
            <option value="1447">سال 1447</option>
            <option value="1448">سال 1448</option>
          </select>
        </div>
      </div>
      <div
        className="w-full flex justify-center items-center my-3 relative"
        style={{ height: "150px" }}
      >
        <div className="absolute flex flex-col items-center justify-center pointer-events-none z-10">
          <span className="text-sm text-gray-400 font-semibold mb-1">
            کل ظرفیت
          </span>
          <span className="text-xl font-bold text-gray-900">
            {totalCapacity}
          </span>
        </div>

        <PieChart width={320} height={160}>
          <Pie
            data={currentData}
            cx="50%"
            cy="50%"
            innerRadius="70%"
            outerRadius="96%"
            paddingAngle={3}
            dataKey="value"
            isAnimationActive={isAnimationActive}
          >
            {currentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={() => null} defaultIndex={defaultIndex} />
        </PieChart>
      </div>
      <div className="flex justify-between items-center text-xs font-bold text-gray-400 pb-2 mb-2 pt-4 mt-4 px-3 border-t border-orange-600">
        <p className="text-gray-600 font-semibold text-lg pr-6">ظرفیت</p>
        <p className="text-gray-600 font-semibold text-lg">تعداد نفرات</p>
      </div>
      <div className="flex flex-col gap-y-6 px-3 mt-2">
        {currentData.map((item) => (
          <div key={item.id} className="flex justify-between items-center">
            <div className="flex items-center gap-x-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <p className="text-gray-400 font-medium text-sm">{item.name}</p>
            </div>
            <p className="text-gray-400 font-semibold text-sm">
              {item.value} نفر
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
