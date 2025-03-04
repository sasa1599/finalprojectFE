// types/reports-superadmin-types.ts

export interface Store {
  store_id: number;
  store_name: string;
  city: string;
  province: string;
}

export interface Category {
  category_id: number;
  category_name: string;
}

export interface Product {
  product_id: number;
  name: string;
  price: number;
  category: Category;
}

export interface InventoryItem {
  inv_id: number;
  store_id: number;
  product_id: number;
  qty: number;
  total_qty: number;
  store: Store;
  product: Product;
}

export interface StoreSummary {
  store_id: number;
  store_name: string;
  location: string;
  totalItems: number;
  totalValue: number;
  itemCount: number;
}

export interface InventoryOverview {
  totalStores: number;
  displayedStores?: number; // Number of stores on current page
  storesWithInventory?: number; // Number of stores that have inventory
  totalItems: number;
  totalValue: number;
  averageItemsPerStore: number;
}

export interface InventoryReportData {
  overview: InventoryOverview;
  storesSummary: StoreSummary[];
  inventory: {
    inventory_id: number;
    store: {
      id: number;
      name: string;
    };
    product: {
      id: number;
      name: string;
      category: string;
      price: number;
    };
    current_quantity: number;
    total_quantity: number;
    stockValue: number;
    lowStock: boolean;
  }[];
  inventoryCount?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface NestedPaginationInfo {
  store: PaginationInfo;
  inventory: PaginationInfo;
}

export interface InventoryReportResponse {
  status: string;
  message: string;
  data: InventoryReportData;
  pagination?: NestedPaginationInfo | PaginationInfo;
}

export interface InventoryReportFilters {
  storeId?: number;
  productId?: number;
  lowStock?: boolean;
  threshold?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
