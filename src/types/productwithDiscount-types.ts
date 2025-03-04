export interface ProductWithDiscount {
    product_id: string;
    name: string;
    price: number;
    ProductImage: { url: string }[];
    Discount?: {
      discount_id: number;
      discount_type: "point" | "percentage";
      discount_value: number;
      expires_at: string;
    }[];
  }