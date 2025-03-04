"use client";
import { useAddressCustomer } from "@/components/hooks/useAddressCustomer";
import {
  Address,
  AddressFormData,
  convertFormDataToAddress,
} from "@/types/address-types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warning";

interface AddressListResponse {
  data: Address[];
  status?: string;
  message?: string;
}

interface AddressResponse {
  status: string;
  message: string;
  data?: Address;
}

interface DeleteAddressResponse {
  ok: boolean;
  status?: string;
  message?: string;
}

const Services2 = () => {
  const [addressData, setAddressData] = useState<Address[]>([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    GetAddress();
  }, []);

  const showToast = (
    message: string,
    type: ToastType,
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

  const GetAddress = async () => {
    setLoad(true);
    try {
      const rawResponse = await useAddressCustomer.getAddress();
      if (
        rawResponse &&
        typeof rawResponse === "object" &&
        "data" in rawResponse
      ) {
        const response = rawResponse as unknown as AddressListResponse;
        setAddressData(response.data);
      } else {
        // If the response is directly an array of addresses
        setAddressData(rawResponse as unknown as Address[]);
      }
    } catch (error) {
      showToast("Failed to get user addresses.", "error");
    } finally {
      setLoad(false);
    }
  };

  const addAddress = async (values: {
    address_name: string;
    address: string;
    postcode: string;
    latitude: string;
    longitude: string;
    subdistrict: string;
    city: string;
    city_id: string;
    province: string;
    province_id: string;
  }) => {
    try {
      const formData: AddressFormData = {
        address_name: values.address_name,
        address: values.address,
        postcode: values.postcode,
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
        subdistrict: values.subdistrict,
        city: values.city,
        city_id: values.city_id,
        province: values.province,
        province_id: values.province_id,
      };

      const rawResponse = await useAddressCustomer.createAddress(
        convertFormDataToAddress(formData)
      );
      const response = rawResponse as unknown as AddressResponse;

      if (response && response.status === "success") {
        showToast(response.message, "success", 3000, () =>
          window.location.reload()
        );
      } else {
        showToast("Failed to create address.", "error");
      }
    } catch (error) {
      showToast("Failed to create new address.", "error");
    }
  };

  const setPrimaryAddressEdit = async (address_id: number) => {
    try {
      const rawResponse = await useAddressCustomer.updatePrimaryAddress(
        address_id
      );
      const response = rawResponse as unknown as AddressResponse;

      if (response && response.status === "success") {
        showToast(response.message, "success", 3000, () =>
          window.location.reload()
        );
      } else {
        showToast("Failed to set primary address.", "error");
      }
    } catch (error) {
      showToast(`Failed to set primary address: ${error}`, "error");
    }
  };

  const editAddress = async (address_id: number, formData: Address) => {
    try {
      const rawResponse = await useAddressCustomer.updateAddress(
        address_id,
        formData
      );
      const response = rawResponse as unknown as AddressResponse;

      if (response && response.status === "success") {
        showToast(response.message, "success", 3000, () =>
          window.location.reload()
        );
      } else {
        showToast("Failed to edit address.", "error");
      }
    } catch (error) {
      showToast(`Failed to edit address: ${error}`, "error");
    }
  };

  const deleteAddress = async (address_id: number) => {
    try {
      const rawResponse = await useAddressCustomer.deleteAddress(address_id);
      const response = rawResponse as unknown as DeleteAddressResponse;

      if (response && response.ok) {
        showToast("Address deleted successfully.", "success", 1500, () =>
          window.location.reload()
        );
      }
    } catch (error) {
      showToast("Failed to delete address.", "error");
    }
  };

  return {
    load,
    addressData,
    setAddressData,
    setPrimaryAddressEdit,
    addAddress,
    editAddress,
    deleteAddress,
  };
};

export default Services2;
