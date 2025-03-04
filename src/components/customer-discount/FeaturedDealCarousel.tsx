"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { formatRupiah } from "@/helper/currencyRp";
import { Discount } from "@/types/discount-types";
import { fetchDiscounts } from "@/services/discount.service";

export default function FeaturedDiscountCarousel() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDiscounts(1, 5);

      if (data.success) {
        setDiscounts(data.data);
      } else {
        throw new Error("Failed to fetch discounts");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isHovering && discounts.length > 0) {
      interval = setInterval(() => {
        setActiveIndex((current) =>
          current === discounts.length - 1 ? 0 : current + 1
        );
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isHovering, discounts.length]);
  const getTimeRemaining = (expires: Date) => {
    const now = new Date();
    const diff = new Date(expires).getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="mb-10 relative overflow-hidden rounded-xl shadow-xl max-w-5xl mx-auto h-64 sm:h-80 bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading featured deals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-10 relative overflow-hidden rounded-xl shadow-xl max-w-5xl mx-auto h-64 sm:h-80 bg-gray-800 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="mb-10 relative overflow-hidden rounded-xl shadow-xl max-w-5xl mx-auto h-64 sm:h-80 bg-gray-800 flex items-center justify-center">
        <div className="text-gray-400">No featured deals available</div>
      </div>
    );
  }
  const getBackgroundColor = (index: number) => {
    const colors = [
      "from-blue-600 to-purple-600",
      "from-pink-600 to-orange-500",
      "from-green-500 to-teal-500",
      "from-purple-600 to-pink-600",
      "from-indigo-600 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div
      className="mb-10 relative overflow-hidden rounded-xl shadow-xl max-w-5xl mx-auto"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {discounts.map((discount, index) => (
          <div
            key={discount.discount_id}
            className={`w-full flex-shrink-0 h-64 sm:h-80 bg-gradient-to-r ${getBackgroundColor(
              index
            )} relative`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {discount.thumbnail ? (
                <Image
                  src={discount.thumbnail}
                  alt={discount.product?.name || "Discount"}
                  fill
                  style={{ objectFit: "cover", opacity: 0.6 }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1200px"
                  priority
                />
              ) : null}

              <div className="absolute inset-0 bg-black bg-opacity-20" />

              <div className="relative z-10 text-white px-6 sm:px-10 py-6 sm:py-8 flex flex-col h-full justify-between w-full">
                <div>
                  <p className="text-sm sm:text-base font-medium opacity-90">
                    {discount.store?.store_name || "Featured Store"}
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-bold mb-2 mt-1">
                    {discount.product?.name || "Special Discount"}
                  </h2>
                  <div className="inline-block bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-lg sm:text-xl mt-2">
                    {discount.discount_type === "percentage"
                      ? `${discount.discount_value}% OFF`
                      : `${formatRupiah(discount.discount_value)} OFF`}
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <button className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-medium transition-colors">
                    Shop Now
                  </button>
                  <div className="text-sm sm:text-base">
                    <span className="opacity-80">Ends in:</span>{" "}
                    <span className="font-bold">
                      {getTimeRemaining(new Date(discount.expires_at))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {discounts.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Left/Right arrows */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        onClick={() =>
          setActiveIndex((prev) =>
            prev === 0 ? discounts.length - 1 : prev - 1
          )
        }
      >
        <span className="sr-only">Previous</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        onClick={() =>
          setActiveIndex((prev) =>
            prev === discounts.length - 1 ? 0 : prev + 1
          )
        }
      >
        <span className="sr-only">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
