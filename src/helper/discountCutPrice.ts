import { Product } from "@/types/product-types";

// Instead of extending Product, use Product directly with the Discount property
export const calculateDiscountedPrice = (product: Product): number => {
  if (!product.Discount || product.Discount.length === 0) {
    return product.price;
  }

  const discount = product.Discount[0];

  if (discount.discount_type === "percentage") {
    return product.price - (product.price * discount.discount_value / 100);
  } else {
    return product.price - discount.discount_value;
  }
};

/**
 * Calculates the discount percentage for display
 * @param product The product with discount information
 * @returns The percentage value of the discount
 */
export const calculateDiscountPercentage = (product: Product): number => {
  if (!product.Discount || product.Discount.length === 0) {
    return 0;
  }

  const discount = product.Discount[0];

  return discount.discount_type === "percentage"
    ? discount.discount_value
    : Math.round((discount.discount_value / product.price) * 100);
};

/**
 * Checks if a product has an active discount
 * @param product The product to check
 * @returns Boolean indicating if product has discount
 */
export const hasDiscount = (product: Product): boolean => {
  return !!(product.Discount && product.Discount.length > 0);
};