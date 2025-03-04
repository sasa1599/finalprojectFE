import { EditData, StoreData } from "@/types/store-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

class StoreServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "StoreServiceError";
  }
}

export const storeService = {
  async getStores(): Promise<StoreData[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");

      const response = await fetch(`${BASE_URL}/store`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new StoreServiceError(
          `Failed to fetch stores: ${response.statusText}`,
          response.status
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof StoreServiceError) throw error;
      throw new StoreServiceError("Failed to fetch stores: Network error");
    }
  },

  async createStore(formData: StoreData): Promise<StoreData> {
  function decodeToken(token: string) {
      const [header, payload] = token.split('.').slice(0, 2);
      return {
        header: JSON.parse(atob(header)),
        payload: JSON.parse(atob(payload)),
      };
    }
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new StoreServiceError("No authentication token found");
        const userId = decodeToken(token).payload.id

        const storeData: StoreData = {
          store_name: formData.store_name,
          address: formData.address,
          subdistrict: formData.subdistrict,
          city: formData.city,
          province: formData.province,
          postcode: formData.postcode,
          latitude: formData.latitude ? formData.latitude : 0,
          longitude: formData.longitude ? formData.longitude : 0,
          description: formData.description,
          user_id: userId ? userId : null
        };

        const response = await fetch(`${BASE_URL}/store`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storeData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log(errorData)
          throw new StoreServiceError(
            `Failed to create store: ${errorData.error}`,
            response.status
          );
        }

        return response.json();
      } catch (error) {
        if (error instanceof StoreServiceError) throw error;
        throw new StoreServiceError("Failed to create store: Network error");
      }
  },

  async editStore(formData: EditData, storeId: number): Promise<EditData> {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new StoreServiceError("No authentication token found");
  
      const editData: Partial<EditData> = {
        store_name: formData.store_name,
        address: formData.address,
        subdistrict: formData.subdistrict,
        city: formData.city,
        province: formData.province,
        postcode: formData.postcode,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
      };
  
      // Hanya tambahkan user_id jika benar-benar diubah
      if (formData.user_id !== undefined && formData.user_id !== null) {
        editData.user_id = formData.user_id;
      }
  
      const response = await fetch(`${BASE_URL}/store/${storeId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Error updating store:", errorData);
  
        // Jika user sudah memiliki store lain, langsung throw error yang sesuai
        if (errorData.error.includes("User already assigned to another store")) {
          throw new StoreServiceError("Store Admin already assigned to another store", response.status);
        }
  
        throw new StoreServiceError(`Failed to edit store: ${errorData.error || response.statusText}`, response.status);
      }
  
      return response.json();
    } catch (error) {
      console.error("❌ Error while editing store:", error);
  
      if (error instanceof StoreServiceError) throw error;
  
      throw new StoreServiceError("Failed to edit store: Network error");
    }
  },

  async deleteStore(storeId: number): Promise<void> {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new StoreServiceError("No authentication token found");

        const response = await fetch(`${BASE_URL}/store/${storeId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Jika responsenya bukan 204 (No Content), coba baca JSON
        let errorData;
        if (!response.ok) {
            try {
                errorData = await response.json();
            } catch {
                throw new StoreServiceError(`Failed to delete store: ${response.statusText}`, response.status);
            }
            throw new StoreServiceError(`Failed to delete store: ${errorData?.error || response.statusText}`, response.status);
        }
    } catch (error) {
        console.error("❌ Error deleting store:", error);
        if (error instanceof StoreServiceError) throw error;
        throw new StoreServiceError("Failed to delete store: Network error");
    }
}
};
