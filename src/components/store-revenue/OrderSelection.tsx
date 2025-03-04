"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { OrderStatus } from "@/types/revenuestore-types";
import { formatRupiah } from "@/helper/currencyRp";
import DateRangeSelector from "./DateRangeSelector";
import OrdersTable from "./OrderTable";

interface OrdersSectionProps {
  ordersData: any;
  ordersLoading: boolean;
  ordersError: string | null;
  ordersParams: {
    startDate: string;
    endDate: string;
    status?: OrderStatus;
  };
  handleDateRangeChange: (days: number) => void;
  handleStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  ordersData,
  ordersLoading,
  ordersError,
  ordersParams,
  handleDateRangeChange,
  handleStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Store Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DateRangeSelector
          startDate={ordersParams.startDate}
          endDate={ordersParams.endDate}
          handleDateRangeChange={handleDateRangeChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Status
          </label>
          <select
            value={ordersParams.status || ""}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {ordersLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : ordersError ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          <p>Error: {ordersError}</p>
        </div>
      ) : ordersData ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-700 mb-1">
                Total Orders
              </h3>
              <p className="text-2xl font-bold text-blue-900">
                {ordersData.totalOrders}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-700 mb-1">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold text-green-900">
                {formatRupiah(ordersData.totalRevenue)}
              </p>
            </div>
          </div>

          <OrdersTable orders={ordersData.orders} />
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-5 rounded-md text-center">
          <p>No orders data available</p>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
