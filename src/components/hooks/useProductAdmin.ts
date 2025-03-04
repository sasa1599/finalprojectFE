
import { Product, ProductFormData } from "@/types/product-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${BASE_URL}/product`, {
  
    });

    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async createProduct(formData: ProductFormData): Promise<Product> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/product`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category_id: Number(formData.category_id),
        store_id: Number(formData.store_id),
        initial_quantity: formData.initial_quantity
          ? Number(formData.initial_quantity)
          : undefined,
      }),
    });

    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  async updateProduct(
    productId: number,
    formData: ProductFormData
  ): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/product/${productId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category_id: Number(formData.category_id),
      }),
    });

    if (!response.ok) throw new Error("Failed to update product");
  },

  async deleteProduct(productId: number): Promise<void> {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/product/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete product");
  },

  async uploadProductImages(productId: number, files: File[]): Promise<void> {
    const token = localStorage.getItem("token");
    const formDataImages = new FormData();

    files.forEach((file) => {
      formDataImages.append("images", file);
    });

    const response = await fetch(
      `${BASE_URL}/product-image/${productId}/images`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataImages,
      }
    );

    if (!response.ok) throw new Error("Failed to upload images");
  },
};
