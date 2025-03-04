import { Category, CategoryFormData,PaginatedResponse } from "@/types/category-types";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const categoryService = {
  async getCategories(page: number = 1, limit: number = 8): Promise<PaginatedResponse<Category>> {
    try {
      const response = await fetch(`${BASE_URL}/category?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  
  // If you still need the original non-paginated function
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${BASE_URL}/category?limit=999`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  },

 async createCategory(formData: FormData): Promise<Category> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${BASE_URL}/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const errorData = await response.json().catch(() => null);

  if (!response.ok) {
    // Specifically check for duplicate category error
    if (errorData?.error === "A category with this name already exists") {
      throw new Error("A category with this name already exists");
    }
    throw new Error(errorData?.error || "Failed to create category");
  }

  return errorData;
},

  async createCategoryWithImage(formData: FormData): Promise<Category> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    // Don't set Content-Type header when sending FormData
    // Browser will automatically set the correct multipart/form-data with boundary
    const response = await fetch(`${BASE_URL}/category`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Failed to create category with image"
      );
    }

    return response.json();
  },

  async updateCategory(
    id: number,
    formData: CategoryFormData
  ): Promise<Category> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to update category");
    }

    return response.json();
  },

  async updateCategoryWithImage(
    id: number,
    formData: FormData
  ): Promise<Category> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Failed to update category with image"
      );
    }

    return response.json();
  },

  async deleteCategory(id: number): Promise<void> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${BASE_URL}/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to delete category");
    }
  },
};
