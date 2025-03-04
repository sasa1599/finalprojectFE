import { Order } from "@/types/orders-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

class StoreServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "StoreServiceError";
  }
}

export const ordersCust = {
  async getOrders(): Promise<Order[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const response = await fetch(`${BASE_URL}/customer/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to fetch orders: ${response.statusText}`,
          response.status
        );
      }
      const data: Order[] = await response.json()
      return data;
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to fetch stores: Network error");
    }
  },
};
