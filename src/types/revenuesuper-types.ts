// types/revenue.types.ts

// Response wrapper type
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: string;
}

// Enum types (recreated without Prisma dependency)
export enum OrderStatus {
  pending = "pending",
  awaiting_payment = "awaiting_payment",
  processing = "processing",
  shipped = "shipped",
  completed = "completed",
  cancelled = "cancelled",
}

export enum ShippingStatus {
  pending = "pending",
  shipped = "shipped",
  delivered = "delivered",
}

// Order types
export interface OrderUser {
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface OrderStore {
  store_id: number;
  store_name: string;
}

export interface OrderProduct {
  product_id: number;
  name: string;
  price: number;
  description: string;
}

export interface OrderItem {
  orderitem_id: number;
  order_id: number;
  product_id: number;
  qty: number;
  price: number;
  total_price: number;
  product: OrderProduct;
}

export interface Shipping {
  shipping_id: number;
  order_id: number;
  shipping_cost: number;
  shipping_address: string;
  shipping_status: ShippingStatus;
  created_at: string;
  updated_at: string;
}

export interface Order {
  order_id: number;
  user_id: number;
  store_id: number;
  order_status: OrderStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
  user: OrderUser;
  store: OrderStore;
  OrderItem: OrderItem[];
  Shipping: Shipping[];
}

export interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Revenue types
export interface RevenueStoreData {
  revenue: number;
  orderCount: number;
}

export interface RevenuePeriodData {
  period: string;
  revenue: number;
  orderCount: number;
  stores?: {
    [storeName: string]: RevenueStoreData;
  };
}

export interface RevenueSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  startDate: string;
  endDate: string;
  period: string;
}

export interface RevenueResponse {
  revenueByPeriod: RevenuePeriodData[];
  summary: RevenueSummary;
}

// Dashboard types
export interface UserStats {
  total: number;
  new: number;
  growthRate: string;
}

export interface StoreStats {
  total: number;
}

export interface ProductStats {
  total: number;
}

export interface OrderStats {
  total: number;
}

export interface RevenueStats {
  total: number;
  recent: number;
  growthRate: string;
}

export interface TopStore {
  store_id: number;
  store_name: string | null;
  revenue: number;
}

export interface TopCategory {
  category_id: number | undefined;
  category_name: string | undefined;
  sales: number;
  units_sold: number;
}

export interface TopPerformers {
  stores: TopStore[];
  categories: TopCategory[];
}

export interface DashboardStats {
  users: UserStats;
  stores: StoreStats;
  products: ProductStats;
  orders: OrderStats;
  revenue: RevenueStats;
  topPerformers: TopPerformers;
}

// Request params types
export interface GetOrdersParams {
  page?: number;
  limit?: number;
  storeId?: number;
  status?: OrderStatus;
}

export interface GetRevenueParams {
  period?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
  storeId?: number;
}
