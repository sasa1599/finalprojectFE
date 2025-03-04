// src/types/revenueStore.types.ts

export enum OrderStatus {
  PENDING = "pending",
  AWAITING_PAYMENT = "awaiting_payment",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum ShippingStatus {
  PENDING = "pending",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

export interface User {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export interface Product {
  product_id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  orderitem_id: number;
  order_id: number;
  product_id: number;
  qty: number;
  price: number;
  total_price: number;
  product: Product;
}

export interface Order {
  order_id: number;
  user_id: number;
  store_id: number;
  order_status: OrderStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
  user: User;
  OrderItem: OrderItem[];
}

export interface OrdersResponse {
  totalOrders: number;
  totalRevenue: number;
  orders: Order[];
}

export interface MonthlyRevenue {
  month: number;
  total_revenue: number;
}

export interface YearlyRevenue {
  year: number;
  total_revenue: number;
}

export type RevenueData = MonthlyRevenue[] | YearlyRevenue[];

export interface RevenueByPeriodResponse {
  period: "monthly" | "yearly";
  year: number;
  revenue: RevenueData;
}

export interface OrdersQueryParams {
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
}

export interface RevenueQueryParams {
  period?: "monthly" | "yearly";
  year?: number;
}
