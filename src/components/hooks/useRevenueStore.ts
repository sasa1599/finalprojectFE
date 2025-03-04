import { useState, useEffect, useCallback } from "react";
import revenueStoreService from "@/services/revenuestore.service";
import {
  OrdersResponse,
  RevenueByPeriodResponse,
  OrdersQueryParams,
  RevenueQueryParams,
} from "@/types/revenuestore-types";
import { format } from "date-fns";

export const useStoreOrders = (initialParams?: OrdersQueryParams) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrdersResponse | null>(null);

  // Use current date with noon to prevent timezone issues
  const currentDate = new Date(new Date().setHours(12, 0, 0, 0));

  // Default to 30 days before current date
  const defaultStartDate = new Date(currentDate);
  defaultStartDate.setDate(currentDate.getDate() - 30);

  // Use a state that tracks changes more explicitly
  const [params, setParams] = useState<OrdersQueryParams>({
    startDate:
      initialParams?.startDate || format(defaultStartDate, "yyyy-MM-dd"),
    endDate: initialParams?.endDate || format(currentDate, "yyyy-MM-dd"),
    status: initialParams?.status,
  });

  // Create a memoized fetch function
  const fetchData = useCallback(async () => {
    console.group("Fetching Store Orders");
    console.log("Current Params:", params);

    setLoading(true);
    setError(null);

    try {
      // Validate date parameters
      if (!params.startDate || !params.endDate) {
        throw new Error("Start and end dates are required");
      }

      const response = await revenueStoreService.getStoreOrders(params);

      console.log("Fetched Response:", response);
      console.groupEnd();

      setData(response);
    } catch (err) {
      console.error("Fetch Error:", err);
      console.groupEnd();

      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [params.startDate, params.endDate, params.status]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enhanced parameter setting with validation
  const updateParams = useCallback((newParams: Partial<OrdersQueryParams>) => {
    setParams((prev) => {
      const updated = { ...prev, ...newParams };

      // Date range validation
      const startDate = new Date(updated.startDate || "");
      const endDate = new Date(updated.endDate || "");

      if (startDate > endDate) {
        console.warn("Invalid date range: Start date cannot be after end date");
        return prev; // Return previous state if invalid
      }

      return updated;
    });
  }, []);

  // Add a specialized function for date range changes
  const setDateRange = useCallback(
    (days: number) => {
      // Use noon to prevent timezone issues
      const endDate = new Date(new Date().setHours(12, 0, 0, 0));
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - days);

      updateParams({
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
      });
    },
    [updateParams]
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setParams: updateParams,
    setDateRange,
    params, // Export current params for UI state comparisons
  };
};

export const useRevenueByPeriod = (initialParams?: RevenueQueryParams) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RevenueByPeriodResponse | null>(null);

  const currentDate = new Date(new Date().setHours(12, 0, 0, 0));

  const [params, setParams] = useState<RevenueQueryParams>({
    period: initialParams?.period || "monthly",
    year: initialParams?.year || currentDate.getFullYear(),
  });

  const fetchData = useCallback(async () => {
    console.group("Fetching Revenue By Period");
    console.log("Current Params:", params);

    setLoading(true);
    setError(null);

    try {
      const response = await revenueStoreService.getRevenueByPeriod(params);

      console.log("Fetched Response:", response);
      console.groupEnd();

      setData(response);
    } catch (err) {
      console.error("Fetch Error:", err);
      console.groupEnd();

      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, [params.period, params.year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateParams = useCallback((newParams: Partial<RevenueQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    setParams: updateParams,
    params, // Export current params for easier access
  };
};
