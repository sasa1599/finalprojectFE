export interface Store {
  store_id: number;
  store_name: string;
  address: string;
  subdistrict: string;
  city: string;
  province: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

export interface Discount {
  discount_id: number;
  store_id: number;
  product_id?: number | null;
  thumbnail: string;
  discount_code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
  store: Store;
}

export interface Voucher {
  voucher_id: number;
  voucher_code: string;
  user_id: number;
  discount_id: number;
  is_redeemed: boolean;
  redeemed_at: string | null;
  created_at: string;
  expires_at: string;
  discount: Discount;
}

export interface VoucherResponse {
  success: boolean;
  message: string;
  data: Voucher[];
}
