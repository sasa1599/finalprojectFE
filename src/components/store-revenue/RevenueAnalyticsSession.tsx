"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/helper/currencyRp";
import { RevenueQueryParams } from "@/types/revenuestore-types";

interface RevenueAnalysisSectionProps {
  revenueParams: RevenueQueryParams;
  revenueData: any;
  revenueLoading: boolean;
  revenueError: string | null;
  currentYear: number;
  handlePeriodChange: (period: "monthly" | "yearly") => void;
  handleYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const RevenueAnalysisSection: React.FC<RevenueAnalysisSectionProps> = ({
  revenueParams,
  revenueData,
  revenueLoading,
  revenueError,
  currentYear,
  handlePeriodChange,
  handleYearChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Revenue Analysis
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => handlePeriodChange("monthly")}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              revenueParams.period === "monthly"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handlePeriodChange("yearly")}
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              revenueParams.period === "yearly"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Yearly
          </button>
        </div>

        {revenueParams.period === "monthly" && (
          <div>
            <select
              value={revenueParams.year}
              onChange={handleYearChange}
              className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[...Array(5)].map((_, i) => (
                <option key={i} value={currentYear - i}>
                  {currentYear - i}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {revenueLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : revenueError ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          <p>Error: {revenueError}</p>
        </div>
      ) : revenueData && revenueData.revenue.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {revenueParams.period === "monthly"
              ? `Monthly Revenue for ${revenueParams.year}`
              : "Yearly Revenue"}
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {revenueParams.period === "monthly" ? "Month" : "Year"}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.revenue.map((item: any) => (
                  <tr
                    key={
                      revenueParams.period === "monthly"
                        ? item.month
                        : item.year
                    }
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {revenueParams.period === "monthly"
                        ? new Date(0, item.month - 1).toLocaleString(
                            "default",
                            { month: "long" }
                          )
                        : item.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatRupiah(item.total_revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-5 rounded-md text-center">
          <p>No revenue data available</p>
        </div>
      )}
    </div>
  );
};

export default RevenueAnalysisSection;
