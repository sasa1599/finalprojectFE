import axios from "axios";
import { getAuthUserId } from "@/helper/jwtParsing"; // Updated import path to match your folder structure

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL_BE!}`;

/**
 * Fetch all cart items
 */
export const fetchCart = async () => {
  const response = await axios.get(`${API_URL}/cart/get`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

/**
 * Fetch cart items for a specific user
 * @param userId - Optional userId (if not provided, will be extracted from token)
 */
export const fetchCartId = async (userId?: string | number) => {
  try {
    // Use userId from parameter or get it from token
    const userIdentifier = userId || getAuthUserId();

    if (!userIdentifier) {
      throw new Error("User not authenticated");
    }

    const response = await axios.get(`${API_URL}/cart/user/${userIdentifier}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      if (error.response?.status === 400)
        throw new Error(error.response?.data?.msg || "Invalid user ID");
      if (error.response?.status === 404)
        throw new Error(error.response?.data?.msg || "Cart not found");
    }
    throw new Error("Failed to fetch cart");
  }
};

/**
 * Add a product to the cart
 * @param productId - Product ID to add
 * @param quantity - Quantity to add (default: 1)
 * @param userId - Optional userId (if not provided, will be extracted from token)
 */
export const addToCart = async (
  productId: number,
  quantity: number = 1,
  userId?: string | number
) => {
  // Use userId from parameter or get it from token
  const userIdentifier = userId || getAuthUserId();

  if (!userIdentifier) {
    throw new Error("User not authenticated");
  }

  const response = await axios.post(
    `${API_URL}/cart/add`,
    {
      productId,
      userId: userIdentifier,
      quantity,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return response.data;
};

/**
 * Update quantity of a cart item
 * @param cartItemId - Cart item ID to update
 * @param quantity - New quantity
 */
export const updateCartItem = async (cartItemId: number, quantity: number) => {
  await axios.put(
    `${API_URL}/cart/updatecart`,
    {
      cartItemId,
      quantity,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

/**
 * Remove an item from the cart
 * @param cartItemId - Cart item ID to remove
 */
export const removeFromCart = async (cartItemId: number) => {
  await axios.delete(`${API_URL}/cart/remove/${cartItemId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
