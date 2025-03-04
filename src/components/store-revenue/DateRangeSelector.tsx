"use client";

import React from "react";
import { format } from "date-fns";

interface DateRangeSelectorProps {
  startDate: string;
  endDate: string;
  handleDateRangeChange: (days: number) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  startDate,
  endDate,
  handleDateRangeChange,
}) => {
  // Use current date with noon to prevent timezone issues
  const referenceDate = new Date(new Date().setHours(12, 0, 0, 0));

  // Pre-calculate date values for comparison
  const sevenDaysAgo = new Date(referenceDate);
  sevenDaysAgo.setDate(referenceDate.getDate() - 7);
  const sevenDaysAgoStr = format(sevenDaysAgo, "yyyy-MM-dd");

  const thirtyDaysAgo = new Date(referenceDate);
  thirtyDaysAgo.setDate(referenceDate.getDate() - 30);
  const thirtyDaysAgoStr = format(thirtyDaysAgo, "yyyy-MM-dd");

  const ninetyDaysAgo = new Date(referenceDate);
  ninetyDaysAgo.setDate(referenceDate.getDate() - 90);
  const ninetyDaysAgoStr = format(ninetyDaysAgo, "yyyy-MM-dd");

  const yearAgo = new Date(referenceDate);
  yearAgo.setDate(referenceDate.getDate() - 365);
  const yearAgoStr = format(yearAgo, "yyyy-MM-dd");

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date Range
      </label>
      <div className="inline-flex flex-wrap gap-2">
        <button
          onClick={() => handleDateRangeChange(7)}
          className={`px-3 py-1.5 text-sm font-medium border rounded-md ${
            startDate === sevenDaysAgoStr
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Last 7 days
        </button>
        <button
          onClick={() => handleDateRangeChange(30)}
          className={`px-3 py-1.5 text-sm font-medium border rounded-md ${
            startDate === thirtyDaysAgoStr
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Last 30 days
        </button>
        <button
          onClick={() => handleDateRangeChange(90)}
          className={`px-3 py-1.5 text-sm font-medium border rounded-md ${
            startDate === ninetyDaysAgoStr
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Last 90 days
        </button>
        <button
          onClick={() => handleDateRangeChange(365)}
          className={`px-3 py-1.5 text-sm font-medium border rounded-md ${
            startDate === yearAgoStr
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          Last year
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        {startDate} - {endDate}
      </div>
    </div>
  );
};

export default DateRangeSelector;
