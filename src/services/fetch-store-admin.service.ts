interface User {
  user_id: number;
  email: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: "customer" | "store_admin" | "super_admin";
  verified: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  data: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StoreAdmin {
  user_id: number;
  username: string;
}

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const storeAdminService = {
  getStoreAdmins: async (): Promise<StoreAdmin[]> => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token");
    }

    try {
      // First, make a request with a large limit to try to get all users at once
      const response = await fetch(
        `${base_url_be}/super-admin/showallusers?limit=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch store admins");
      }

      const data: ApiResponse = await response.json();
      console.log("Total users retrieved:", data.data.length);

      // If pagination exists and there are more pages
      let allUsers = [...data.data];
      let currentPage = 1;

      if (data.pagination && data.pagination.hasNextPage) {
        // Need to fetch more pages
        let hasMore = true;

        while (hasMore) {
          currentPage++;
          console.log(`Fetching page ${currentPage}...`);

          const nextResponse = await fetch(
            `${base_url_be}/super-admin/showallusers?page=${currentPage}&limit=100`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!nextResponse.ok) {
            break; // Stop if we encounter an error
          }

          const nextData: ApiResponse = await nextResponse.json();
          allUsers = [...allUsers, ...nextData.data];

          hasMore = nextData.pagination?.hasNextPage || false;
        }
      }

      console.log("All users after pagination:", allUsers.length);

      // Filter for store admins
      const storeAdmins = allUsers
        .filter((user: User) => user.role === "store_admin")
        .map((admin: User) => ({
          user_id: admin.user_id,
          username: admin.username || "Unnamed Admin",
        }));

      console.log("Total store admins found:", storeAdmins.length);
      return storeAdmins;
    } catch (error) {
      console.error("Error fetching store admins:", error);
      throw error;
    }
  },
};
