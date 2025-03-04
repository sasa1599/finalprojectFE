import Services2 from "@/services/profile/services2";
import { Address } from "@/types/address-types";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "../product-management/Modal";

interface Props {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addressData: Address[] | null;
}

export default function AddressClient({
  selectedAddress,
  setSelectedAddress,
  addressData,
}: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<boolean>(false);
  return (
    <div className="w-full p-4 rounded shadow bg-gray-600 my-2">
      <h5 className="text-white font-bold">Received Address</h5>
      {selectedAddress ? (
        <div className="mt-2 flex gap-2 items-center">
          <div>
            <div className="flex gap-2">
              <MapPin className="w-6 text-blue-400" />
              <p className="text-white">{selectedAddress.address_name}</p>
            </div>
            <p className="text-white mt-2 px-2">
              {selectedAddress.address}, {selectedAddress.subdistrict},{" "}
              {selectedAddress.city}, {selectedAddress.province},{" "}
              {selectedAddress.postcode}
            </p>
          </div>
          <div className="lg:w-1/4 w-full">
            <button
              onClick={() => {
                setModal(true);
              }}
              className="text-white border border-white rounded p-2 hover:border-blue-500 duration-200 transition-all hover:text-blue-500"
            >
              Change Address
            </button>
          </div>
          <Modal
            isOpen={modal}
            onClose={() => setModal(false)}
            title="Choose Address"
          >
            <div className="flex flex-col gap-2">
              {addressData?.map((val: Address, idx: number) => (
                <button
                  onClick={() => {
                    setSelectedAddress(val);
                    setModal(false);
                  }}
                  key={idx}
                  className={`border-2 rounded p-2 text-left ${
                    selectedAddress.address_id === val.address_id
                      ? "border-blue-500"
                      : "hover:border-blue-500"
                  } duration-200 transition-all`}
                >
                  <div className="w-full justify-between items-center flex">
                    <h5>{val.address_name}</h5>
                    {val.is_primary && (
                      <div className="text-white bg-blue-400 flex items-center justify-center rounded py-1 px-3 text-xs">
                        Primary Address
                      </div>
                    )}
                  </div>
                  <p className="text-white mt-2 text-xs">
                    {val.address}, {val.subdistrict}, {val.city}, {val.province}
                    , {val.postcode}
                  </p>
                </button>
              ))}
            </div>
          </Modal>
        </div>
      ) : (
        <button
          onClick={() => {
            router.push("/profile");
          }}
          className="mt-2 text-white border border-white rounded p-2 hover:border-blue-500 duration-200 transition-all hover:text-blue-500"
        >
          Create New Address
        </button>
      )}
    </div>
  );
}
