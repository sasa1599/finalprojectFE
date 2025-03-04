import { StoreData } from "@/types/store-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

class StoreServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "StoreServiceError";
  }
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface StoreApiResponse {
  status: string;
  data: StoreData[];
  pagination: PaginationInfo;
}

export const storeService = {
  async getStores(params?: PaginationParams): Promise<StoreApiResponse> {
    try {
      // Build query string with pagination parameters
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";
      const response = await fetch(`${BASE_URL}/store${queryString}`);

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to fetch stores: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to fetch stores: Network error");
    }
  },

  // Method to get all stores across all pages
  async getAllStores(): Promise<StoreData[]> {
    try {
      // Start with an empty array to collect all stores
      let allStores: StoreData[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      const pageSize = 50; // Fetch 50 stores per request

      // Keep fetching pages until there are no more
      while (hasMorePages) {
        console.log(`Fetching stores page ${currentPage}...`);

        const response = await this.getStores({
          page: currentPage,
          limit: pageSize,
        });

        // Add stores from this page to our collection
        allStores = [...allStores, ...response.data];

        // Check if there are more pages
        hasMorePages = response.pagination.hasNextPage;
        currentPage++;
      }

      console.log(`Total stores fetched: ${allStores.length}`);
      return allStores;
    } catch (error) {
      console.error("Error fetching all stores:", error);
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to fetch all stores");
    }
  },

  // Legacy method for backward compatibility
  async getStoresLegacy(): Promise<StoreData[]> {
    try {
      const response = await this.getStores();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createStore(formData: StoreData): Promise<StoreData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const storeData: StoreData = {
        store_name: formData.store_name,
        address: formData.address,
        subdistrict: formData.subdistrict,
        city: formData.city,
        province: formData.province,
        postcode: formData.postcode,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description,
        user_id: formData.user_id,
      };

      const response = await fetch(`${BASE_URL}/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to create store: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to create store: Network error");
    }
  },

  async editStore(formData: StoreData, storeId: number): Promise<StoreData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      // Only include fields that have values
      const updateData = {
        ...(formData.store_name && { store_name: formData.store_name }),
        ...(formData.address && { address: formData.address }),
        ...(formData.subdistrict && { subdistrict: formData.subdistrict }),
        ...(formData.city && { city: formData.city }),
        ...(formData.province && { province: formData.province }),
        ...(formData.postcode && { postcode: formData.postcode }),
        ...(formData.latitude !== undefined && { latitude: formData.latitude }),
        ...(formData.longitude !== undefined && {
          longitude: formData.longitude,
        }),
        ...(formData.user_id !== undefined && { user_id: formData.user_id }),
      };

      const response = await fetch(`${BASE_URL}/store/${storeId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to update store: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to update store: Network error");
    }
  },

  async deleteStore(storeId: number): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const response = await fetch(`${BASE_URL}/store/${storeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to delete store: ${response.statusText}`,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to delete store: Network error");
    }
  },
  
};
