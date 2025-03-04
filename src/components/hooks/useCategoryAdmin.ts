import { Category, CategoryFormData } from "@/types/category-types";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/category`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to fetch categories");
    }
    return response.json();
  },
  async createCategory(formData: CategoryFormData): Promise<Category> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const apiFormData = new FormData();
    apiFormData.append("category_name", formData.category_name);
    apiFormData.append("description", formData.description);

    if (formData.thumbnail) {
      apiFormData.append("thumbnail", formData.thumbnail);
    }

    const response = await fetch(`${BASE_URL}/category`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Failed to create category");
    }

    return response.json();
  },
};
