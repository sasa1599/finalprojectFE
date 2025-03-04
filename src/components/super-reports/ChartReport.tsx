"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  FileBarChart,
  PieChart as PieChartIcon,
  ArrowUpDown,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { InventoryReportData } from "@/types/reports-superadmin-types";

// Colors for charts
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

interface InventoryChartsProps {
  data: InventoryReportData | null;
}

export default function InventoryCharts({ data }: InventoryChartsProps) {
  const [chartType, setChartType] = useState<"inventory" | "value">(
    "inventory"
  );

  // Memoized store bar data preparation
  const storeBarData = useMemo(() => {
    if (!data) return [];

    return [...data.storesSummary]
      .sort((a, b) =>
        chartType === "inventory"
          ? b.totalItems - a.totalItems
          : b.totalValue - a.totalValue
      )
      .slice(0, 5)
      .map((store) => ({
        name: store.store_name,
        value: chartType === "inventory" ? store.totalItems : store.totalValue,
        location: store.location,
      }));
  }, [data, chartType]);

  // Memoized category pie data preparation - STATIC version
  const categoryPieData = useMemo(() => {
    if (!data) return [];

    const categoryMap: Record<string, { name: string; value: number }> = {};

    data.inventory.forEach((item) => {
      const category = item.product.category;
      if (!categoryMap[category]) {
        categoryMap[category] = { name: category, value: 0 };
      }

      // ALWAYS use current_quantity
      categoryMap[category].value += item.current_quantity;
    });

    return Object.values(categoryMap).sort((a, b) => b.value - a.value);
  }, [data]); // Remove chartType dependency

  // Early return if no data
  if (!data) return null;

  // Format tooltip value based on chart type
  const formatTooltipValue = (value: number) => {
    if (chartType === "inventory") {
      return `${value.toLocaleString()} units`;
    } else {
      return `Rp ${value.toLocaleString()}`;
    }
  };

  // Low stock calculations
  const lowStockItems = data.inventory.filter((item) => item.lowStock).length;
  const totalItems = data.inventory.length;
  const lowStockPercentage = Math.round((lowStockItems / totalItems) * 100);

  // Y-axis tick formatter
  const formatYAxisTick = (value: any): string => {
    const numValue = Number(value);
    if (chartType === "inventory") {
      return numValue >= 1000
        ? `${(numValue / 1000).toFixed(0)}K`
        : String(numValue);
    } else {
      return numValue >= 1000000
        ? `${(numValue / 1000000).toFixed(1)}M`
        : numValue >= 1000
        ? `${(numValue / 1000).toFixed(0)}K`
        : String(numValue);
    }
  };

  return (
    <div className="space-y-8">
      {/* Chart header with toggle */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <FileBarChart className="h-5 w-5" />
          Inventory Analytics
        </h2>
        <div className="flex items-center space-x-2 border rounded-md overflow-hidden">
          <button
            className={`px-3 py-2 text-sm font-medium ${
              chartType === "inventory"
                ? "bg-blue-50 text-blue-600"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setChartType("inventory")}
          >
            <span className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              Quantity
            </span>
          </button>
          <button
            className={`px-3 py-2 text-sm font-medium ${
              chartType === "value"
                ? "bg-blue-50 text-blue-600"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setChartType("value")}
          >
            <span className="flex items-center gap-1">
              <ArrowUpDown className="h-4 w-4" />
              Value
            </span>
          </button>
        </div>
      </div>

      {/* Metrics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="text-gray-500 text-sm font-medium mb-3">
            Low Stock Items
          </h3>
          <div className="flex items-center">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16 stroke-current">
                <path
                  className="text-red-100"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-red-500"
                  strokeWidth="3"
                  strokeDasharray={`${lowStockPercentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text
                  x="18"
                  y="20.5"
                  className="text-red-500 font-medium text-5"
                  textAnchor="middle"
                >
                  {lowStockPercentage}%
                </text>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">{lowStockItems}</p>
              <p className="text-sm text-gray-500">out of {totalItems} items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border md:col-span-2">
          <h3 className="text-gray-500 text-sm font-medium mb-2">
            Inventory Value Distribution
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.storesSummary.slice(0, 10)}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="store_name" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip
                  formatter={(value: number) =>
                    chartType === "inventory"
                      ? [`${value.toLocaleString()} units`, "Items"]
                      : [`Rp ${value.toLocaleString()}`, "Value"]
                  }
                />
                <Line
                  type="monotone"
                  dataKey={
                    chartType === "inventory" ? "totalItems" : "totalValue"
                  }
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Main charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="flex items-center gap-1 text-gray-700 font-medium mb-4">
            <BarChart className="h-4 w-4" />
            Top 5 Stores by{" "}
            {chartType === "inventory" ? "Inventory Count" : "Inventory Value"}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={storeBarData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatYAxisTick} />
                <Tooltip
                  formatter={(value: number) => [
                    formatTooltipValue(value),
                    chartType === "inventory" ? "Items" : "Value",
                  ]}
                  labelFormatter={(name) => {
                    const store = storeBarData.find((s) => s.name === name);
                    return `${name} (${store?.location})`;
                  }}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name={
                    chartType === "inventory" ? "Total Items" : "Total Value"
                  }
                  fill="#0088FE"
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Pie chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border">
          <h3 className="flex items-center gap-1 text-gray-700 font-medium mb-4">
            <PieChartIcon className="h-4 w-4" />
            Inventory by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryPieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toLocaleString()} units`,
                    "Items",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
