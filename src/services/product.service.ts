import { Product, ProductFormData, ProductResponse } from "@/types/product-types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_BE;

export const productService = {
  async getProducts(
    page: number = 1,
    limit: number = 8,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number
  ): Promise<ProductResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (categoryId !== undefined) {
        params.append("categoryId", categoryId.toString());
      }

      if (minPrice !== undefined) {
        params.append("minPrice", minPrice.toString());
      }

      if (maxPrice !== undefined) {
        params.append("maxPrice", maxPrice.toString());
      }

      const response = await fetch(`${BASE_URL}/product?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  async getFeaturedProducts(limit: number = 4): Promise<Product[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/product?featured=true&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch featured products");
      }

      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },


  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await fetch(`${BASE_URL}/product/slug/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error("Failed to fetch product");
      }

      const product: Product = await response.json();
      return product;
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error("An error occurred while fetching the product");
    }
  },

  async getProductById(productId: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/product/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },
  
  async getDiscountedProducts(
    page: number = 1,
    limit: number = 8,
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number
  ): Promise<ProductResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (categoryId !== undefined) {
        params.append("categoryId", categoryId.toString());
      }

      if (minPrice !== undefined) {
        params.append("minPrice", minPrice.toString());
      }

      if (maxPrice !== undefined) {
        params.append("maxPrice", maxPrice.toString());
      }

      const response = await fetch(`${BASE_URL}/product/discounted?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch discounted products");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching discounted products:", error);
      throw error;
    }
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