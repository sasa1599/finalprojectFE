// src/types/report.types.ts

export interface InventoryItem {
    product_id: number;
    product_name: string;
    category: string;
    current_quantity: number;
    total_quantity: number;
    price: number;
    estimated_value: number;
    last_updated: string;
  }
  
  export interface InventorySummary {
    total_items: number;
    total_value: number;
    product_count: number;
  }
  
  export interface InventoryReport {
    store_name: string;
    store_id: number;
    report_date: string;
    summary: InventorySummary;
    inventory: InventoryItem[];
  }
  
  export interface InventoryReportResponse {
    status: string;
    data: InventoryReport;
  }
  
  export interface ApiError {
    status: string;
    message: string;
    error?: string;
  }