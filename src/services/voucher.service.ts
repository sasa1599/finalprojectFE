import { VoucherResponse } from "@/types/voucher-types";

class VoucherService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL_BE || "";
  }

  async getMyVouchers(): Promise<VoucherResponse> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${this.baseUrl}/voucher/my-vouchers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If we get a 404, it means no vouchers found - return empty array
      if (response.status === 404) {
        return { success: true, data: [], message: "No vouchers found" };
      }

      if (!response.ok) {
        throw new Error("Failed to fetch vouchers");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      // Return empty vouchers array instead of throwing error
      return { success: false, data: [], message: "Failed to fetch vouchers" };
    }
  }

  async claimDiscount(discount_id: number): Promise<VoucherResponse> {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${this.baseUrl}/voucher/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discount_id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to claim discount");
      }

      return data;
    } catch (error) {
      console.error("Error claiming discount:", error);
      throw error;
    }
  }

  async deleteVoucher(
    voucher_id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${this.baseUrl}/voucher/${voucher_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete voucher");
      }

      return data;
    } catch (error) {
      console.error("Error deleting voucher:", error);
      throw error;
    }
  }

  async redeemVoucher(voucherId: number): Promise<void> {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${this.baseUrl}/voucher/redeem/${voucherId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to redeem voucher");
      }
    } catch (error) {
      console.error("Error redeeming voucher:", error);
      throw error;
    }
  }

  formatVoucherExpiration(expiresAt: string): string {
    return new Date(expiresAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  isVoucherValid(voucher: VoucherResponse["data"][0]): boolean {
    const now = new Date();
    const expirationDate = new Date(voucher.expires_at);
    return !voucher.is_redeemed && expirationDate > now;
  }
}

export const voucherService = new VoucherService();
