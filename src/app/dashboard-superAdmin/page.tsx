"use client";

import { useState, useEffect } from "react";
import { UserManagementService } from "@/services/user-management.service";
import { PieChart, ShoppingCart, DollarSign, Users } from "lucide-react";
import { InventoryReportService } from "@/services/reports-superadmin";
import { InventoryReportData } from "@/types/reports-superadmin-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/super-revenue/OverviewTabs";
import { RevenueTab } from "@/components/super-revenue/RevenueTabs";
import { OrdersTab } from "@/components/super-revenue/OrderTab";
import { formatRupiah } from "@/helper/currencyRp";
import { OrderStatus } from "@/types/revenuesuper-types";
import { format } from "date-fns";
import {
  useRevenue,
  useOrders,
  useDashboardStats,
} from "@/components/hooks/useRevenueSuper";
import InventoryCharts from "@/components/super-reports/ChartReport";

export default function DashboardSuperAdmin() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStoreAdmin, setStoreAdmin] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [inventoryData, setInventoryData] =
    useState<InventoryReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Revenue dashboard functions
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch all data in parallel for better performance
        const [allUsers, storeAdmins, customers, inventoryReport] =
          await Promise.all([
            UserManagementService.getAllUsers(),
            UserManagementService.getAllStoreAdmin(),
            UserManagementService.getAllCustomer(),
            InventoryReportService.getInventoryReport(), // Add inventory report fetch
          ]);

        setTotalUsers(allUsers.length);
        setStoreAdmin(storeAdmins.length);
        setTotalCustomer(customers.length);
        setInventoryData(inventoryReport.data);
        setIsLoading(false);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        setIsLoading(false);
        console.error("Failed to load dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const statistics = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Total Store Admin",
      value: totalStoreAdmin.toLocaleString(),
      icon: <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: "bg-green-500",
    },
    {
      title: "Total Customer",
      value: totalCustomer.toLocaleString(),
      icon: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Active Sessions",
      value: "89",
      icon: <PieChart className="h-5 w-5 sm:h-6 sm:w-6" />,
      color: "bg-orange-500",
    },
  ];

  // Combined loading state
  const combinedLoading =
    isLoading || statsLoading || revenueLoading || ordersLoading;

  if (combinedLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] md:min-h-[500px]">
        <div className="loader-dominoes-container">
          <div className="loader-dominoes"></div>
          <p className="loading-text">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || statsError || revenueError || ordersError) {
    const errorMessage = error || statsError || revenueError || ordersError;
    return (
      <div className="min-h-[300px] md:min-h-[500px] flex items-center justify-center bg-red-50 rounded-lg p-4 md:p-6">
        <div className="text-center">
          <p className="text-red-600 font-medium mb-2">
            Failed to load dashboard data
          </p>
          <p className="text-red-500 text-sm md:text-base">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        {statistics.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} p-2 sm:p-3 rounded-full text-white flex-shrink-0`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 mb-4 md:mb-6 overflow-hidden">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 md:mb-6">
          Revenue & Orders Dashboard
        </h2>

        <Tabs defaultValue="overview" className="space-y-6 md:space-y-8">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm md:text-base">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6 md:space-y-8">
            <OverviewTab
              stats={stats}
              error={statsError}
              formatCurrency={formatRupiah}
            />
          </TabsContent>

          {/* REVENUE ANALYSIS TAB */}
          <TabsContent value="revenue" className="space-y-6 md:space-y-8">
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
          <TabsContent value="orders" className="space-y-6 md:space-y-8">
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
    </div>
  );
}
