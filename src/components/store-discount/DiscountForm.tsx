"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface Product {
  product_id: number;
  name: string;
}

interface DiscountFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  onSuccess,
  onError,
  className = "",
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [discountType, setDiscountType] = useState<"percentage" | "point">(
    "percentage"
  );
  const [applyTo, setApplyTo] = useState<"all_products" | "specific_product">(
    "all_products"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    discount_code: "",
    discount_value: "",
    minimum_order: "",
    product_id: "",
    expires_at: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL_BE}/product/store`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        if (onError)
          onError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [onError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    if (!formData.discount_code) {
      setError("Discount code is required");
      return false;
    }
    if (!formData.discount_value) {
      setError("Discount value is required");
      return false;
    }
    if (applyTo === "specific_product" && !formData.product_id) {
      setError("Please select a product");
      return false;
    }
    if (!formData.expires_at) {
      setError("Expiration date is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formDataObj = new FormData();
      formDataObj.append("discount_code", formData.discount_code);
      formDataObj.append("discount_type", discountType);
      formDataObj.append("discount_value", formData.discount_value);

      // Only append minimum_order if not specific product
      if (applyTo !== "specific_product" || !formData.minimum_order) {
        formDataObj.append("minimum_order", formData.minimum_order || "0");
      }

      formDataObj.append(
        "product_id",
        applyTo === "all_products" ? "0" : formData.product_id
      );
      formDataObj.append("expires_at", formData.expires_at);

      // Add the file if selected
      if (fileInputRef.current?.files?.[0]) {
        formDataObj.append("thumbnail", fileInputRef.current.files[0]);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/discount/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataObj,
        }
      );

      const result = await response.json();

      if (result.success) {
        setFormData({
          discount_code: "",
          discount_value: "",
          minimum_order: "",
          product_id: "",
          expires_at: "",
        });
        setApplyTo("all_products");
        setDiscountType("percentage");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess();
      } else {
        const errorMessage = result.message || "Failed to create discount";
        setError(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (error) {
      console.error("Error creating discount:", error);
      const errorMessage = "Failed to create discount";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full max-w-md mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg ${className}`}
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
        Create Discount
      </h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative mb-3 sm:mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
            Discount Code
          </label>
          <Input
            name="discount_code"
            value={formData.discount_code}
            onChange={handleInputChange}
            placeholder="Enter unique discount code"
            className="text-sm sm:text-base"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
              Discount Type
            </label>
            <Select
              value={discountType}
              onValueChange={(value: "percentage" | "point") =>
                setDiscountType(value)
              }
            >
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-200">
                <SelectItem
                  value="percentage"
                  className="py-1 sm:py-2 px-2 cursor-pointer hover:bg-slate-300 text-sm sm:text-base"
                >
                  Percentage
                </SelectItem>
                <SelectItem
                  value="point"
                  className="py-1 sm:py-2 px-2 cursor-pointer hover:bg-slate-300 text-sm sm:text-base"
                >
                  Point
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
              Apply Discount To
            </label>
            <Select
              value={applyTo}
              onValueChange={(value: "all_products" | "specific_product") =>
                setApplyTo(value)
              }
            >
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue placeholder="Select application" />
              </SelectTrigger>
              <SelectContent className="bg-slate-200">
                <SelectItem
                  value="all_products"
                  className="py-1 sm:py-2 px-2 cursor-pointer hover:bg-slate-300 text-sm sm:text-base"
                >
                  All Products
                </SelectItem>
                <SelectItem
                  value="specific_product"
                  className="py-1 sm:py-2 px-2 cursor-pointer hover:bg-slate-300 text-sm sm:text-base"
                >
                  Specific Product
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {applyTo === "specific_product" && (
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
              Select Product
            </label>
            <Select
              value={formData.product_id}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  product_id: value,
                }))
              }
            >
              <SelectTrigger className="w-full text-sm sm:text-base">
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select Product"}
                />
              </SelectTrigger>
              <SelectContent className="bg-slate-200">
                {isLoading ? (
                  <div className="p-2 text-center text-sm sm:text-base">
                    Loading products...
                  </div>
                ) : (
                  products.map((product) => (
                    <SelectItem
                      key={product.product_id}
                      value={String(product.product_id)}
                      className="py-1 sm:py-2 px-2 cursor-pointer hover:bg-slate-300 text-sm sm:text-base"
                    >
                      {product.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
              Discount Value
            </label>
            <Input
              name="discount_value"
              value={formData.discount_value}
              onChange={handleInputChange}
              placeholder={
                discountType === "percentage"
                  ? "Enter % discount"
                  : "Enter point discount"
              }
              type="number"
              className="text-sm sm:text-base"
              required
            />
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
              Minimum Order
            </label>
            <Input
              name="minimum_order"
              value={formData.minimum_order}
              onChange={handleInputChange}
              placeholder="Minimum order amount"
              type="number"
              className="text-sm sm:text-base"
              disabled={applyTo === "specific_product"}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
            Expiration Date
          </label>
          <Input
            name="expires_at"
            value={formData.expires_at}
            onChange={handleInputChange}
            type="date"
            className="text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block mb-1 sm:mb-2 text-sm sm:text-base">
            Discount Image
          </label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="text-sm sm:text-base"
          />
          {imagePreview && (
            <div className="mt-2">
              <div className="relative w-full h-40 overflow-hidden rounded-md">
                <Image
                  src={imagePreview}
                  alt="Discount image preview"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-4 text-sm sm:text-base py-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Discount"}
        </Button>
      </form>
    </div>
  );
};

export default DiscountForm;
