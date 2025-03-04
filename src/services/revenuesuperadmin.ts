import {
  ApiResponse,
  OrdersResponse,
  RevenueResponse,
  DashboardStats,
  GetOrdersParams,
  GetRevenueParams,
} from "@/types/revenuesuper-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 30000) {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      return {
        status: "error",
        message: errorData.message || "An error occurred",
        error: errorData.error || response.statusText,
      };
    } catch (e) {
      return {
        status: "error",
        message: "An error occurred",
        error: response.statusText,
      };
    }
  }

  return (await response.json()) as ApiResponse<T>;
}

// Helper to add authorization header
function getAuthHeaders(): HeadersInit {
  // For client-side requests, get token from localStorage
  // For SSR, this would be handled differently (via cookies typically)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// Helper to build URL with query params
function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }

  return url.toString();
}

export const revenueService = {
  /**
   * Get all orders with optional pagination and filtering
   */
  async getAllOrders(
    params?: GetOrdersParams
  ): Promise<ApiResponse<OrdersResponse>> {
    try {
      const url = buildUrl("/revenue-superadmin/allorder", params);


      const response = await fetchWithTimeout(
        url,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
        30000 // 30 second timeout
      );

      return handleResponse<OrdersResponse>(response);
    } catch (error) {
      // Check if this was a timeout error
      if (error instanceof DOMException && error.name === "AbortError") {
        return {
          status: "error",
          message: "Request timed out. The server is taking too long to respond.",
          error: "Request timeout",
        };
      }
      

      return {
        status: "error",
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get revenue data by time period
   */
  async getRevenueByPeriod(
    params?: GetRevenueParams
  ): Promise<ApiResponse<RevenueResponse>> {
    try {
      const url = buildUrl("/revenue-superadmin/period", params);

      const response = await fetchWithTimeout(
        url,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
        30000 // 30 second timeout
      );

      return handleResponse<RevenueResponse>(response);
    } catch (error) {
      // Check if this was a timeout error
      if (error instanceof DOMException && error.name === "AbortError") {
        return {
          status: "error",
          message: "Request timed out. The server is taking too long to respond.",
          error: "Request timeout",
        };
      }
      
      return {
        status: "error",
        message: "Failed to fetch revenue data",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  /**
   * Get dashboard statistics for super admin
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const url = `${API_BASE_URL}/revenue-superadmin/dashboard`;

      const response = await fetchWithTimeout(
        url,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
        60000 // 60 second timeout for dashboard stats since this might take longer
      );

      return handleResponse<DashboardStats>(response);
    } catch (error) {
      // Check if this was a timeout error
      if (error instanceof DOMException && error.name === "AbortError") {
        return {
          status: "error",
          message: "Dashboard request timed out. The server is taking too long to respond.",
          error: "Request timeout",
        };
      }

      return {
        status: "error",
        message: "Failed to fetch dashboard statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
};
export default revenueService;


