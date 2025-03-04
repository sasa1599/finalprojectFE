// Add this as a new file or include in your NearbyStore component
// storeDebugHelper.ts

export const storeDebugHelper = {
  /**
   * Debug store data issues without modifying existing functions
   */
  logStoreResponse(response: any, stage: string = "API Response"): void {
    console.group(`Store Debug - ${stage}`);
    console.log("Response type:", typeof response);
    console.log("Is Array:", Array.isArray(response));

    if (response && typeof response === "object") {
      console.log("Has data property:", "data" in response);
      console.log("Has status property:", "status" in response);
      console.log("Has pagination property:", "pagination" in response);

      if ("data" in response && Array.isArray(response.data)) {
        console.log("Data count:", response.data.length);
        console.log("First item sample:", response.data[0] || "No items");
      }
    }

    console.log("Full response:", response);
    console.groupEnd();
  },

  /**
   * Helper to safely extract store data from any response format
   */
  extractStores(response: any): any[] {
    // If it's already an array, return it
    if (Array.isArray(response)) {
      return response;
    }

    // If it has a data property that's an array, return that
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray(response.data)
    ) {
      return response.data;
    }

    // If we couldn't extract anything valid, return empty array
    return [];
  },

  /**
   * Validate if store has valid coordinates
   */
  hasValidCoordinates(store: any): boolean {
    if (!store) return false;

    const lat =
      typeof store.latitude === "string"
        ? parseFloat(store.latitude)
        : store.latitude;
    const lon =
      typeof store.longitude === "string"
        ? parseFloat(store.longitude)
        : store.longitude;

    return Boolean(
      lat !== undefined &&
        lat !== null &&
        !isNaN(lat) &&
        lon !== undefined &&
        lon !== null &&
        !isNaN(lon)
    );
  },
};
