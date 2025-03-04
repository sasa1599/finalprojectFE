// types/log-types.ts

// Main log entry interface
export interface LogEntry {
  id: number;
  action: string;
  module: string;
  description: string;
  timestamp: string | Date; // Accept either string or Date
}

// Define a type for update operations
export type UpdateOperation = "add" | "subtract";

// Define updates interface
export interface LogUpdates {
  operation?: UpdateOperation;
  qty?: number;
  [key: string]: unknown;
}

// Define item interface
export interface LogItem {
  id: number;
  name: string;
  store: string;
  quantity: number;
}

// Generic interface for log details without index signature
export interface LogDetailsBase {
  // For Update actions
  itemId?: number;
  updates?: LogUpdates;

  // For Delete actions
  item?: LogItem;

  // For batch Delete actions
  items?: LogItem[];

  // For Add actions
  totalAddedItems?: number;

  // For other actions
  message?: string;
}

// Extended interface with index signature
export interface LogDetails extends LogDetailsBase {
  [key: string]: unknown;
}

// Filter options for fetching logs
export interface LogFilterOptions {
  module?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
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

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}
