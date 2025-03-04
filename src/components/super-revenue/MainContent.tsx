"use client";

import { useState } from "react";
import {
  useRevenue,
  useOrders,
  useDashboardStats,
} from "@/components/hooks/useRevenueSuper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/super-revenue/OverviewTabs";
import { RevenueTab } from "@/components/super-revenue/RevenueTabs";
import { OrdersTab } from "@/components/super-revenue/OrderTab";
import { formatRupiah } from "@/helper/currencyRp";
import { OrderStatus } from "@/types/revenuesuper-types";
import { format } from "date-fns";

export default function RevenueDashboardPage() {
  // Dashboard stats
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();

  // Period filter states
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [periodType, setPeriodType] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  // Revenue data
  const {
    revenue,
    isLoading: revenueLoading,
    error: revenueError,
    fetchRevenue,
  } = useRevenue({
    period: periodType,
    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
  });

  // Orders filter states
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");

  // Orders data
  const {
    orders,
    isLoading: ordersLoading,
    error: ordersError,
    updateParams,
    fetchOrders,
  } = useOrders({
    page: 1,
    limit: pageSize,
    status: statusFilter,
  });

  // Apply revenue filters
  const applyRevenueFilters = () => {
    fetchRevenue({
      period: periodType,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
    });
  };

  // Handle orders page change
  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  // Handle orders search
  const handleSearch = () => {
    fetchOrders();
  };

  // Handle orders status filter change
  const handleStatusChange = (status: string) => {
    setStatusFilter(status === "all" ? undefined : (status as OrderStatus));
    updateParams({
      status: status === "all" ? undefined : (status as OrderStatus),
      page: 1,
    });
  };

  // Handle orders page size change
  const handlePageSizeChange = (size: string) => {
    const newSize = parseInt(size);
    setPageSize(newSize);
    updateParams({ limit: newSize, page: 1 });
  };

  // Loading states
  const isLoading = statsLoading || revenueLoading || ordersLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Revenue & Orders Dashboard</h1>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="orders">Orders Management</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-8">
          <OverviewTab
            stats={stats}
            error={statsError}
            formatCurrency={formatRupiah}
          />
        </TabsContent>

        {/* REVENUE ANALYSIS TAB */}
        <TabsContent value="revenue" className="space-y-8">
          <RevenueTab
            revenue={revenue}
            error={revenueError}
            startDate={startDate}
            endDate={endDate}
            periodType={periodType}
            formatCurrency={formatRupiah}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setPeriodType={setPeriodType}
            applyRevenueFilters={applyRevenueFilters}
          />
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="space-y-8">
          <OrdersTab
            orders={orders}
            error={ordersError}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            pageSize={pageSize}
            formatCurrency={formatRupiah}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            handleStatusChange={handleStatusChange}
            handlePageSizeChange={handlePageSizeChange}
            handlePageChange={handlePageChange}
            fetchOrders={fetchOrders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
