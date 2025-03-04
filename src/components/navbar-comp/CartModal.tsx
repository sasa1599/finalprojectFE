import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { orderService } from "@/services/order.service";
import Image from "next/image";
import {
  fetchCartId,
  updateCartItem,
  removeFromCart,
} from "@/services/cart.service";
import { formatRupiah } from "@/helper/currencyRp";
import { Product } from "@/types/product-types";
import {
  calculateDiscountedPrice,
  calculateDiscountPercentage,
  hasDiscount,
} from "@/helper/discountCutPrice";
import { CartModalProps, CartData } from "@/types/cart-types";
import ProfileServices from "@/services/profile/services1";
import { toast, ToastOptions } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductWithDiscount {
  product_id: string;
  name: string;
  price: number;
  ProductImage: { url: string }[];
  Inventory?: { total_qty: number }[];
  Discount?: {
    discount_id: number;
    discount_type: "point" | "percentage";
    discount_value: number;
    expires_at: string;
  }[];
}

const adaptProductForDiscount = (product: ProductWithDiscount): Product => {
  return {
    product_id: parseInt(product.product_id),
    store_id: 0, // Default value, adjust as needed
    name: product.name,
    description: "", // Default value
    price: product.price,
    category_id: 0, // Default value
    category: { category_id: 0, category_name: "" }, // Default value
    slug: "", // Default value
    store: {
      store_id: 0,
      store_name: "",
      latitude: 0,
      longitude: 0,
      city: "",
    },
    Discount: product.Discount?.map((discount) => ({
      discount_id: discount.discount_id,
      store_id: null,
      product_id: null,
      thumbnail: null,
      discount_code: "",
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      minimum_order: null,
      expires_at: discount.expires_at,
      created_at: "",
      updated_at: "",
      userUser_id: null,
    })),
    Inventory: product.Inventory
      ? [{ total_qty: product.Inventory[0]?.total_qty || 0 }]
      : [],
    ProductImage: product.ProductImage,
  };
};

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const { profile } = ProfileServices();
  const router = useRouter();

  const showToast = (
    message: string,
    type: keyof typeof toast,
    onClose?: () => void
  ) => {
    toast.dismiss();
    (toast[type] as (content: string, options?: ToastOptions) => void)(
      message,
      {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
        hideProgressBar: false,
        onClose,
      }
    );
  };

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await fetchCartId(profile?.userId);

      if (!response || !response.data) {
        throw new Error("Invalid cart data");
      }

      setCartData(response.data);
      setError("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load cart";

      setError(errorMessage);

      if (errorMessage.includes("login")) {
        localStorage.removeItem("token");
        router.push("/login-user-customer");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) loadCart();
  }, [isOpen]);

  const handleUpdateQuantity = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(cartItemId);
      await updateCartItem(cartItemId, newQuantity);
      await loadCart(); // Refresh cart data after update
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update quantity"
      );
      if (error instanceof Error && error.message.includes("login")) {
        localStorage.removeItem("token");
      }
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      setIsUpdating(cartItemId);
      await removeFromCart(cartItemId);
      await loadCart();
      showToast("Deleted item from cart", "success");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to remove item"
      );
    } finally {
      setIsUpdating(null);
    }
  };

  const calculateTotalPrice = (): number => {
    if (!cartData?.items || cartData.items.length === 0) return 0;

    return cartData.items.reduce((total, item) => {
      const productWithDiscount =
        item.product as unknown as ProductWithDiscount;
      const adaptedProduct = adaptProductForDiscount(productWithDiscount);
      const discountedPrice = calculateDiscountedPrice(adaptedProduct);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const calculateTotalSavings = (): number => {
    if (!cartData?.items || cartData.items.length === 0) return 0;

    return cartData.items.reduce((savings, item) => {
      const productWithDiscount =
        item.product as unknown as ProductWithDiscount;
      const adaptedProduct = adaptProductForDiscount(productWithDiscount);

      if (!hasDiscount(adaptedProduct)) {
        return savings;
      }

      const originalPrice = productWithDiscount.price;
      const discountedPrice = calculateDiscountedPrice(adaptedProduct);
      return savings + (originalPrice - discountedPrice) * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();
  const totalSavings = calculateTotalSavings();

const handleCheckout = async () => {
  try {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token || !profile?.userId) {
      showToast("Please log in to checkout", "error");
      router.push("/login-user-customer");
      return;
    }

    // Create order using the order service
    const response = await orderService.createOrderFromCart(
      token,
      profile.userId
    );

    // Show success message
    showToast(response.message || "Order created successfully!", "success");

    // Add a small delay before redirect to ensure toast is shown
    setTimeout(() => {
      router.push("/ordered");
    }, 300);
  } catch (error) {
    console.error("Checkout error:", error);

    // Improved error handling
    let errorMessage;
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      errorMessage =
        "The server returned an invalid response. Please try again.";
    } else {
      errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
    }

    showToast(errorMessage, "error");

    if (errorMessage.includes("toko yang berbeda")) {

      router.push("/products");
    }
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div
      role="dialog"
      aria-label="Shopping cart"
      className={`
        fixed inset-y-0 right-0 z-50 h-full w-96 
        bg-gradient-to-b from-neutral-950 to-neutral-900 
        shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <div className="relative h-full">
        {/* Gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-50" />

        <div className="relative h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-neutral-200" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">
                Your Cart
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-neutral-700 animate-spin"></div>
                  <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-neutral-600 animate-spin-slow"></div>
                </div>
              </div>
            ) : error ? (
              <p className="text-red-400 text-center mt-8">{error}</p>
            ) : !cartData?.items.length ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-4">
                <ShoppingCart size={48} className="opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.items.map((item) => {
                  const productWithDiscount =
                    item.product as unknown as ProductWithDiscount;
                  const adaptedProduct =
                    adaptProductForDiscount(productWithDiscount);
                  const hasDiscountFlag = hasDiscount(adaptedProduct);
                  const discountedPrice =
                    calculateDiscountedPrice(adaptedProduct);

                  return (
                    <div
                      key={item.cartitem_id}
                      className="relative group rounded-xl overflow-hidden"
                    >
                      {/* Card background */}
                      <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/30 to-neutral-900/30 backdrop-blur-xl border border-neutral-800/50" />

                      <div className="relative p-4 flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={
                              item.product.ProductImage[0]?.url ||
                              "/product-placeholder.jpg"
                            }
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-neutral-200 truncate">
                            {item.product.name}
                          </h3>

                          {/* Price with discount */}
                          <div className="mt-1">
                            {hasDiscountFlag ? (
                              <div className="flex items-center">
                                <span className="text-neutral-400 line-through mr-2">
                                  {formatRupiah(item.product.price)}
                                </span>
                                <span className="text-emerald-400">
                                  {formatRupiah(discountedPrice)}
                                </span>
                              </div>
                            ) : (
                              <p className="text-neutral-400">
                                {formatRupiah(item.product.price)}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center mt-3 gap-2">
                            <div className="flex items-center bg-neutral-800 rounded-lg">
                              <button
                                className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-50 transition-colors"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.cartitem_id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={isUpdating === item.cartitem_id}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="min-w-[2rem] text-center text-sm text-neutral-200">
                                {item.quantity}
                              </span>
                              <button
                                className="p-1.5 text-neutral-400 hover:text-neutral-200 disabled:opacity-50 transition-colors"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.cartitem_id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isUpdating === item.cartitem_id}
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              className="p-1.5 text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
                              aria-label="Remove item"
                              onClick={() => handleRemoveItem(item.cartitem_id)}
                              disabled={isUpdating === item.cartitem_id}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-auto border-t border-neutral-800 pt-4 space-y-4">
            <div className="space-y-2">
              {totalSavings > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">You Save</span>
                  <span className="text-emerald-400 font-medium">
                    {formatRupiah(totalSavings)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-purple-400 to-blue-400">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <div className="flex justify-between text-sm text-neutral-500">
                <span>Total Items</span>
                <span>{cartData?.summary.totalItems || 0} items</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!cartData?.items.length || isLoading}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative flex items-center justify-center gap-2 py-3 bg-neutral-900 rounded-lg">
                {isLoading ? (
                  <div className="h-5 w-5 border-t-2 border-b-2 border-neutral-200 rounded-full animate-spin mr-2"></div>
                ) : null}
                <span className="text-neutral-200 font-medium">
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
