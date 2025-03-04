//useDateRangeFilter.ts
import { useState, useEffect, useCallback } from "react";
import revenueStoreService from "@/services/revenuestore.service";
import {
  OrdersResponse,
  RevenueByPeriodResponse,
  OrdersQueryParams,
  RevenueQueryParams,
} from "@/types/revenuestore-types";

const formatLocalDate = (date: Date): string => {
  const jakartaDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );
  const year = jakartaDate.getFullYear();
  const month = String(jakartaDate.getMonth() + 1).padStart(2, "0");
  const day = String(jakartaDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useStoreOrders = (initialParams?: OrdersQueryParams) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<OrdersResponse | null>(null);

  // Use current date in Jakarta time
  const currentDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  // Default to 30 days before current date
  const defaultStartDate = new Date(currentDate);
  defaultStartDate.setDate(currentDate.getDate() - 30);

  // Use a state that tracks changes more explicitly
  const [params, setParams] = useState<OrdersQueryParams>({
    startDate: initialParams?.startDate || formatLocalDate(defaultStartDate),
    endDate: initialParams?.endDate || formatLocalDate(currentDate),
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
      const endDate = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
      );
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - days);

      updateParams({
        startDate: formatLocalDate(startDate),
        endDate: formatLocalDate(endDate),
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

  const currentDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

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
