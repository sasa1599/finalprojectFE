"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product-types";
import { addToCart } from "@/services/cart.service";
import { toast } from "react-toastify";
import { ShoppingCart, Store } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  onCartUpdate?: () => void;
}

const RichTextContent = ({ content }: { content: string }) => {
  return (
    <div
      className="prose prose-invert prose-neutral max-w-none [&>*]:text-white [&_ul]:text-white [&_li]:text-white"
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
};

export default function ProductDetailClient({
  product,
  onCartUpdate,
}: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Debug logger
  useEffect(() => {
    if (product.Discount && product.Discount.length > 0) {
      console.log("Discount info:", {
        type: product.Discount[0].discount_type,
        typeToString: String(product.Discount[0].discount_type),
        value: product.Discount[0].discount_value,
        isPercentage: product.Discount[0].discount_type === "percentage",
      });
    }
  }, [product]);

  const calculateDiscountedPrice = () => {
    if (!product.Discount || product.Discount.length === 0) {
      return product.price;
    }

    const discount = product.Discount[0];
    const discountType = String(discount.discount_type).toLowerCase();

    if (discountType === "percentage") {
      return Math.round(
        product.price - (product.price * discount.discount_value) / 100
      );
    } else {
      return product.price - discount.discount_value;
    }
  };

  const getDiscountLabel = () => {
    if (!product.Discount || product.Discount.length === 0) {
      return "";
    }

    const discount = product.Discount[0];
    const discountType = String(discount.discount_type).toLowerCase();

    if (discountType === "percentage") {
      return `${discount.discount_value}% OFF`;
    } else {
      return `Rp.${discount.discount_value.toLocaleString()} OFF`;
    }
  };

  const handleAddToCart = async () => {
    try {

      console.log("Adding to cart..."); // Debugging
      setIsAddingToCart(true);
      const userId = localStorage.getItem("userId") || "";
      console.log("User ID:", userId); // Debugging
      await addToCart(product.product_id, 1, userId);
      console.log("Product added successfully, showing toast..."); // Debugging
      toast.success(`${product.name} added to cart successfully`);
      onCartUpdate?.();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="relative p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Section */}
      <div className="space-y-6">
        <div className="relative aspect-square rounded-xl overflow-hidden group">
          <Image
            src={
              product.ProductImage?.[selectedImage]?.url ||
              "/product-placeholder.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "/product-placeholder.jpg";
            }}
          />
        </div>

        {/* Thumbnail Gallery */}
        {product.ProductImage && product.ProductImage.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
            {product.ProductImage.map((image, index) => (
              <button
                key={image.url}
                onClick={() => setSelectedImage(index)}
                className="relative group"
              >
                <div
                  className={`relative w-20 h-20 rounded-lg overflow-hidden transition-transform duration-300 ${
                    selectedImage === index
                      ? "ring-2 ring-purple-500 scale-105"
                      : "hover:scale-105"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400 mb-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="inline-block">
              <div className="relative px-4 py-1.5 rounded-full overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 opacity-75" />
                <span className="relative text-sm font-medium text-white">
                  {product.category.category_name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <Store className="w-4 h-4" />
              <span>{product.store.store_name}</span>
            </div>
          </div>
        </div>

        <div className="text-white text-lg leading-relaxed">
          <RichTextContent content={product.description} />
        </div>

        <div className="space-y-4 py-6 border-y border-neutral-800">
          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Price</span>
            {product.Discount && product.Discount.length > 0 ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium line-through text-neutral-500">
                  Rp.{product.price.toLocaleString()}
                </span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                  Rp.{calculateDiscountedPrice().toLocaleString()}
                </span>
                <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full mt-1">
                  {getDiscountLabel()}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                Rp.{product.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-400">Stock</span>
            <span className="text-neutral-200">
              {product.Inventory?.[0]?.total_qty || 0} units available
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={
              isAddingToCart || (product.Inventory?.[0]?.total_qty || 0) === 0
            }
            className="relative w-full group/btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover/btn:opacity-100 transition duration-300" />
            <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 rounded-lg">
              <span className="text-neutral-200 font-medium">
                {isAddingToCart
                  ? "Adding to Cart..."
                  : (product.Inventory?.[0]?.total_qty || 0) === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </span>
              {!isAddingToCart &&
                (product.Inventory?.[0]?.total_qty || 0) > 0 && (
                  <ShoppingCart className="w-5 h-5 text-neutral-300" />
                )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
