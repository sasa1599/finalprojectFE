"use client";
import AddressClient from "@/components/checkout/AddressClient";
import ItemOrder from "@/components/checkout/ItemOrder";
import ProceedToPaymentButton from "@/components/checkout/payment";
import PaymentOrder from "@/components/checkout/PaymentOrder";
import ToastContainerElement from "@/components/ToastContainerElement";
import Services2 from "@/services/profile/services2";
import { Address } from "@/types/address-types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login-user-customer");
    }
  }, [router]);

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

  return (
    <div className="w-full bg-gray-900 py-20">
      <div className="container mx-auto">
        <div className="mx-auto container flex items-center max-w-5xl">
          <h1 className="text-white text-left font-bold text-2xl w-full mt-4">
            Checkout
          </h1>
        </div>
        {selectedAddress ? (
          <main className="h-auto flex lg:flex-row flex-col max-w-5xl w-full justify-center mx-auto container gap-5">
            <div className="w-full">
              <AddressClient
                addressData={addressData}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
              {/* <ItemOrder selectedAddress={selectedAddress } /> */}
            </div>
            <div className="lg:w-1/3 w-full">
              <ProceedToPaymentButton order_id={""} totalPrice={0} userId={0}  />
            </div>
          </main>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-neutral-700 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-t-2 border-b-2 border-neutral-600 animate-spin-slow"></div>
            </div>
          </div>
        )}
        <ToastContainerElement />
      </div>
    </div>
  );
};

export default CheckoutPage;
