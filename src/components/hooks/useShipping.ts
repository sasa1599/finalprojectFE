// import { useState, useEffect } from "react";
// import { Order } from "@/types/orders-types";
// import { CourierOption } from "@/types/courir-types";
// import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";
// import { formatRupiah } from "@/helper/currencyRp";

// interface ShippingResult {
//   couriers: CourierOption[];
//   selectedCourier: CourierOption | null;
//   loading: boolean;
//   handleCourierChange: (selectedOption: CourierOption) => void;
//   calculateSubtotal: () => number;
//   calculateShippingCost: () => number;
//   calculateTotal: () => number;
// }

// export function useShipping(
//   order: Order | null,
//   storePostcode: number
// ): ShippingResult {
//   const [couriers, setCouriers] = useState<CourierOption[]>([]);
//   const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(
//     null
//   );
//   const [loading, setLoading] = useState<boolean>(false);
//   const [customerPostcode, setCustomerPostcode] = useState<number | null>(null);

//   // Extract postcode from order
//   useEffect(() => {
//     if (order?.shipping?.address) {
//       const postcodeMatch = order.shipping.address.match(/\b\d{5}\b/);
//       if (postcodeMatch) {
//         setCustomerPostcode(parseInt(postcodeMatch[0], 10));
//       }
//     }
//   }, [order]);

//   // Fetch shipping options
//   useEffect(() => {
//     async function fetchCouriers() {
//       if (!customerPostcode) return;

//       try {
//         setLoading(true);
//         const response = await CheckPricing(customerPostcode, storePostcode);

//         const resCargo = response.data?.calculate_cargo || [];
//         const resRegular = response.data?.calculate_reguler || [];

//         const formattedCouriers: CourierOption[] = [
//           ...resCargo,
//           ...resRegular,
//         ].map((courier) => ({
//           ...courier,
//           value: courier.shipping_name,
//           label: `${courier.shipping_name} - ${formatRupiah(
//             courier.shipping_cost
//           )}`,
//         }));

//         setCouriers(formattedCouriers);
//         if (formattedCouriers.length > 0) {
//           setSelectedCourier(formattedCouriers[0]);
//         }
//       } catch (error) {
//         console.error("Failed to load courier options:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchCouriers();
//   }, [customerPostcode, storePostcode]);

//   const handleCourierChange = (selectedOption: CourierOption): void => {
//     setSelectedCourier(selectedOption);
//   };

//   const calculateSubtotal = (): number => {
//     if (!order) return 0;
//     return order.total_price;
//   };

//   const calculateShippingCost = (): number => {
//     return selectedCourier ? selectedCourier.shipping_cost : 0;
//   };

//   const calculateTotal = (): number => {
//     return calculateSubtotal() + calculateShippingCost();
//   };

//   return {
//     couriers,
//     selectedCourier,
//     loading,
//     handleCourierChange,
//     calculateSubtotal,
//     calculateShippingCost,
//     calculateTotal,
//   };
// }
