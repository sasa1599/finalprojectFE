// hooks/useOrders.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { orderService } from "@/services/order.service";
import { Order, OrderStatus, ApiResponse } from "@/types/orders-types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (status?: OrderStatus) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await orderService.getMyOrders(token, status);
      setOrders(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch orders";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelOrder = useCallback(
    async (orderId: number) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await orderService.cancelOrder(token, orderId);

        // Refresh orders list after cancellation
        await fetchOrders();

        toast.success("Order cancelled successfully");
        return response.data;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to cancel order";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchOrders]
  );

  const getOrderById = useCallback(
    async (orderId: number): Promise<Order | null> => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/orders/my-orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Failed to fetch order details");
        }

        const data: ApiResponse<Order> = await response.json();
        return data.data;
      } catch (err: any) {
        const errorMessage = err.message || "Failed to fetch order details";
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  // Fetch latest order - useful for the ordered page
  const fetchLatestOrder = useCallback(async (): Promise<Order | null> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Fetch all orders and sort by creation date
      const allOrders = await fetchOrders();

      if (!allOrders || allOrders.length === 0) {
        return null;
      }

      // Sort by creation date (newest first) and return the first item
      const sortedOrders = [...allOrders].sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      return sortedOrders[0];
    } catch (err) {
      return null;
    }
  }, [fetchOrders]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    cancelOrder,
    getOrderById,
    fetchLatestOrder,
  };
};
