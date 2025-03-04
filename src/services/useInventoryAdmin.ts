import { CreateInventoryRequest, GetInventoryParams, GetLowStockParams, Inventory, UpdateInventoryRequest } from "@/types/inventory-types";

// Define pagination interfaces
export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class InventoryService {
  static async createInventory(formData: CreateInventoryRequest): Promise<Inventory> {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create inventory');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async getInventory(params?: GetInventoryParams): Promise<PaginatedResponse<Inventory>> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }
      if (params?.store_id) {
        queryParams.append('store_id', params.store_id.toString());
      }
      
      const response = await fetch(`${BASE_URL}/inventory?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
  
      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // Legacy method for backward compatibility
  static async getAllInventory(): Promise<Inventory[]> {
    try {
      const response = await this.getInventory();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getInventoryById(invId: number): Promise<Inventory> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/inventory/${invId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async updateInventory(invId: number, data: UpdateInventoryRequest): Promise<Inventory> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const response = await fetch(`${BASE_URL}/inventory/${invId}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update inventory');
      }
  
      return response.json();
    } catch (error) {
      console.error('Update inventory error:', error);
      throw error;
    }
  }

  static async deleteInventory(invId: number): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/inventory/${invId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete inventory');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  static async getLowStockProducts(params?: GetLowStockParams): Promise<PaginatedResponse<Inventory>> {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (params?.store_id) {
        queryParams.append('store_id', params.store_id.toString());
      }
      if (params?.threshold) {
        queryParams.append('threshold', params.threshold.toString());
      }
      if (params?.page) {
        queryParams.append('page', params.page.toString());
      }

      const response = await fetch(`${BASE_URL}/inventory/low-stock?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch low stock products');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  }

  // Legacy method for backward compatibility
  static async getAllLowStockProducts(params?: Omit<GetLowStockParams, 'page'>): Promise<Inventory[]> {
    try {
      const response = await this.getLowStockProducts(params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}