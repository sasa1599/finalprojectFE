"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product } from "@/types/product-types";
import { generateSlug } from "@/utils/slugUtils";
import { 
  calculateDiscountedPrice, 
  calculateDiscountPercentage, 
  hasDiscount 
} from "@/helper/discountCutPrice";
import { ShoppingCart, ExternalLink, Store, Tag } from "lucide-react";
import { addToCart } from "@/services/cart.service";
import { toast } from "react-toastify";

interface DiscountProductCardProps {
  product: Product;
  onCartUpdate?: () => void;
}

const DiscountProductCard = ({
  product,
  onCartUpdate,
}: DiscountProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Null-safe discount handling
  const discount = product.Discount?.[0] ?? {
    discount_type: 'percentage',
    discount_value: 0,
    expires_at: new Date().toISOString()
  };

  // Check if product has discount
  if (!hasDiscount(product)) {
    return null;
  }

  const inventory = product.Inventory?.[0]?.total_qty || 0;
  const image = product.ProductImage?.[0]?.url || "/product-placeholder.jpg";

  // Calculate discounted price
  const discountedPrice = calculateDiscountedPrice(product);

  // Calculate discount percentage for display
  const discountPercentage = calculateDiscountPercentage(product);

  const handleAddToCart = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const userId = localStorage.getItem("userId") || "";
      await addToCart(product.product_id, 1, userId);

      // Using toast without inline configuration - relies on global ToastContainer
      toast.success(`${product.name} added to cart!`);
      onCartUpdate?.();
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart");
    } finally {
      setIsLoading(false);
    }
  };

  // Format expiry date
  const expiryDate = new Date(discount.expires_at);
  const formattedExpiry = expiryDate.toLocaleDateString();

  return (
    <div className="group relative rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl rounded-xl border border-neutral-800/50 transition-all duration-500 group-hover:backdrop-blur-2xl" />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Discount badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="flex items-center gap-1 px-2 py-1 bg-rose-600 text-white rounded-lg shadow-lg">
          <Tag className="w-3 h-3" />
          <span className="text-xs font-bold">{discountPercentage}% OFF</span>
        </div>
      </div>

      {/* Expiry badge */}
      <div className="absolute top-3 right-3 z-20">
        <div className="px-2 py-1 bg-amber-600/80 text-white text-xs rounded-lg shadow-lg">
          Ends: {formattedExpiry}
        </div>
      </div>

      <div className="relative p-4 space-y-4">
        {/* Product image */}
        <div className="relative h-52 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-900/10 z-10" />

          {isImageLoading && (
            <div className="absolute inset-0 bg-neutral-800/50 animate-pulse rounded-lg" />
          )}

          <Image
            src={image}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        </div>

        {/* Product details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium text-neutral-100">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 group/store">
              <Store className="w-4 h-4 text-neutral-500 group-hover/store:text-neutral-300 transition-colors" />
              <p className="text-sm text-neutral-400 group-hover/store:text-neutral-300 transition-colors">
                {product.store.store_name}
              </p>
            </div>
          </div>

          {/* Price display */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium line-through text-neutral-500">
                Rp.{Math.floor(product.price).toLocaleString()}
              </span>
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                Rp.{Math.floor(discountedPrice).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full">
                  {discount.discount_type === "percentage"
                    ? `${discount.discount_value}% OFF`
                    : `Rp.${discount.discount_value.toLocaleString()} OFF`}
                </span>
              </div>
              <span className="text-sm text-neutral-400">
                Stock: {inventory}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Link
              href={`/products/${generateSlug(product.name)}`}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 flex items-center justify-center gap-2 group"
            >
              <span className="text-sm text-neutral-200">View Details</span>
              <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
            </Link>

            <button
              onClick={handleAddToCart}
              disabled={isLoading || inventory === 0}
              className="flex-1 px-4 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="text-sm text-neutral-200">
                {isLoading
                  ? "Adding..."
                  : inventory === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </span>
              <ShoppingCart className="w-4 h-4 text-neutral-400 group-hover:text-neutral-200 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountProductCard;