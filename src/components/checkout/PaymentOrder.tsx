import React from "react";
import { formatRupiah } from "@/helper/currencyRp";
import { CourierOption } from "@/types/courir-types";
import { ProductWithDiscount } from "@/types/calculateDiscount-types";

interface CartTotalProps {
  items: any[]; // List of cart items with quantity and product data
  couriers: CourierOption[]; // Available couriers
  selectedCourierValue: string; // Selected courier value
}


const calculateDiscountedPrice = (product: ProductWithDiscount): number => {
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

const calculateTotalPrices = (items: any[], couriers: CourierOption[], selectedCourierValue: string) => {
  if (!items || items.length === 0) return { totalOriginalPrice: 0, totalDiscountedPrice: 0 };

  const total = items.reduce(
    (totals, item) => {
      const productWithDiscount = item.product as unknown as ProductWithDiscount;
      const originalPrice = productWithDiscount.price * item.quantity;
      const discountedPrice = calculateDiscountedPrice(productWithDiscount) * item.quantity;

      return {
        totalOriginalPrice: totals.totalOriginalPrice + originalPrice,
        totalDiscountedPrice: totals.totalDiscountedPrice + discountedPrice,
      };
    },
    { totalOriginalPrice: 0, totalDiscountedPrice: 0 }
  );

  const selectedCourier = couriers.find(courier => courier.value === selectedCourierValue);
  const shippingCost = selectedCourier ? selectedCourier.shipping_cost : 0;

  const finalTotal = total.totalDiscountedPrice + shippingCost;

  return { ...total, shippingCost, finalTotal };
};

const CartTotal: React.FC<CartTotalProps> = ({ items, couriers, selectedCourierValue }) => {
  const { totalOriginalPrice, totalDiscountedPrice, shippingCost, finalTotal } = calculateTotalPrices(items, couriers, selectedCourierValue);

  return (
    <div className="mt-4 bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between text-white">
        <span>Total Initial Price:</span>
        <span className="text-red-400">{formatRupiah(totalOriginalPrice)}</span>
      </div>

      <div className="flex justify-between text-white mt-1">
        <span>Total after discount:</span>
        <span className="text-green-400">{formatRupiah(totalDiscountedPrice)}</span>
      </div>

      <div className="flex justify-between text-white mt-1">
        <span>Shipping cost:</span>
        <span className="text-blue-400">{formatRupiah(shippingCost)}</span>
      </div>

      <div className="flex justify-between text-white font-bold text-lg mt-3">
        <span>grand total:</span>
        <span className="text-yellow-400">{formatRupiah(finalTotal)}</span>
      </div>
    </div>
  );
};

export default CartTotal;
