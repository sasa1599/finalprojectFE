"use client";

import { useState } from "react";
import { useInventoryReport } from "@/components/hooks/useSuperReport";
import { InventoryReportFilters } from "@/types/reports-superadmin-types";
import InventoryCharts from "@/components/super-reports/ChartReport";
import {
  FileBarChart,
  Filter,
  Package,
  Store,
  AlertTriangle,
  RefreshCw,
  FileDown,
} from "lucide-react";

export default function InventoryReportComponent() {
  const [filterValues, setFilterValues] = useState<InventoryReportFilters>({
    lowStock: false,
    threshold: 5,
  });

  // Fixed: Wrap filterValues in an object with initialFilters property
  const { data, isLoading, error, updateFilters, refetch } = useInventoryReport(
    { initialFilters: filterValues }
  );

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
      // Convert numeric inputs to numbers or undefined if empty
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
          <button className="flex items-center gap-1 text-sm px-3 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700">
            <FileDown className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border">
        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <div>
            <label
              htmlFor="storeId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store ID
            </label>
            <input
              type="number"
              id="storeId"
              name="storeId"
              value={filterValues.storeId || ""}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Filter by store ID"
            />
          </div>

          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product ID
            </label>
            <input
              type="number"
              id="productId"
              name="productId"
              value={filterValues.productId || ""}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Filter by product ID"
            />
          </div>

          <div>
            <label
              htmlFor="threshold"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Low Stock Threshold
            </label>
            <input
              type="number"
              id="threshold"
              name="threshold"
              value={filterValues.threshold || ""}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Threshold value"
            />
          </div>

          <div className="flex items-end mb-4">
            <div className="flex items-center h-10">
              <input
                type="checkbox"
                id="lowStock"
                name="lowStock"
                checked={filterValues.lowStock || false}
                onChange={handleFilterChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label
                htmlFor="lowStock"
                className="ml-2 block text-sm text-gray-700"
              >
                Show Low Stock Only
              </label>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading inventory report...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading inventory data: {error.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Overview */}
      {data && !isLoading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Total Stores
              </h3>
              <div className="flex items-center">
                <Store className="h-8 w-8 text-blue-500 mr-3" />
                <p className="text-3xl font-bold">
                  {data.overview.totalStores}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Total Items
              </h3>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-500 mr-3" />
                <p className="text-3xl font-bold">
                  {data.overview.totalItems.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Total Value
              </h3>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 mr-3">
                  Rp
                </div>
                <p className="text-3xl font-bold">
                  {data.overview.totalValue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border">
              <h3 className="text-gray-500 text-sm font-medium mb-2">
                Avg Items/Store
              </h3>
              <div className="flex items-center">
                <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mr-3">
                  Avg
                </div>
                <p className="text-3xl font-bold">
                  {data.overview.averageItemsPerStore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border">
            <InventoryCharts data={data} />
          </div>

          {/* Store Summary */}
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Store className="h-5 w-5" />
            Store Summary
          </h2>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8 border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Store
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Items
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.storesSummary.map((store) => (
                    <tr key={store.store_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {store.store_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {store.store_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.totalItems.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {store.totalValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {store.itemCount} products
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Inventory */}
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
            <Package className="h-5 w-5" />
            Detailed Inventory
          </h2>
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Store
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Current Qty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Qty
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock Value
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.inventory.map((item) => (
                    <tr key={item.inventory_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.product.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.store.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {item.product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.current_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.total_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {item.stockValue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.lowStock ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
