
import { Address } from "@/types/address-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

class StoreServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "StoreServiceError";
  }
}

export const useAddressCustomer = {
  async getAddress(): Promise<Address[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const response = await fetch(`${BASE_URL}/customer/address`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to fetch address: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to fetch stores: Network error");
    }
  },

  async createAddress(formData: Address): Promise<Address> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/customer/address`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_name: formData.address_name,
        address: formData.address,
        subdistrict: formData.subdistrict,
        city: formData.city,
        city_id: formData.city_id,
        province: formData.province,
        province_id: formData.province_id,
        postcode: formData.postcode,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        is_primary: false,
      }),
    });

    if (!response.ok) throw new Error("Failed to create address");
    return response.json();
  },

  async updatePrimaryAddress(addressId: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${BASE_URL}/customer/address/primary/${addressId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_primary: true,
        }),
      }
    );

    const responseData = await response.json();
    if (!response.ok)
      throw new Error(responseData.error || "Failed to set primary address");
    return responseData;
  },

  async updateAddress(addressId: number, formData: Address): Promise<void> {
    console.log(formData);
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/customer/address/${addressId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address_name: formData.address_name,
        address: formData.address,
        subdistrict: formData.subdistrict,
        city: formData.city,
        city_id: formData.city_id,
        province: formData.province,
        province_id: formData.province_id,
        postcode: formData.postcode,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
      }),
    });

    const responseData = await response.json();
    if (!response.ok)
      throw new Error(responseData.error || "Failed to update address");
    return responseData;
  },

  async deleteAddress(addressId: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/customer/address/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete address");
  },
};
