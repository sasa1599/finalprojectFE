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
  MapPin,
  Tag,
  Clock,
  Percent,
  ShoppingCart,
  TicketCheck,
  Info,
  Code,
  Trash2,
  TagIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Voucher } from "@/types/voucher-types";
import { voucherService } from "@/services/voucher.service";
import { toast } from "react-toastify";
import { formatRupiah } from "@/helper/currencyRp";
import { useRouter } from "next/navigation";

export const VoucherList: React.FC = () => {
  const router = useRouter();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "used">("all");
  const [deleteLoading, setDeleteLoading] = useState<Record<number, boolean>>(
    {}
  );
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getMyVouchers();
      setVouchers(response.data);
    } catch (err) {
      setError("Failed to fetch vouchers");
      toast.error("Unable to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVoucher = async (voucher: Voucher) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [voucher.voucher_id]: true }));

      const result = await voucherService.deleteVoucher(voucher.voucher_id);

      if (result.success) {
        setVouchers((prevVouchers) =>
          prevVouchers.filter((v) => v.voucher_id !== voucher.voucher_id)
        );
        toast.success("Voucher deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete voucher");
      }
    } catch (err) {
      console.error("Error deleting voucher:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete voucher"
      );
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [voucher.voucher_id]: false }));
      setVoucherToDelete(null);
    }
  };

  const navigateToDiscounts = () => {
    router.push("/deals");
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    if (filter === "all") return true;
    return filter === "active" ? !voucher.is_redeemed : voucher.is_redeemed;
  });

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-64 text-white space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <p className="text-gray-300">Loading your vouchers...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-300 p-6 rounded-lg text-center flex flex-col items-center">
        <Info className="w-12 h-12 mb-4 text-red-500" />
        <p>{error}</p>
      </div>
    );

  // Check if user has no vouchers at all
  if (vouchers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <TicketCheck className="w-7 h-7 text-blue-400" />
            My Vouchers
          </h2>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700 flex flex-col items-center justify-center space-y-6 py-12">
          <div className="bg-gray-700/50 p-6 rounded-full">
            <Tag className="w-20 h-20 text-blue-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">
              You don&apos;t have any vouchers
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Claim discount vouchers from your favorite stores and see them
              here
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-lg mt-4 flex items-center gap-2 text-lg"
            onClick={navigateToDiscounts}
          >
            <TicketCheck className="w-5 h-5" />
            Claim Here
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <TicketCheck className="w-7 h-7 text-blue-400" />
          My Vouchers
        </h2>
        <div className="bg-gray-800 rounded-full p-1 flex items-center space-x-1">
          {["all", "active", "used"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as "all" | "active" | "used")}
              className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                filter === status
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredVouchers.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400 border border-gray-700 space-y-4">
          <Tag className="mx-auto w-16 h-16 text-gray-600" />
          <p className="text-lg">No {filter} vouchers available</p>
          {filter !== "all" && (
            <Button
              variant="outline"
              className="mt-2 bg-gray-700 hover:bg-gray-600 text-white"
              onClick={() => setFilter("all")}
            >
              View All Vouchers
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredVouchers.map((voucher) => (
            <Card
              key={voucher.voucher_code}
              className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b border-gray-600 pb-4">
                <CardTitle>
                  <div className="flex items-center gap-3">
                    <Tag className="w-6 h-6 text-blue-400 group-hover:animate-pulse" />
                    <span className="text-xl font-semibold tracking-wide">
                      {voucher.voucher_code}
                    </span>
                  </div>
                </CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={voucher.is_redeemed ? "secondary" : "default"}
                        className={`${
                          voucher.is_redeemed
                            ? "bg-gray-500 text-gray-200"
                            : "bg-green-600 text-white"
                        } px-3 py-1 rounded-full cursor-help`}
                      >
                        {voucher.is_redeemed ? "Used" : "Active"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-900 text-white">
                      {voucher.is_redeemed
                        ? "This voucher has been used"
                        : "This voucher is still valid"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">
                      {voucher.discount.store
                        ? voucher.discount.store.store_name
                        : "All Tech Lite Store"}
                    </span>


                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Code className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">
                      Discount Code: {voucher.discount.discount_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span>
                      Expires:{" "}
                      {voucherService.formatVoucherExpiration(
                        voucher.expires_at
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-bold text-lg text-white">
                    {voucher.discount.discount_type === "percentage" ? (
                      <>
                        <Percent className="w-5 h-5 text-green-400" />
                        {voucher.discount.discount_value}% Off
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 text-purple-400" />
                        {formatRupiah(voucher.discount.discount_value)} Discount
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Min. Order: {formatRupiah(voucher.discount.minimum_order)}
                  </div>
                </div>
              </CardContent>
              {!voucher.is_redeemed && (
                <CardFooter className="pt-2 pb-4 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setVoucherToDelete(voucher)}
                    disabled={deleteLoading[voucher.voucher_id]}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteLoading[voucher.voucher_id]
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!voucherToDelete}
        onOpenChange={(open: boolean) => !open && setVoucherToDelete(null)}
      >
        <DialogContent className="bg-gray-800 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Voucher</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this voucher?
              <br />
              <span className="text-red-400">
                This action cannot be undone.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVoucherToDelete(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() =>
                voucherToDelete && handleDeleteVoucher(voucherToDelete)
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
