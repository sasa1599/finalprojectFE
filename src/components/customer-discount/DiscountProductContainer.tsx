"use client"
import React, { useState, useEffect } from "react";
import { productService } from "@/services/product.service";
import DiscountProductCard from "@/components/customer-discount/DiscountProduct";
import { Product } from "@/types/product-types";

const DiscountProductsContainer = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDiscountedProducts();
  }, []);

  const fetchDiscountedProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getDiscountedProducts(1, 8);
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching discounted products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCartUpdate = () => {
    // This would update the cart if needed
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-gray-800 h-96 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400">
          No discounted products available
        </h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <DiscountProductCard
          key={product.product_id}
          product={product}
          onCartUpdate={handleCartUpdate}
        />
      ))}
    </div>
  );
};

export default DiscountProductsContainer;
