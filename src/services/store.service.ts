// services/store.service.ts
import { AuthService } from "./auth.service";
import { StoreData } from "@/types/storeForm-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class StoreService {
  // Create a new store
  static async createStore(storeData: StoreData): Promise<StoreData> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${BASE_URL}/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create store");
      }

      return await response.json();
    } catch (error) {
      console.error("Store creation error:", error);
      throw error;
    }
  }

}
