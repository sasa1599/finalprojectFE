"use client"

import ReactSelect from "react-select";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { formatRupiah } from "@/helper/currencyRp";
import { useOrders } from "@/components/hooks/useOrders";
import { Order, OrderStatus } from "@/types/orders-types";
import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";
import { 
  MapPin, 
  Package, 
  Truck, 
  ShoppingCart,
  CheckCircle,
  CreditCard
} from "lucide-react";
import VoucherSelector from "@/components/ordered-component/VoucherSelector";
import { Voucher } from "@/types/voucher-types";
import ItemOrder from "@/components/checkout/ItemOrder";
import AddressClient from "@/components/checkout/AddressClient";
import Services2 from "@/services/profile/services2";
import { Address } from "@/types/address-types";

// Define CourierOption type
interface CourierOption {
  shipping_name: string;
  shipping_cost: number;
  value: string;
  label: string;
  [key: string]: any;
}

// Custom styles for ReactSelect
const selectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: '0.375rem',
    boxShadow: 'none',
    backgroundColor: '#1e293b',
    borderColor: '#4b5563',
    '&:hover': {
      borderColor: '#6b7280'
    },
    color: 'white'
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af'
  }),
  input: (base: any) => ({
    ...base,
    color: 'white'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'white'
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#374151' : '#1e293b',
    color: 'white',
    '&:active': {
      backgroundColor: '#2563eb'
    }
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#1e293b',
    zIndex: 9999,
    position: 'absolute'
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999
  })
};

export default function OrderedPage() {
  const router = useRouter();
  const { load, addressData } = Services2();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (addressData && addressData.length > 0) {
      setSelectedAddress(
        addressData.find((val: Address) => val.is_primary === true) ||
          addressData[0]
      );
    }
  }, [addressData]);
  const { isLoading, fetchLatestOrder, cancelOrder } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [couriers, setCouriers] = useState<CourierOption[]>([]);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null);
  const [selectedCourierValue, setSelectedCourierValue] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  // Function to fetch shipping options
  const getCourier = async () => {
    if (!order || !order.shipping?.address) return;
    
    try {
      setIsLoadingCouriers(true);
      
      // Default store postcode
      const STORE_POSTCODE = 40973;
      
      // Extract customer postcode from shipping address
      const addressParts = order.shipping.address.split(", ");
      const postcodeCandidate = addressParts[addressParts.length - 1].trim();
      
      // Parse postcode or use default
      const customerPostcode = !isNaN(parseInt(postcodeCandidate, 10))
        ? parseInt(postcodeCandidate, 10)
        : STORE_POSTCODE;
      
      console.log("Calling CheckPricing with:", customerPostcode, STORE_POSTCODE);
      
      try {
        const response = await CheckPricing(customerPostcode, STORE_POSTCODE);
        console.log("CheckPricing response:", response);
        
        // Combine cargo and regular shipping options
        const resCargo = response.data?.calculate_cargo || [];
        const resRegular = response.data?.calculate_reguler || [];
        
        console.log("Cargo options:", resCargo);
        console.log("Regular options:", resRegular);
        
        // Format courier options for ReactSelect
        const formattedCouriers: CourierOption[] = [
          ...resCargo,
          ...resRegular,
        ].map((courier) => ({
          ...courier,
          value: courier.shipping_name,
          label: `${courier.shipping_name} - ${courier.shipping_cost
            .toLocaleString()
            .replaceAll(",", ".")}`,
        }));
        
        console.log("Formatted couriers:", formattedCouriers);
        
        if (formattedCouriers.length > 0) {
          setCouriers(formattedCouriers);
          // If we have courier options, select the first one by default
          setSelectedCourier(formattedCouriers[0]);
          setSelectedCourierValue(formattedCouriers[0].value);
        } else {
          console.warn("No courier options returned from API");
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw apiError;
      }
      
    } catch (error) {
      console.error("Error fetching courier options:", error);
      toast.error("Failed to load shipping options. Please try again later.");
    } finally {
      setIsLoadingCouriers(false);
    }
  };

  // Format date safely with fallback
  const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime())
        ? date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Recently";
    } catch {
      return "Recently";
    }
  };

  // Format status safely with fallback
  const formatStatus = (status: OrderStatus | undefined | null): string => {
    if (!status) return "PROCESSING";
    return status.replace("_", " ").toUpperCase();
  };

  // Calculate discount amount
  const calculateDiscount = (): number => {
    if (!selectedVoucher || !order) return 0;
    
    const orderTotal = order.total_price;
    
    if (selectedVoucher.discount.discount_type === "percentage") {
      return Math.round((orderTotal * selectedVoucher.discount.discount_value) / 100);
    } else {
      return selectedVoucher.discount.discount_value;
    }
  };

  // Get final price after discount
  const getFinalPrice = (): number => {
    if (!order) return 0;
    
    const subtotal = order.total_price;
    const shippingCost = selectedCourier ? selectedCourier.shipping_cost : 0;
    const discount = calculateDiscount();
    
    return subtotal + shippingCost - discount;
  };

  // Load order and courier options
  useEffect(() => {
    const getLatestOrder = async () => {
      try {
        const latestOrder = await fetchLatestOrder();

        if (latestOrder) {
          console.log("Latest order fetched:", latestOrder);
          setOrder(latestOrder);
          
          // Wait a bit for state to update before fetching couriers
          setTimeout(() => {
            getCourier();
          }, 500); // Increased timeout to ensure order state is set
        } else {
          toast.error("Could not find your order");
          router.push("/orders");
        }
      } catch (error) {
        console.error("Error fetching latest order:", error);
        toast.error("There was a problem fetching your order");
      }
    };

    getLatestOrder();
  }, [fetchLatestOrder, router]);

  const handleProceedToPayment = (orderId: number) => {
    router.push(`/payment/${orderId}`);
  };

  const handleCancelOrder = async (orderId: number) => {
    setIsCancelling(true);
    try {
      await cancelOrder(orderId);
      // Refresh the order data
      const latestOrder = await fetchLatestOrder();
      setOrder(latestOrder);
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle voucher selection
  const handleSelectVoucher = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
    
    if (voucher) {
      toast.success(`Voucher ${voucher.voucher_code} applied successfully!`);
    }
  };

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.completed:
        return "bg-green-600 text-white";
      case OrderStatus.cancelled:
        return "bg-red-600 text-white";
      case OrderStatus.shipped:
        return "bg-blue-600 text-white";
      case OrderStatus.processing:
        return "bg-purple-600 text-white";
      case OrderStatus.awaiting_payment:
        return "bg-yellow-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center pt-20">
        <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 justify-center">
            <CheckCircle className="w-7 h-7 text-blue-400" />
            Order Confirmation
          </h1>
          <div className="flex flex-col justify-center items-center h-64 text-white space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="text-gray-300">Loading your order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center pt-20">
        <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
          <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-3 justify-center">
            <CheckCircle className="w-7 h-7 text-blue-400" />
            Order Confirmation
          </h1>
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700 flex flex-col items-center justify-center space-y-6 py-12 max-w-2xl mx-auto">
            <div className="bg-gray-700/50 p-6 rounded-full">
              <Package className="w-20 h-20 text-blue-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">
                No Order Found
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn&apos;t find your recent order.
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 rounded-lg mt-4 flex items-center gap-2 text-lg"
              onClick={() => router.push("/orders")}
            >
              <ShoppingCart className="w-5 h-5" />
              View All Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Determine if order can be cancelled
  const canCancel = [
    OrderStatus.pending,
    OrderStatus.awaiting_payment,
  ].includes(order.status);

  // Calculate total items
  const totalItems = order.items
    ? order.items.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  // Get shipping data
  const shipping = order.shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-blue-400" />
          Order Confirmation
        </h1>

        <div className="mb-6 bg-green-800/20 border border-green-600 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="mr-3 bg-green-900/50 p-2 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-green-400">Thank you for your order!</p>
              <p className="text-green-300">
                Your order has been successfully placed and is now being
                processed.
              </p>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column - Order Details and Shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Courier Selection Card */}
          <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-600 pb-4">
        <div className="flex items-center gap-3">
          <Truck className="w-6 h-6 text-blue-400" />
          <CardTitle className="text-xl font-semibold tracking-wide">
            Choose Shipping Method
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
      {selectedAddress && <ItemOrder selectedAddress={selectedAddress} setSelectedCourier={setSelectedCourier} />}
        {/* {selectedCourier && (
          <div className="flex justify-between items-center mt-3 p-3 bg-blue-900/30 rounded-lg border border-blue-800">
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2 text-blue-400" />
              <span className="text-gray-200 text-sm">{selectedCourier.shipping_name}</span>
            </div>
            <span className="font-medium text-blue-400">
              {formatRupiah(selectedCourier.shipping_cost || 0)}
            </span>
          </div>
        )} */}
      </CardContent>
    </Card>

          {/* Voucher Selector */}
          <div>
            <VoucherSelector
              selectedVoucher={selectedVoucher}
              onSelectVoucher={handleSelectVoucher}
              storeId={order.store?.store_id}
              orderTotal={order.total_price}
            />
          </div>

          {/* Order Details */}
          <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-600 pb-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-purple-400" />
                <div>
                  <CardTitle className="text-xl font-semibold tracking-wide">
                    Order #{order.order_id}
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    Placed on {formatDate(order.order_date)}
                  </p>
                </div>
              </div>
              <Badge className={`${getStatusColor(order.status)} px-3 py-1 rounded-full`}>
                {formatStatus(order.status)}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="font-medium mb-3 flex items-center text-gray-300">
                <Package className="h-5 w-5 mr-2 text-blue-400" /> 
                Items in Your Order
              </h3>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="flex flex-col sm:flex-row sm:items-center border-b border-gray-600 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="h-16 w-16 relative flex-shrink-0 rounded overflow-hidden bg-gray-900 mb-3 sm:mb-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name || "Product image"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-gray-600">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="sm:ml-4 flex-grow">
                        <h4 className="font-medium text-white">
                          {item.name || "Product"}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Qty: {item.quantity || 0}
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-medium text-white">
                          {formatRupiah(item.total_price || 0)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatRupiah(item.price || 0)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No items found in this order.</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Information */}
          {shipping && (
            <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center border-b border-gray-600 pb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-teal-400" />
                  <CardTitle className="text-xl font-semibold tracking-wide">
                    Shipping Information
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Badge className="bg-blue-900 text-blue-300">
                      {shipping.status ? shipping.status.toUpperCase() : "PENDING"}
                    </Badge>
                    <span>Shipping Status</span>
                  </div>
                  <div className="flex flex-col p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-teal-400" />
                      Delivery Address
                    </span>
                    {selectedAddress ? (
  <main className="h-auto flex lg:flex-row flex-col max-w-5xl w-full justify-center mx-auto container gap-5">
    <div className="w-full">
      <AddressClient
        addressData={addressData}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
      {/* <ItemOrder selectedAddress={selectedAddress} /> */}
    </div>
    {/* <span className="text-gray-200 break-words">
      {shipping.address || "Address not available"}
    </span> */}
  </main>
) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="w-full bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 sticky top-4">
            <CardHeader className="border-b border-gray-600 pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-yellow-400" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                  <span className="text-gray-300 text-sm">Order ID</span>
                  <span className="font-medium text-white">#{order.order_id}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                  <span className="text-gray-300 text-sm">Items ({totalItems})</span>
                  <span className="font-medium text-white">
                    {formatRupiah(order.total_price || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-gray-700/50">
                  <span className="text-gray-300 text-sm">Shipping</span>
                  <span className="font-medium text-white">
                    {selectedCourier
                      ? formatRupiah(selectedCourier.shipping_cost || 0)
                      : "Select a courier"}
                  </span>
                </div>
                
                {selectedVoucher && (
                  <div className="flex justify-between items-center p-2 rounded bg-green-900/30 border border-green-800">
                    <span className="text-green-300 text-sm">Discount</span>
                    <span className="font-medium text-green-400">
                      - {formatRupiah(calculateDiscount())}
                    </span>
                  </div>
                )}
                
                <hr className="my-2 border-dashed border-gray-600" />
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/20 border border-blue-800">
                  <span className="font-bold text-white">Total</span>
                  <span className="font-bold text-blue-400">
                    {formatRupiah(getFinalPrice())}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-4 flex flex-col gap-3">
              {order.status === OrderStatus.awaiting_payment && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleProceedToPayment(order.order_id)}
                  disabled={!selectedCourier}
                >
                  <CreditCard className="h-5 w-5" />
                  {!selectedCourier 
                    ? "Please select shipping method" 
                    : "Proceed to Payment"}
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleCancelOrder(order.order_id)}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
                </Button>
              )}
              
              {/* Store Information */}
              <div className="border-t border-gray-600 pt-3 mt-2">
                <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-blue-400" />
                  Store Information
                </h3>
                <div className="text-gray-200">
                  <div className="font-medium mb-1">
                    {order.store?.store_name || "Store"}
                  </div>
                  <p className="text-xs text-gray-400">
                    {order.store?.location || "Location not available"}
                  </p>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}