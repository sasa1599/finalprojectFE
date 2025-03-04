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

export interface OrderItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  total_price: number;
  image: string | null;
}

export interface OrderStore {
  store_id: number;
  store_name: string;
  location: string;
}

export interface OrderShipping {
  status: ShippingStatus;
  address: string;
  cost: number;
}

export interface Order {
  order_id: number;
  order_date: string;
  status: OrderStatus;
  total_price: number;
  total_items: number;
  created_at: number;
  store: OrderStore;
  shipping: OrderShipping | null;
  items: OrderItem[];
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}
