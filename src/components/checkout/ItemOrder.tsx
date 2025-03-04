import React, { useEffect, useState } from "react";
// import ProfileServices from "@/services/profile/services1";
import Services2 from "@/services/profile/services2";
import { CheckPricing } from "@/services/cek-ongkir/CekOngkirApi";
import ReactSelect from "react-select";
import { Address } from "@/types/address-types";


import { CourierOption } from "@/types/courir-types";



interface Props {
  selectedAddress: Address;
  setSelectedCourier: (courier: CourierOption | null) => void; // Tambahkan prop ini untuk mengangkat state ke parent
}

const ItemOrder: React.FC<Props> = ({ selectedAddress, setSelectedCourier }) => {
  // const { profile } = ProfileServices();
  const { load, addressData } = Services2();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [couriers, setCouriers] = useState<CourierOption[]>([]);
  const [selectedCourierValue, setSelectedCourierValue] = useState<string>("");

  const STORE_POSTCODE = 40973;

  const getCourier = async () => {
    try {
      setIsLoading(true);
      const customerPostcode = selectedAddress?.postcode
        ? parseInt(selectedAddress.postcode, 10)
        : STORE_POSTCODE;
      const response = await CheckPricing(customerPostcode, STORE_POSTCODE);

      const resCargo = response.data?.calculate_cargo || [];
      const resRegular = response.data?.calculate_reguler || [];

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

      setCouriers(formattedCouriers);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load courier options"
      );
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (addressData && selectedAddress?.postcode) getCourier();
   
  }, [addressData, selectedAddress]);

  return (
    <div className="w-full p-4 rounded shadow bg-gray-600 my-2">
      <div className="px-2">
        <label className="text-white font-bold text-lg">Courier Delivery</label>
        <ReactSelect
          className="text-black"
          placeholder="Choose Courier Delivery"
          options={couriers}
          onChange={(selectedOption) => {
            setSelectedCourierValue(selectedOption?.value || "");
            setSelectedCourier(selectedOption as CourierOption || null); // Kirim kurir yang dipilih ke parent
          }}
        />
      </div>
    </div>
  );
};

export default ItemOrder;