"use client";
import { ordersCust } from "@/components/hooks/OrdersCust";
import { Order } from "@/types/orders-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Services3 = () => {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    GetOrders();
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" | "warning",
    closeTime = 3000,
    onClose?: () => void
  ) => {
    toast.dismiss();
    toast[type](message, {
      position: "bottom-right",
      autoClose: closeTime,
      theme: "colored",
      hideProgressBar: false,
      onClose,
    });
  };

  const GetOrders = async () => {
    setLoad(true);
    try {
      const response = await ordersCust.getOrders();
      console.log(response);

      if (response && Array.isArray(response)) {
        setOrdersData(response);
      } else {
        setOrdersData([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to get orders data.", "error");
      setOrdersData([]);
    } finally {
      setLoad(false);
    }
  };

  return {
    load,
    ordersData,
    setOrdersData,
  };
};

export default Services3;
