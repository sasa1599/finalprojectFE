"use client";

import React, { useState } from "react";
import { useRevenueByPeriod, useStoreOrders } from "../hooks/useRevenueStore";
import {
  OrderStatus,
  RevenueQueryParams,
  OrdersQueryParams,
  Order as StoreOrder
} from "@/types/revenuestore-types";
import RevenueAnalysisSection from "./RevenueAnalyticsSession";
import OrdersSection from "./OrderSelection";
import { StoreRevenueCharts } from "@/components/store-revenue/RevenueChartStore";

// Define the Order type expected by StoreRevenueCharts component
interface ChartOrder {
  id: number;
  order_id: string;
  customer_name: string;
  order_date: string;
  status: string;
  total_price: number;
}

const RevenueDashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [revenueParams, setRevenueParams] = useState<RevenueQueryParams>({
    period: "monthly",
    year: currentYear,
  });

  // Use the enhanced hook with date range functionality
  const {
    data: ordersData,
    loading: ordersLoading,
    error: ordersError,
    params: ordersParams,
    setDateRange: handleDateRangeChange,
    setParams: setOrdersParams,
  } = useStoreOrders();

  const {
    data: revenueData,
    loading: revenueLoading,
    error: revenueError,
  } = useRevenueByPeriod(revenueParams);

  const handlePeriodChange = (period: "monthly" | "yearly") => {
    setRevenueParams((prev) => ({ ...prev, period }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRevenueParams((prev) => ({ ...prev, year: parseInt(e.target.value) }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as OrderStatus | "";
    setOrdersParams({
      status: status === "" ? undefined : status,
    });
  };

  // Transform ordersData to match the expected format for the chart component
  const transformedOrdersData = ordersData && ordersData.orders ? {
    totalOrders: ordersData.totalOrders || 0,
    totalRevenue: ordersData.totalRevenue || 0,
    orders: ordersData.orders.map((order: StoreOrder) => {
      // Create a new object with the expected structure
      const chartOrder: ChartOrder = {
        id: order.order_id, // Use order_id as id
        order_id: order.order_id.toString(), // Convert to string if needed
        customer_name: `${order.user.first_name || ''} ${order.user.last_name || ''}`.trim() || "Unknown Customer",
        order_date: order.created_at,
        status: order.order_status,
        total_price: order.total_price
      };
      return chartOrder;
    })
  } : undefined;

  // Ensure period is never undefined
  const chartPeriod = revenueParams.period || "monthly";

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Store Revenue Dashboard
        </h1>
      </div>
      
      {/* Charts Section */}
      {!revenueLoading && !revenueError && revenueData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <StoreRevenueCharts 
            revenueData={revenueData}
            ordersData={transformedOrdersData}
            period={chartPeriod}
            year={revenueParams.year}
          />
        </div>
      )}

      <RevenueAnalysisSection
        revenueParams={revenueParams}
        revenueData={revenueData}
        revenueLoading={revenueLoading}
        revenueError={revenueError}
        currentYear={currentYear}
        handlePeriodChange={handlePeriodChange}
        handleYearChange={handleYearChange}
      />

      <OrdersSection
        ordersData={ordersData}
        ordersLoading={ordersLoading}
        ordersError={ordersError}
        ordersParams={{
          startDate: ordersParams.startDate || "",
          endDate: ordersParams.endDate || "",
          status: ordersParams.status,
        }}
        handleDateRangeChange={handleDateRangeChange}
        handleStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default RevenueDashboard;