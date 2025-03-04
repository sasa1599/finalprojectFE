"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/services/product.service";
import { Product } from "@/types/product-types";
import { formatRupiah } from "@/helper/currencyRp";
import { generateSlug } from "@/utils/slugUtils";
import { useGeolocation } from "@/components/hooks/useGeolocation";
import { sortByDistance } from "@/utils/distanceCalc";

export default function FeaturedProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<
    (Product & { distance?: number })[]
  >([]);
  const {
    location,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();

  // Fetch products on component mount
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Sort products when user location is available
  useEffect(() => {
    if (location && products.length > 0) {
      const sorted = sortByDistance(
        products,
        location.latitude,
        location.longitude,
        (product) => ({
          lat: product.store.latitude,
          lon: product.store.longitude,
        })
      );

      setSortedProducts(sorted);
    } else {
      setSortedProducts(products);
    }
  }, [location, products]);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const featuredProducts = await productService.getFeaturedProducts();
      setProducts(featuredProducts);
      setSortedProducts(featuredProducts);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (product: Product) => {
    if (!product.Discount || product.Discount.length === 0) {
      return product.price;
    }

    const discount = product.Discount[0];
    const discountType = String(discount.discount_type).toLowerCase();

    if (discountType === "percentage") {
      return Math.round(
        product.price - (product.price * discount.discount_value) / 100
      );
    } else {
      return product.price - discount.discount_value;
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-400">Loading featured products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
            Featured Products
          </h2>

          {location ? (
            <p className="text-neutral-400 mt-2">
              Showing products from stores nearest to you
            </p>
          ) : locationError ? (
            <p className="text-neutral-400 mt-2">
              Showing featured products (location services unavailable)
            </p>
          ) : locationLoading ? (
            <div className="flex items-center justify-center mt-2">
              <span className="text-neutral-400">Finding nearby stores</span>
              <span className="ml-2 flex space-x-1">
                <span className="animate-pulse h-2 w-2 bg-neutral-400 rounded-full"></span>
                <span
                  className="animate-pulse h-2 w-2 bg-neutral-400 rounded-full"
                  style={{ animationDelay: "0.2s" }}
                ></span>
                <span
                  className="animate-pulse h-2 w-2 bg-neutral-400 rounded-full"
                  style={{ animationDelay: "0.4s" }}
                ></span>
              </span>
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <Link
              href={`/products/${generateSlug(product.name)}`}
              key={product.product_id}
              className="group relative rounded-xl overflow-hidden"
            >
              {/* Glass background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />

              {/* Animated gradient border */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content container */}
              <div className="relative p-6">
                <div className="relative h-48 w-full mb-6 rounded-lg overflow-hidden">
                  {product.ProductImage?.[0]?.url && (
                    <Image
                      src={product.ProductImage[0].url}
                      alt={product.name}
                      fill
                      className="object-cover transform transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={false}
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-neutral-100 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-neutral-400">
                    {product.store.store_name}
                  </p>

                  {/* Show distance if available */}
                  {product.distance !== undefined && (
                    <p className="text-sm text-emerald-400">
                      {product.distance.toFixed(1)} km away
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {product.Discount && product.Discount.length > 0 ? (
                      <div className="flex flex-col">
                        <span className="text-sm line-through text-neutral-500">
                          {formatRupiah(product.price)}
                        </span>
                        <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                          {formatRupiah(calculateDiscountedPrice(product))}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full mt-1">
                          {String(
                            product.Discount[0].discount_type
                          ).toLowerCase() === "percentage"
                            ? `${product.Discount[0].discount_value}% OFF`
                            : `${formatRupiah(
                                product.Discount[0].discount_value
                              )} OFF`}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                        {formatRupiah(product.price)}
                      </span>
                    )}

                    <button className="relative px-4 py-2 group/button">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/80 via-purple-500/80 to-blue-500/80 rounded-lg opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                      <div className="relative px-4 py-2 bg-neutral-800 rounded-lg group-hover/button:bg-transparent transition-colors duration-300">
                        <span className="text-sm font-medium text-neutral-100">
                          View Details
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
