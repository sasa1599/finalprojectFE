export interface Discount {
  discount_id: number;
  store_id: number;
  product_id: number | null;
  thumbnail: string | null;
  discount_code: string;
  discount_type: "percentage" | "point";
  discount_value: number;
  minimum_order: number;
  max_discount_amount?: number; // Added this optional property
  expires_at: string;
  product?: {
    name: string;
    category: {
      category_name: string;
    };
  } | null;
  store: {
    store_name: string;
  };
}
