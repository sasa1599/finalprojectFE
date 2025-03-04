import { useState, useEffect, useCallback } from "react";

interface User {
  user_id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: "customer" | "store_admin" | "super_admin"; 
  verified: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function useFetchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const base_url_be = process.env.NEXT_PUBLIC_BASE_URL_BE;

  const fetchUsers = useCallback(async (page = 1, limit = 10) => {
    setIsFetching(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated.");
      }

      const response = await fetch(
        `${base_url_be}/super-admin/showallusers?page=${page}&limit=${limit}`, 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const jsonResponse = await response.json();

      // Process the response data
      if (jsonResponse.status === "success") {
        // Ensure we have data
        if (Array.isArray(jsonResponse.data)) {
          const filteredUsers = jsonResponse.data.filter(
            (user: User) => user.role !== "super_admin"
          );
          setUsers(filteredUsers);
        } else {
          throw new Error("Data is not in the expected format.");
        }
        
        // Set pagination data if available
        if (jsonResponse.pagination) {
          setPagination(jsonResponse.pagination);
        }
      } else {
        throw new Error("Failed to fetch users.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsFetching(false);
    }
  }, [base_url_be]);

  const goToPage = (page: number) => {
    fetchUsers(page, pagination.limit);
  };

  const changePageSize = (newLimit: number) => {
    fetchUsers(1, newLimit);
  };

  const deleteUser = async (userId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User is not authenticated.");
      return;
    }

    try {
      const response = await fetch(
        `${base_url_be}/super-admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      const jsonResponse = await response.json();

      if (jsonResponse.status === "success") {
        // After deletion, refresh the current page
        fetchUsers(pagination.page, pagination.limit);
      } else {
        throw new Error(jsonResponse.message || "Failed to delete user.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    }
  };

  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit);
  }, [fetchUsers]);

  return { 
    users, 
    error, 
    isFetching, 
    pagination,
    fetchUsers, 
    goToPage,
    changePageSize,
    deleteUser 
  };
}