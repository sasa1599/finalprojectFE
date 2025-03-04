"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { formatRupiah } from "@/helper/currencyRp";

interface Product {
  product_id: number;
  name: string;
  price?: number;
  ProductImage?: {
    url: string;
  }[];
}

interface Discount {
  discount_id: number;
  discount_code: string;
  discount_type: "percentage" | "point";
  discount_value: number;
  product_id: number;
  product?: Product;
  minimum_order: number;
  expires_at: string;
  is_active: boolean;
}

export default function DiscountList() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/discount/store`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch discounts");
      }

      const data = await response.json();
      setDiscounts(data.data || []);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      toast.error("Failed to load discounts");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isDiscountActive = (expiresAt: string) => {
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    return now < expiryDate;
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="animate-pulse text-xl">Loading discounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Store Discounts</h2>
      </div>

      {discounts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No discounts found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applies To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {discounts.map((discount) => (
                <tr
                  key={discount.discount_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {discount.discount_code}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        discount.discount_type === "percentage"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {discount.discount_type === "percentage"
                        ? "Percentage"
                        : "Point"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {discount.discount_type === "percentage"
                      ? `${discount.discount_value}%`
                      : formatRupiah(discount.discount_value)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {discount.product_id === 0 ? (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        All Products
                      </span>
                    ) : (
                      <span className="text-sm">
                        {discount.product?.name ||
                          `Can Apply to All Product in Store`}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {discount.minimum_order > 0 ? (
                      <span className="text-sm">
                        {formatRupiah(discount.minimum_order)}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        None
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm">
                      {formatDate(discount.expires_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge
                      variant={
                        isDiscountActive(discount.expires_at)
                          ? "success"
                          : "destructive"
                      }
                    >
                      {isDiscountActive(discount.expires_at)
                        ? "Active"
                        : "Expired"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
