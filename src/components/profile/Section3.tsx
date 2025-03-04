import React, { useEffect, useState } from "react";
import Modal from "../product-management/Modal";
import CardOrderItems from "./CardOrderItems";
import { Order, OrderItem, OrderStatus } from "@/types/orders-types"; // Ensure OrderStatus is imported

const Section3 = () => {
  const [ordersData, setOrdersData] = useState<Order[]>([]); // State to hold orders data
  const [modalDetail, setModalDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState<OrderItem[]>([]);

  // Assuming you have another method or service to fetch orders data
  // This is a placeholder for where you would actually fetch your data
  useEffect(() => {
    // Fetch orders data from an API or other source
    // You would replace this with your actual data fetching logic
    async function fetchOrders() {
      try {
        // Simulated fetch request (replace with actual API call)
        const response = await fetch("api/orders"); // Modify with your actual API endpoint
        const data = await response.json();
        setOrdersData(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <>
      <div className="mt-10 text-center text-white">
        <h1>My Order</h1>
      </div>
      <section className="mt-5 max-w-4xl text-white py-5 mx-auto px-8 pt-8 pb-16 bg-gray-800 rounded-md">
        <div className="flex justify-between">
          <h1>Track your orders</h1>
        </div>
        <div className="flex flex-wrap mt-5 gap-3 w-full">
          {ordersData.map((order, index) => (
            <div
              key={index}
              className="box-address bg-gray-700 px-5 rounded-md py-4 w-full"
            >
              <h1>
                <i className="bi-postage-fill mr-3"></i>
                {order.order_id}
              </h1>
              <div className="flex justify-between my-2 items-end">
                <div className="w-full flex gap-3 flex-wrap">
                  <p className="text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md">
                    {order.total_price}
                  </p>
                  <p className="text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md">
                    x{order.items.length}
                  </p>
                  <p className="text-white bg-gray-600 w-auto py-1 px-4 text-sm rounded-md">
                    {OrderStatus[order.status]}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalDetail(true);
                    setDataDetail(order.items);
                  }}
                  className="button hover:bg-opacity-100 hover:text-white transition-all ease-in-out bg-blue-500 rounded-md px-3 py-2 bg-opacity-20 text-blue-600"
                >
                  <i className="bi-eye-fill"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
        <Modal
          isOpen={modalDetail}
          onClose={() => setModalDetail(false)}
          title="Order Items"
        >
          <CardOrderItems dataItems={dataDetail} />
        </Modal>
      </section>
    </>
  );
};

export default Section3;
