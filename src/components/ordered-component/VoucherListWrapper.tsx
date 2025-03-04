"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoucherList } from "@/components/voucher-customer/VoucherList";
import { Voucher } from "@/types/voucher-types";
import { voucherService } from "@/services/voucher.service";
import { toast } from "react-toastify";
import { Ticket, ChevronDown, ChevronUp } from "lucide-react";

interface VoucherListWrapperProps {
  onSelectVoucher: (voucher: Voucher | null) => void;
  storeId?: number;
  minimumOrderAmount: number;
}

const VoucherListWrapper: React.FC<VoucherListWrapperProps> = ({
  onSelectVoucher,
  storeId,
  minimumOrderAmount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getMyVouchers();

      // Filter vouchers: only active (not redeemed) and if a storeId is provided, only for that store
      const filteredVouchers = response.data.filter((voucher) => {
        const isActive = !voucher.is_redeemed;
        const isValidAmount =
          voucher.discount.minimum_order <= minimumOrderAmount;
        const isValidStore =
          !storeId ||
          !voucher.discount.store_id ||
          voucher.discount.store_id === storeId;

        return isActive && isValidAmount && isValidStore;
      });

      setVouchers(filteredVouchers);
    } catch (err) {
      console.error("Failed to fetch vouchers:", err);
      toast.error("Unable to load available vouchers");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader
        className="flex flex-row items-center justify-between border-b border-gray-600 pb-4 cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-3">
          <Ticket className="w-6 h-6 text-yellow-400" />
          <CardTitle className="text-xl font-semibold tracking-wide">
            Available Vouchers
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {vouchers.length > 0 && (
            <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded-full text-xs">
              {vouchers.length} available
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-4">
          <div className="mb-3 text-gray-300 text-sm">
            <p>Select a voucher to apply to your order:</p>
          </div>

          {/* Pass storeId and minimumOrderAmount as props to control displayed vouchers */}
          <div className="max-h-[500px] overflow-y-auto pr-1">
            <VoucherSelector
              vouchers={vouchers}
              loading={loading}
              onSelectVoucher={onSelectVoucher}
              minimumOrderAmount={minimumOrderAmount}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Small helper component to display compatible vouchers
const VoucherSelector: React.FC<{
  vouchers: Voucher[];
  loading: boolean;
  onSelectVoucher: (voucher: Voucher | null) => void;
  minimumOrderAmount: number;
}> = ({ vouchers, loading, onSelectVoucher, minimumOrderAmount }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
        <p className="text-gray-400">
          No applicable vouchers available for this order
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* "No voucher" option */}
      <div
        onClick={() => onSelectVoucher(null)}
        className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors flex justify-between items-center"
      >
        <div className="text-gray-300">No voucher</div>
        <div className="text-gray-400 text-sm">No discount applied</div>
      </div>

      {/* Voucher options */}
      {vouchers.map((voucher) => (
        <div
          key={voucher.voucher_id}
          onClick={() => onSelectVoucher(voucher)}
          className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
        >
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium text-white">{voucher.voucher_code}</div>
            <div className="text-blue-400 font-medium">
              {voucher.discount.discount_type === "percentage"
                ? `${voucher.discount.discount_value}% Off`
                : `${voucher.discount.discount_value
                    .toLocaleString()
                    .replaceAll(",", ".")} Off`}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <div className="text-gray-400">
              Min. Order:{" "}
              {voucher.discount.minimum_order
                .toLocaleString()
                .replaceAll(",", ".")}
            </div>
            <div
              className={
                minimumOrderAmount >= voucher.discount.minimum_order
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {minimumOrderAmount >= voucher.discount.minimum_order
                ? "✓ Eligible"
                : "✗ Order too small"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoucherListWrapper;
