// services/inventory-report.service.ts
import {
  InventoryReportFilters,
  InventoryReportResponse,
  PaginationParams,
  NestedPaginationInfo,
} from "@/types/reports-superadmin-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL_BE ;

export class InventoryReportService {
  /**
   * Get inventory report for super admin with optional filters and pagination
   */
  static async getInventoryReport(
    filters?: InventoryReportFilters,
    pagination?: PaginationParams
  ): Promise<InventoryReportResponse> {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();

      // Add filters to query params
      if (filters?.storeId) {
        queryParams.append("storeId", filters.storeId.toString());
      }

      if (filters?.productId) {
        queryParams.append("productId", filters.productId.toString());
      }

      if (filters?.lowStock !== undefined) {
        queryParams.append("lowStock", filters.lowStock.toString());
      }

      if (filters?.threshold !== undefined) {
        queryParams.append("threshold", filters.threshold.toString());
      }

      // Add pagination params specifically for inventory
      if (pagination?.page) {
        queryParams.append("page", pagination.page.toString());
      }

      if (pagination?.limit) {
        queryParams.append("limit", pagination.limit.toString());
      }

      // Get the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      // Build the URL with query parameters
      const url = `${API_BASE_URL}/reports-superadmin/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      // Make the request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch inventory report"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching inventory report:", error);
      throw error;
    }
  }

  /**
   * Helper function to check if pagination is the nested format
   */
  private static isNestedPagination(
    pagination: any
  ): pagination is NestedPaginationInfo {
    return pagination && pagination.inventory && pagination.store;
  }

  /**
   * Get all inventory data across all pages
   */
  static async getAllInventoryReport(
    filters?: InventoryReportFilters
  ): Promise<InventoryReportResponse> {
    try {
      // Start with page 1 and a large limit
      const firstPageResponse = await this.getInventoryReport(filters, {
        page: 1,
        limit: 50,
      });

      // Check if we have the nested pagination structure
      const paginationInfo = this.isNestedPagination(
        firstPageResponse.pagination
      )
        ? firstPageResponse.pagination.inventory
        : firstPageResponse.pagination;

      // If there's only one page, return the response
      if (!paginationInfo || !paginationInfo.hasNextPage) {
        return firstPageResponse;
      }

      // Initialize with the first page data
      const allInventoryData = {
        ...firstPageResponse,
        data: {
          ...firstPageResponse.data,
          storesSummary: [...firstPageResponse.data.storesSummary],
          inventory: [...firstPageResponse.data.inventory],
          overview: {
            ...firstPageResponse.data.overview,
            // Ensure these fields exist with default values if they don't
            displayedStores:
              firstPageResponse.data.overview.displayedStores || 0,
            storesWithInventory:
              firstPageResponse.data.overview.storesWithInventory || 0,
          },
        },
      };

      // Fetch remaining pages
      let currentPage = 2;
      let hasMore = true;

      while (hasMore) {
        const nextPageResponse = await this.getInventoryReport(filters, {
          page: currentPage,
          limit: 50,
        });

        // Get the pagination info from the nested structure if present
        const nextPaginationInfo = this.isNestedPagination(
          nextPageResponse.pagination
        )
          ? nextPageResponse.pagination.inventory
          : nextPageResponse.pagination;

        // Add the data from this page to our collection
        allInventoryData.data.inventory = [
          ...allInventoryData.data.inventory,
          ...nextPageResponse.data.inventory,
        ];

        // Check if there are more pages
        hasMore = nextPaginationInfo?.hasNextPage || false;
        currentPage++;
      }

      // If we have the nested pagination structure, update it
      if (this.isNestedPagination(allInventoryData.pagination)) {
        // Update inventory pagination to indicate no more pages
        allInventoryData.pagination.inventory = {
          ...allInventoryData.pagination.inventory,
          total: allInventoryData.data.inventory.length,
          totalPages: 1,
          page: 1,
          hasNextPage: false,
          hasPrevPage: false,
        };
      }

      return allInventoryData;
    } catch (error) {
      console.error("Error fetching all inventory report data:", error);
      throw error;
    }
  }
}
