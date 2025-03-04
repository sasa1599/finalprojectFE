"use client";

import React, { useRef, useState } from "react";
import { useInventoryReport } from "@/components/hooks/useStoreReports";
import { formatRupiah } from "@/helper/currencyRp";
import { StoreInventoryCharts } from "@/components/store-reports/ChartReportStore";
import { RefreshCw, FileDown, Loader2, FileText } from "lucide-react";
import { exportTableToPDF } from "@/utils/pdfEksport";

export const InventoryReport: React.FC = () => {
  const { report, loading, error, refetch } = useInventoryReport();
  const [isExportingTable, setIsExportingTable] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Error loading report
        </h3>
        <p className="text-red-500 mb-4">{error.message}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center text-gray-500">
        No report data available.
      </div>
    );
  }

  const handleExportTableToPDF = async () => {
    if (!tableRef.current || isExportingTable) return;

    setIsExportingTable(true);
    try {
      await exportTableToPDF(
        tableRef,
        `${report.store_name} - Inventory Report`,
        `inventory-table-${report.store_name
          .toLowerCase()
          .replace(/\s+/g, "-")}`
      );
    } catch (error) {
      console.error("Failed to export table to PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingTable(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {report.store_name} - Inventory Report
              </h2>
              <p className="text-sm text-blue-100">
                Report Date: {new Date(report.report_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex mt-4 sm:mt-0 gap-2">
              <button
                onClick={refetch}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded text-sm text-white transition"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-600 font-medium">
                Total Products
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {report.summary.product_count}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
              <p className="text-sm text-green-600 font-medium">Total Items</p>
              <p className="text-2xl font-bold text-green-800">
                {report.summary.total_items}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-600 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-purple-800">
                {formatRupiah(report.summary.total_value)}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            <StoreInventoryCharts report={report} />
          </div>

          {/* Inventory Table */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Detailed Inventory
            </h3>
            <button
              onClick={handleExportTableToPDF}
              disabled={isExportingTable}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExportingTable ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Exporting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" /> Export Table
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table
              ref={tableRef}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Name
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
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Value
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.inventory.map((item) => (
                  <tr key={item.product_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {item.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.current_quantity}
                      </div>
                      {item.current_quantity < 10 && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                          Low Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.total_quantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatRupiah(item.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatRupiah(item.estimated_value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(item.last_updated).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
