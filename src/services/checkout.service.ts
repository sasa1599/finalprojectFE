import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL_BE!}`;

/**
 * Fetch all cart items
 */
export const fetchCart = async () => {
  const response = await axios.get(`${API_URL}/payments/create`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};