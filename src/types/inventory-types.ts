// Main Inventory interface
export interface Inventory {
  inv_id: number;
  store_id: number;
  product_id: number;
  qty: number;
  total_qty: number;
  created_at: Date;
  updated_at: Date;
  product: ProductInventory;
  store: StoreInventory;
}

// Product related interfaces
export interface ProductInventory {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  category: CategoryInventory;
}

export interface CategoryInventory {
  category_id: number;
  category_name: string;
}

// Store interface
export interface StoreInventory {
  store_name: string;
  city: string;
}

// Request interfaces
export interface CreateInventoryRequest {
  store_id: number;
  product_id: number;
  qty: number;
}

export interface UpdateInventoryRequest {
  qty: number;
  operation: 'add' | 'subtract';
}

// Pagination metadata
export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Response interfaces
export interface InventoryResponse {
  data: Inventory;
  error?: string;
}

export interface InventoryListResponse {
  data: Inventory[];
  error?: string;
}

export interface PaginatedInventoryResponse {
  data: Inventory[];
  pagination: PaginationMetadata;
  error?: string;
}

// Parameter interfaces
export interface GetInventoryParams {
  store_id?: number;
  page?: number;
}

export interface GetLowStockParams {
  store_id?: number;
  threshold?: number;
  page?: number;
}

// Error interface
export interface ApiError {
  error: string;
}
