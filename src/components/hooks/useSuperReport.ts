"use client";

import { useState, useEffect, useMemo } from "react";
import { InventoryReportService } from "@/services/reports-superadmin";
import {
  InventoryReportData,
  InventoryReportFilters,
  InventoryReportResponse,
  PaginationInfo,
  PaginationParams,
  NestedPaginationInfo,
} from "@/types/reports-superadmin-types";

// Define explicit types for the split data
interface ChartData {
  overview: {
    totalStores: number;
    totalItems: number;
    totalValue: number;
    averageItemsPerStore: number;
    displayedStores?: number;
  };
  storesSummary: Array<{
    store_id: number;
    store_name: string;
    location: string;
    totalItems: number;
    totalValue: number;
    itemCount: number;
  }>;
  inventoryCount?: number;
}

interface InventoryItem {
  inventory_id: number;
  store: {
    id: number;
    name: string;
  };
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
  };
  current_quantity: number;
  total_quantity: number;
  stockValue: number;
  lowStock: boolean;
}

interface UseInventoryReportProps {
  initialFilters?: InventoryReportFilters;
  initialPagination?: PaginationParams;
}

export const useInventoryReport = ({
  initialFilters = {},
  initialPagination = { page: 1, limit: 10 },
}: UseInventoryReportProps = {}) => {
  // Properly typed state variables
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] =
    useState<InventoryReportFilters>(initialFilters);
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );

  // Combine the data for components that need the full structure
  const data = useMemo(() => {
    if (!chartData || !inventoryData) return null;

    return {
      overview: chartData.overview,
      storesSummary: chartData.storesSummary,
      inventory: inventoryData,
      // Include any other properties needed
    } as InventoryReportData;
  }, [chartData, inventoryData]);

  // Helper to extract the correct pagination info (inventory-specific if nested)
  const extractPaginationInfo = (
    response: InventoryReportResponse
  ): PaginationInfo | null => {
    if (!response.pagination) return null;

    // Check if we have nested pagination with inventory property
    if (
      response.pagination &&
      "inventory" in response.pagination &&
      response.pagination.inventory
    ) {
      return response.pagination.inventory;
    }

    // Otherwise use the direct pagination info
    return response.pagination as PaginationInfo;
  };

  // Fetch chart data only (using the existing service method)
  const fetchChartData = async (reportFilters?: InventoryReportFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const filtersToUse = reportFilters || filters;

      // Use existing service method with minimal pagination
      const response = await InventoryReportService.getInventoryReport(
        filtersToUse,
        { page: 1, limit: 1 } // Fetch minimal data for charts
      );

      // Split the response data
      const { inventory, ...rest } = response.data;
      setChartData(rest as ChartData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("An error occurred loading chart data")
      );
      setChartData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch only paginated inventory data
  const fetchInventory = async (
    reportFilters?: InventoryReportFilters,
    paginationParams?: PaginationParams
  ) => {
    setIsLoading(true);

    try {
      const filtersToUse = reportFilters || filters;
      const paginationToUse = paginationParams || pagination;

      // Use existing service method
      const response = await InventoryReportService.getInventoryReport(
        filtersToUse,
        paginationToUse
      );

      setInventoryData(response.data.inventory as InventoryItem[]);

      // Save pagination info from response
      const paginationData = extractPaginationInfo(response);
      if (paginationData) {
        setPaginationInfo(paginationData);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("An error occurred loading inventory data")
      );
      setInventoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Existing method - now will call both specialized methods
  const fetchReport = async (
    reportFilters?: InventoryReportFilters,
    paginationParams?: PaginationParams
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const filtersToUse = reportFilters || filters;
      const paginationToUse = paginationParams || pagination;

      const response = await InventoryReportService.getInventoryReport(
        filtersToUse,
        paginationToUse
      );

      // Split the response data
      const { inventory, ...rest } = response.data;
      setChartData(rest as ChartData);
      setInventoryData(inventory as InventoryItem[]);

      // Save pagination info from response using the helper
      const paginationData = extractPaginationInfo(response);
      if (paginationData) {
        setPaginationInfo(paginationData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setChartData(null);
      setInventoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters and reset to page 1
  const updateFilters = (newFilters: InventoryReportFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));

    // Reset to page 1 when filters change
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Update pagination
  const updatePagination = (newPagination: PaginationParams) => {
    setPagination((prev) => ({
      ...prev,
      ...newPagination,
    }));
  };

  // Navigate to specific page
  const goToPage = (page: number) => {
    if (page < 1) return;

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  // Go to next page
  const nextPage = () => {
    if (paginationInfo?.hasNextPage) {
      goToPage((pagination.page || 1) + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (paginationInfo?.hasPrevPage) {
      goToPage((pagination.page || 1) - 1);
    }
  };

  // Fetch all inventory data across all pages
  const fetchAllData = async (reportFilters?: InventoryReportFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const filtersToUse = reportFilters || filters;
      const response = await InventoryReportService.getAllInventoryReport(
        filtersToUse
      );

      // Split the response data
      const { inventory, ...rest } = response.data;
      setChartData(rest as ChartData);
      setInventoryData(inventory as InventoryItem[]);

      // For the full data, we don't need pagination info
      setPaginationInfo({
        total: inventory.length,
        page: 1,
        limit: inventory.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      setChartData(null);
      setInventoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Split the effects - only fetch chart data when filters change
  useEffect(() => {
    if (!chartData) {
      // For initial load or when resetting, fetch everything
      fetchReport();
    } else {
      // If we already have chart data, only refresh chart data when filters change
      fetchChartData();
    }
  }, [filters]);

  // Only fetch inventory data when pagination or filters change
  useEffect(() => {
    // Don't fetch inventory data on initial render - the fetchReport handles that
    if (chartData) {
      fetchInventory();
    }
  }, [pagination, filters]);

  return {
    data,
    isLoading,
    error,
    filters,
    pagination,
    paginationInfo,
    updateFilters,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchReport,
    fetchAllData,
  };
};
