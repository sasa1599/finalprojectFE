import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ProceedToPaymentButton: React.FC<{ order_id: string; totalPrice: number; userId: number }> = ({
  order_id,
  totalPrice,
  userId,
}) => {
  const [loading, setLoading] = useState(false); // Handle loading state
  const router = useRouter(); // Hook untuk navigasi

  const handleProceedToPayment = async () => {
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL_BE}/payments/create`, // URL backend
        {
          order_id,
          totalPrice,
          userId,
        }
      );
  
      const data = response.data;
  
      if (data.status === "success") {
        // Redirect to Midtrans payment page
        window.location.href = data.redirect_url;
      } else {
        alert("Failed to create payment order");
      }
    } catch (error) {
      console.error("Error during payment request:", error);
      alert("An error occurred while processing the payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mt-4">
      <button
        onClick={handleProceedToPayment}
        disabled={loading}
        className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default ProceedToPaymentButton;
