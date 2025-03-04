"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ApiResponse,
  OrdersResponse,
  RevenueResponse,
  DashboardStats,
  GetOrdersParams,
  GetRevenueParams,
} from "@/types/revenuesuper-types";
import revenueService from "@/services/revenuesuperadmin";

export const useOrders = (initialParams?: GetOrdersParams) => {
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetOrdersParams | undefined>(
    initialParams
  );

  const fetchOrders = useCallback(
    async (queryParams?: GetOrdersParams) => {
      setIsLoading(true);
      setError(null);

      const currentParams = queryParams || params;

      try {
        const response = await revenueService.getAllOrders(currentParams);

        if (response.status === "success" && response.data) {
          setOrders(response.data);
        } else {
          setError(response.error || "Failed to fetch orders");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [params]
  );

  // Fetch orders on mount or when params change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Function to update params and refetch
  const updateParams = useCallback((newParams: GetOrdersParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    updateParams,
  };
};

// Custom hook for fetching revenue by period
export const useRevenue = (initialParams?: GetRevenueParams) => {
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GetRevenueParams | undefined>(
    initialParams
  );

  const fetchRevenue = useCallback(
    async (queryParams?: GetRevenueParams) => {
      setIsLoading(true);
      setError(null);

      const currentParams = queryParams || params;

      try {
        const response = await revenueService.getRevenueByPeriod(currentParams);

        if (response.status === "success" && response.data) {
          setRevenue(response.data);
        } else {
          setError(response.error || "Failed to fetch revenue data");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [params]
  );

  // Fetch revenue data on mount or when params change
  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  // Function to update params and refetch
  const updateParams = useCallback((newParams: GetRevenueParams) => {
    setParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  }, []);

  return {
    revenue,
    isLoading,
    error,
    fetchRevenue,
    updateParams,
  };
};

// Custom hook for fetching dashboard stats
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await revenueService.getDashboardStats();

      if (response.status === "success" && response.data) {
        setStats(response.data);
      } else {
        setError(response.error || "Failed to fetch dashboard statistics");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch dashboard stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchDashboardStats,
  };
};
