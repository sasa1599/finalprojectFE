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

export const calculateDiscountedPrice = (product: ProductWithDiscount): number => {
    if (!product.Discount || product.Discount.length === 0) {
      return product.price;
    }
    const discount = product.Discount[0];
    if (discount.discount_type === "percentage") {
      return (
        product.price -
        Math.floor((product.price * discount.discount_value) / 100)
      );
    } else {
      return product.price - discount.discount_value;
    }
  };