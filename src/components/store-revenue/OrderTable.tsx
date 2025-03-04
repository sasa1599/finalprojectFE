"use client";

import React from "react";
import { OrderStatus } from "@/types/revenuestore-types";
import { formatRupiah } from "@/helper/currencyRp";

interface OrdersTableProps {
  orders: any[];
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-5 rounded-md text-center">
        <p>No orders found for the selected filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow border-b border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Order ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Total
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Items
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.order_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order.order_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.user.first_name} {order.user.last_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    order.order_status === OrderStatus.COMPLETED
                      ? "bg-green-100 text-green-800"
                      : order.order_status === OrderStatus.SHIPPED
                      ? "bg-blue-100 text-blue-800"
                      : order.order_status === OrderStatus.PROCESSING
                      ? "bg-yellow-100 text-yellow-800"
                      : order.order_status === OrderStatus.CANCELLED
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.order_status.charAt(0).toUpperCase() +
                    order.order_status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                {formatRupiah(order.total_price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                <span className="px-2 py-1 text-xs leading-4 bg-gray-100 rounded-full">
                  {order.OrderItem.length}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
