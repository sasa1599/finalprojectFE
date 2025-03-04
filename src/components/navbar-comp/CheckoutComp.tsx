// components/navbar-comp/CheckoutComp.tsx
import { useState } from "react";
import axios from "axios";

const CheckoutComp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login to proceed");

      // Prepare order data from cart
      const orderData = {
        user_id: 1, // Replace with actual user ID
        products: [], // Map your cart data here
        address_id: 1, // Replace with selected address ID
      };

      const response = await axios.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { order_id } = response.data.data;

      // Step 2: Generate Snap Token for payment
      const paymentResponse = await axios.post("/api/payments/snap-token", {
        order_id, // Send the created order ID
      });

      const { redirect_url } = paymentResponse.data;

      window.location.href = redirect_url; // Redirect to Midtrans for payment
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleCheckout}
        className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </button>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default CheckoutComp;
