"use client";
import React, { useState, useEffect } from "react";
import { Discount } from "@/types/discount-types";
import { formatRupiah } from "@/helper/currencyRp";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product-types";

export const ProductDiscountCard = ({ discount }: { discount: Discount }) => {
  const [productData, setProductData] = useState<Product | null>(null);
  const [productPrice, setProductPrice] = useState<number | null>(null);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (discount.product_id) {
      fetchProductDetails();
    }
  }, [discount.product_id]);

  const fetchProductDetails = async () => {
    if (!discount.product_id) return;
    
    try {
      setLoading(true);
      const product = await productService.getProductById(discount.product_id);
      
      setProductData(product);
      
      if (product && typeof product.price === 'number') {
        setProductPrice(product.price);
        
        // Calculate the discounted price
        if (discount.discount_type === "percentage") {
          const discountAmount = (product.price * discount.discount_value) / 100;
          setDiscountedPrice(product.price - discountAmount);
        } else {
          setDiscountedPrice(product.price - discount.discount_value);
        }
      }
      
      // Get product image from the product data if available
      if (product && product.ProductImage && product.ProductImage.length > 0) {
        setProductImage(product.ProductImage[0].url);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine which image to show
  const displayImage = () => {
    // For product-specific discount, show product image if available
    if (discount.product_id) {
      // If we fetched a product image, use it
      if (productImage) {
        return (
          <img
            src={productImage}
            alt={discount.product?.name || "Product"}
            className="w-full h-full object-contain p-4"
          />
        );
      } 
      // If product has no image but discount has thumbnail, use that
      else if (discount.thumbnail) {
        return (
          <img
            src={discount.thumbnail}
            alt={discount.product?.name || "Product"}
            className="w-full h-full object-contain p-4"
          />
        );
      }
      // Loading state
      else if (loading) {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-pulse bg-gray-700 w-3/4 h-3/4 rounded"></div>
          </div>
        );
      }
      // Fallback for product with no image
      else {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-center px-4">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">No image available</p>
            </div>
          </div>
        );
      }
    } 
    // For store-wide discount, always use the discount thumbnail
    else if (discount.thumbnail) {
      return (
        <img
          src={discount.thumbnail}
          alt="Store-wide Discount"
          className="w-full h-full object-contain p-4"
        />
      );
    }
    // Fallback for discount with no thumbnail
    else {
      return (
        <div className="h-24 sm:h-28 md:h-32 bg-gradient-to-r from-purple-900 via-pink-800 to-purple-900 flex items-center justify-center">
          <div className="text-xl sm:text-2xl font-bold text-white">
            {discount.discount_type === "percentage"
              ? `${discount.discount_value}%`
              : formatRupiah(discount.discount_value)}
            <span className="ml-2">OFF</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-purple-900/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="relative w-full h-52 sm:h-56 md:h-60 lg:h-64">
        {displayImage()}
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 m-2 sm:m-3 rounded-full font-bold text-xs sm:text-sm">
          {discount.discount_type === "percentage"
            ? `${discount.discount_value}%`
            : formatRupiah(discount.discount_value)}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-100 line-clamp-2">
          {discount.product ? discount.product.name : "Store-wide Discount"}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-1">
          {discount.store.store_name}
        </p>

        {/* Price Section */}
        {productPrice !== null && discountedPrice !== null ? (
          <div className="mb-3">
            <p className="text-gray-400 line-through text-sm">
              {formatRupiah(productPrice)}
            </p>
            <p className="text-white font-bold text-lg">
              {formatRupiah(discountedPrice)}
            </p>
          </div>
        ) : loading ? (
          <div className="mb-3 h-10 animate-pulse bg-gray-700 rounded"></div>
        ) : discount.product_id ? (
          <div className="mb-3 text-gray-400 text-sm">Price unavailable</div>
        ) : (
          <div className="mb-3 text-purple-400 text-sm">Store-wide discount</div>
        )}

        <div className="space-y-1 text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-700 mt-auto">
          <p className="flex justify-between">
            <span>Code:</span>
            <span className="font-medium text-purple-400">
              {discount.discount_code}
            </span>
          </p>
          {discount.minimum_order > 0 && (
            <p className="flex justify-between">
              <span>Min Order:</span>
              <span>{formatRupiah(discount.minimum_order)}</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>Expires:</span>
            <span>{new Date(discount.expires_at).toLocaleDateString()}</span>
          </p>
        </div>

        <button className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-sm sm:text-base">
          Apply Discount
        </button>
      </div>
    </div>
  );
};