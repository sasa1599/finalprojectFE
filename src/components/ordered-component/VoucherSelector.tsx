"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  Percent,
  Tag,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Voucher } from "@/types/voucher-types";
import { voucherService } from "@/services/voucher.service";
import { formatRupiah } from "@/helper/currencyRp";

interface VoucherSelectorProps {
  selectedVoucher: Voucher | null;
  onSelectVoucher: (voucher: Voucher | null) => void;
  storeId?: number;
  orderTotal: number;
}

const VoucherSelector: React.FC<VoucherSelectorProps> = ({
  selectedVoucher,
  onSelectVoucher,
  storeId,
  orderTotal,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDialogOpen) {
      fetchVouchers();
    }
  }, [isDialogOpen]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getMyVouchers();

      // Filter vouchers: only active (not redeemed) and if storeId is provided, only those for that store
      const filteredVouchers = response.data.filter((voucher) => {
        const isActive = !voucher.is_redeemed;
        const isValidStore =
          !storeId ||
          !voucher.discount.store_id ||
          voucher.discount.store_id === storeId;

        return isActive && isValidStore;
      });

      setVouchers(filteredVouchers);
    } catch (err) {
      console.error("Failed to fetch vouchers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVoucher = (voucher: Voucher | null) => {
    onSelectVoucher(voucher);
    setIsDialogOpen(false);
  };

  const calculateDiscount = (voucher: Voucher): number => {
    if (!voucher) return 0;

    if (voucher.discount.discount_type === "percentage") {
      return Math.round((orderTotal * voucher.discount.discount_value) / 100);
    } else {
      return voucher.discount.discount_value;
    }
  };

  const isVoucherEligible = (voucher: Voucher): boolean => {
    return orderTotal >= (voucher.discount.minimum_order || 0);
  };

  return (
    <>
      <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-600 pb-4">
          <div className="flex items-center gap-3">
            <Ticket className="w-6 h-6 text-yellow-400" />
            <CardTitle className="text-xl font-semibold tracking-wide">
              Discount Voucher
            </CardTitle>
          </div>
          {selectedVoucher && (
            <Badge className="bg-green-600 text-white px-3 py-1">Applied</Badge>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {selectedVoucher ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-400" />
                  <span className="font-medium">
                    {selectedVoucher.voucher_code}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => handleSelectVoucher(null)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-300">
                  {selectedVoucher.discount.discount_type === "percentage" ? (
                    <Percent className="h-4 w-4 text-green-400" />
                  ) : (
                    <Tag className="h-4 w-4 text-green-400" />
                  )}
                  <span>
                    {selectedVoucher.discount.discount_type === "percentage"
                      ? `${selectedVoucher.discount.discount_value}% Off`
                      : `${formatRupiah(
                          selectedVoucher.discount.discount_value
                        )} Off`}
                  </span>
                </div>
                <div className="font-medium text-blue-400">
                  {formatRupiah(calculateDiscount(selectedVoucher))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>
                  Expires:{" "}
                  {voucherService.formatVoucherExpiration(
                    selectedVoucher.expires_at
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <p className="text-gray-400 text-center">
                You haven&apos;t applied any discount voucher yet
              </p>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <Ticket className="h-4 w-4 mr-2" />
                Select Voucher
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 border border-gray-700 text-white max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5 text-yellow-400" />
              Select a Voucher
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Choose a discount voucher to apply to your order
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto py-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
              </div>
            ) : vouchers.length === 0 ? (
              <div className="bg-gray-700/50 rounded-lg p-4 text-center my-4">
                <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-300">
                  You don&apos;t have any applicable vouchers
                </p>
              </div>
            ) : (
              <div className="space-y-3 px-1">
                {/* "No voucher" option */}
                <div
                  onClick={() => handleSelectVoucher(null)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedVoucher === null
                      ? "bg-blue-900/30 border border-blue-800"
                      : "bg-gray-700/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-gray-300 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      No voucher
                    </div>
                    {selectedVoucher === null && (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                </div>

                {/* Voucher options */}
                {vouchers.map((voucher) => {
                  const eligible = isVoucherEligible(voucher);
                  const isSelected =
                    selectedVoucher?.voucher_id === voucher.voucher_id;

                  return (
                    <div
                      key={voucher.voucher_id}
                      onClick={() => eligible && handleSelectVoucher(voucher)}
                      className={`p-3 rounded-lg ${
                        !eligible
                          ? "bg-gray-700/30 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "bg-blue-900/30 border border-blue-800 cursor-pointer"
                          : "bg-gray-700/50 cursor-pointer hover:bg-gray-700"
                      } transition-colors`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium text-white flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-yellow-400" />
                          {voucher.voucher_code}
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        <div className="text-blue-400 font-medium">
                          {voucher.discount.discount_type === "percentage"
                            ? `${voucher.discount.discount_value}% Off`
                            : formatRupiah(voucher.discount.discount_value)}
                        </div>
                      </div>

                      <div className="text-sm text-gray-400 mb-1">
                        {voucher.discount.store
                          ? `Valid at: ${voucher.discount.store.store_name}`
                          : "Valid at all stores"}
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <div className="text-gray-400">
                          Min. Order:{" "}
                          {formatRupiah(voucher.discount.minimum_order)}
                        </div>
                        {!eligible && (
                          <div className="text-red-400 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Order too small
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-gray-700 pt-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherSelector;
