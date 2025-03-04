// services/user-management.service.ts
import { AuthService } from "./auth.service";
import { User, ApiUserResponse } from "@/types/user-types";

const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

export class UserManagementService {
  /**
   * Fetches all users from all pages
   * @returns Promise with all users
   */
  static async getAllUsersFromAllPages(): Promise<User[]> {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Start with an empty array to collect all users
      let allUsers: User[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      // Fetch pages until there are no more
      while (hasMorePages) {
        console.log(`Fetching users page ${currentPage}...`);

        const response = await fetch(
          `${base_url_be}/super-admin/showallusers?page=${currentPage}&limit=50`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch users page ${currentPage}`);
        }

        const apiResponse: ApiUserResponse = await response.json();

        // Add users from this page to our collection
        allUsers = [...allUsers, ...apiResponse.data];

        // Check if there are more pages to fetch
        hasMorePages = apiResponse.pagination?.hasNextPage || false;
        currentPage++;
      }

      console.log(`Total users fetched across all pages: ${allUsers.length}`);
      return allUsers;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  /**
   * Gets all users except super admins
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const allUsers = await this.getAllUsersFromAllPages();
      const filteredUsers = allUsers.filter(
        (user) => user.role !== "super_admin"
      );
      console.log(`Total non-super-admin users: ${filteredUsers.length}`);
      return filteredUsers;
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  }

  /**
   * Gets all store admins
   */
  static async getAllStoreAdmin(): Promise<User[]> {
    try {
      const allUsers = await this.getAllUsersFromAllPages();
      const storeAdmins = allUsers.filter(
        (user) => user.role === "store_admin"
      );
      console.log(`Total store admins: ${storeAdmins.length}`);
      return storeAdmins;
    } catch (error) {
      console.error("Error getting store admins:", error);
      throw error;
    }
  }

  /**
   * Gets all customers
   */
  static async getAllCustomer(): Promise<User[]> {
    try {
      const allUsers = await this.getAllUsersFromAllPages();
      const customers = allUsers.filter((user) => user.role === "customer");
      console.log(`Total customers: ${customers.length}`);
      return customers;
    } catch (error) {
      console.error("Error getting customers:", error);
      throw error;
    }
  }
}
