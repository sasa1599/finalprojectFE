"use client";

import { useState, useMemo } from "react";
import { useInventoryReport } from "@/components/hooks/useSuperReport";
import {
  InventoryReportFilters,
  PaginationParams,
} from "@/types/reports-superadmin-types";
import { FileBarChart, RefreshCw, FileDown } from "lucide-react";
import { FilterForm } from "@/components/super-reports/FilterForm";
import { OverviewCards } from "@/components/super-reports/OverviewCard";
import { StoresSummaryTable } from "@/components/super-reports/StoresSummart";
import { InventoryDetails } from "@/components/super-reports/InventoryDetails";
import InventoryCharts from "@/components/super-reports/ChartReport";
import { LoadingState } from "@/components/super-reports/LoadingState";
import { ErrorState } from "@/components/super-reports/ErrorState";

export default function InventoryReportComponent() {
  const [filterValues, setFilterValues] = useState<InventoryReportFilters>({
    lowStock: false,
    threshold: 5,
  });

  const [paginationValues, setPaginationValues] = useState<PaginationParams>({
    page: 1,
    limit: 10,
  });

  const {
    data,
    isLoading,
    error,
    updateFilters,
    paginationInfo,
    goToPage,
    nextPage,
    prevPage,
    refetch,
    fetchAllData,
  } = useInventoryReport({
    initialFilters: filterValues,
    initialPagination: paginationValues,
  });

  // Create a memoized version of chart data that includes all necessary properties
  const chartData = useMemo(() => {
    if (!data) return null;
    return {
      overview: data.overview,
      storesSummary: data.storesSummary,
      inventory: data.inventory, // Add this line to include the inventory
    };
  }, [data?.overview, data?.storesSummary, data?.inventory]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFilterValues((prev) => ({ ...prev, [name]: checked }));
    } else if (
      name === "storeId" ||
      name === "productId" ||
      name === "threshold"
    ) {
      const numValue = value ? parseInt(value, 10) : undefined;
      setFilterValues((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setFilterValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(filterValues);
  };

  const handleExport = async () => {
    await fetchAllData();
    // Export logic would go here
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setPaginationValues((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    goToPage(1);
  };

  return (
    <div>
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <FileBarChart className="h-6 w-6" />
          Inventory Report
        </h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1 text-sm px-3 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 text-sm px-3 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            <FileDown className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <FilterForm
        filterValues={filterValues}
        handleFilterChange={handleFilterChange}
        handleSubmit={handleSubmit}
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState error={error} />}

      {data && !isLoading && (
        <>
          <OverviewCards overview={data.overview} />

          {/* Charts Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border">
            <InventoryCharts data={chartData} />
          </div>

          <StoresSummaryTable storesSummary={data.storesSummary} />

          <InventoryDetails
            inventory={data.inventory}
            paginationInfo={paginationInfo}
            paginationValues={paginationValues}
            handlePageSizeChange={handlePageSizeChange}
            goToPage={goToPage}
            nextPage={nextPage}
            prevPage={prevPage}
          />
        </>
      )}
    </div>
  );
}
