"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchDiscounts } from "@/services/discount.service";
import { voucherService } from "@/services/voucher.service";
import { Discount } from "@/types/discount-types";
import { MapPin } from "lucide-react";
import { toast, Toaster } from "react-hot-toast"; // Added Toaster import

const DiscountsList: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [claimingVouchers, setClaimingVouchers] = useState<{
    [key: number]: boolean;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const page = 1;
  const limit = 8;

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const result = await fetchDiscounts(page, limit);
        if (result.success) {
          setDiscounts(result.data);
          // Console log each discount_id
          result.data.forEach((discount) => {
            console.log("Discount ID:", discount.discount_id);
          });
          // Also log the entire discount data for reference
          console.log("All discounts:", result.data);
        } else {
          setError("Failed to fetch discounts");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    loadDiscounts();
  }, [page, limit]);

  const handleClaimVoucher = async (discountId: number) => {
    try {
      // Set claiming state for this specific voucher
      setClaimingVouchers((prev) => ({ ...prev, [discountId]: true }));

      // Attempt to claim the voucher
      const result = await voucherService.claimDiscount(discountId);

      // Handle success
      if (result.success) {
        toast.success("Voucher added to your profile");
        console.log("Voucher claimed successfully:", result);
      } else {
        // This should not happen given your API design, but just in case
        toast.error(result.message || "Failed to claim voucher");
      }
    } catch (err) {
      // Handle known error cases
      if (err instanceof Error) {
        const errorMessage = err.message;

        if (errorMessage.includes("already claimed")) {
          toast.error("You've already claimed this voucher");
        } else if (errorMessage.includes("expired")) {
          toast.error("This voucher has expired");
        } else if (errorMessage.includes("Authentication required")) {
          toast.error("Please login to claim vouchers");
        } else {
          toast.error(errorMessage || "Failed to claim voucher");
        }

        console.error("Error claiming voucher:", err);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unexpected error claiming voucher:", err);
      }
    } finally {
      // Clear claiming state for this voucher
      setClaimingVouchers((prev) => ({ ...prev, [discountId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-pulse text-gray-400">Loading Discounts...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="w-full">
      {/* Add the Toaster component here */}
      <Toaster position="top-right" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {discounts.map((discount) => (
          <motion.div
            key={discount.discount_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-gray-700"
          >
            {discount.thumbnail ? (
              <img
                src={discount.thumbnail}
                alt={discount.discount_code}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  {discount.discount_type}
                </span>
                <span className="text-gray-400 text-sm">
                  Ends: {new Date(discount.expires_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {discount.discount_code}
              </h3>

              <div className="flex items-center text-gray-400 mb-3">
                <MapPin className="mr-2 w-4 h-4" />
                <span className="text-sm">
                  {discount.store?.store_name || "Unknown Store"}
                </span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="text-green-500 font-semibold">
                  {discount.discount_value}% OFF
                </div>
                <div className="text-gray-400 text-sm">
                  {discount.minimum_order
                    ? `Min. Order: Rp${discount.minimum_order.toLocaleString()}`
                    : "For: All Products In Store"}
                </div>
              </div>

              <button
                className={`w-full py-2 rounded transition-colors ${
                  claimingVouchers[discount.discount_id]
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!claimingVouchers[discount.discount_id]) {
                    handleClaimVoucher(discount.discount_id);
                  }
                }}
                disabled={claimingVouchers[discount.discount_id]}
              >
                {claimingVouchers[discount.discount_id]
                  ? "Claiming..."
                  : "Claim Voucher"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DiscountsList;
