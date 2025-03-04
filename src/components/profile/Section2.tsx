import React, { useState } from "react";
import services2 from "@/services/profile/services2";
import Modal from "../product-management/Modal";
import FormAddressAdd from "./FormAddressAdd";
import FormAddressEdit from "./FormAddressEdit";
import {
  HouseIcon,
  PencilIcon,
  Trash2Icon,
  PlusCircleIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import { Address, AddressFormData, Location } from "@/types/address-types";
import DeleteAddressModal from "../product-page-customer/DeleteAddressModal";

const Section2 = () => {
  const {
    load,
    addressData,
    setAddressData,
    setPrimaryAddressEdit,
    addAddress,
    editAddress,
    deleteAddress,
  } = services2();

  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [expandedAddressId, setExpandedAddressId] = useState<number | null>(
    null
  );
  const [modalDelete, setModalDelete] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [formEditData, setFormEditData] = useState<Address>({
    address_id: 0,
    address_name: "",
    address: "",
    subdistrict: "",
    city: "",
    city_id: "",
    province: "",
    province_id: "",
    postcode: "",
    latitude: 0,
    longitude: 0,
    is_primary: false,
  });

  const [location, setLocation] = useState<Location>({
    province: null,
    city: null,
    subdistrict: null,
  });

  const handleAddAddress = (values: {
    address_name: string;
    address: string;
    postcode: string;
    latitude: string;
    longitude: string;
  }) => {
    const payload = {
      address_name: values.address_name,
      address: values.address,
      postcode: values.postcode,
      latitude: values.latitude,
      longitude: values.longitude,
      subdistrict: location.subdistrict?.label || "",
      city: location.city?.label || "",
      city_id: String(location.city?.value || ""),
      province: location.province?.label || "",
      province_id: String(location.province?.value || ""),
    };
    return addAddress(payload);
  };

  const handleEditAddress = (id: number, values: AddressFormData) => {
    const addressPayload: Address = {
      ...values,
      address_id: id,
      city_id: String(values.city_id),
      province_id: String(values.province_id),
      postcode: String(values.postcode),
    };
    return editAddress(id, addressPayload);
  };

  const toggleExpand = (id: number) => {
    setExpandedAddressId(expandedAddressId === id ? null : id);
  };

  const confirmDelete = async (id: number) => {
    try {
      await deleteAddress(id);
      setAddressData((prev) =>
        prev.filter((address) => address.address_id !== id)
      ); // Hapus dari state biar langsung update
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  return (
    <>
      <div className="mt-10 text-center">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <p className="text-gray-400 mt-2">
          Manage and update your delivery locations
        </p>
      </div>

      <section className="mt-8 max-w-4xl mx-auto px-6 pt-6 pb-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Saved Locations
            </h2>
            <p className="text-gray-400 text-sm">
              {addressData.length}{" "}
              {addressData.length === 1 ? "address" : "addresses"} saved
            </p>
          </div>

          <button
            onClick={() => setModalAdd(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all transform hover:scale-105"
          >
            <PlusCircleIcon size={18} />
            <span>Add New Address</span>
          </button>
        </div>

        {addressData.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 bg-opacity-50 rounded-lg">
            <MapPinIcon size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-gray-400 mb-4">
              You don&apos;t have any saved addresses yet
            </h3>
            <button
              onClick={() => setModalAdd(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-all"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {addressData
              .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
              .map((data) => (
                <div
                  key={data.address_id}
                  className={`bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700 
                    ${data.is_primary ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div
                    className="px-5 py-4 cursor-pointer"
                    onClick={() => toggleExpand(data.address_id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {data.is_primary ? (
                          <div className="rounded-full bg-blue-600 p-2">
                            <StarIcon size={18} className="text-white" />
                          </div>
                        ) : (
                          <div className="rounded-full bg-gray-700 p-2">
                            <HouseIcon size={18} className="text-gray-300" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {data.address_name}
                            {data.is_primary && (
                              <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                                Primary
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-400 text-sm truncate max-w-md">
                            {data.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalEdit(true);
                            setFormEditData(data);
                          }}
                          className="p-2 rounded-full bg-gray-700 hover:bg-green-600 transition-colors"
                          title="Edit address"
                        >
                          <PencilIcon size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAddressId(data.address_id);
                            setModalDelete(true);
                          }}
                          className="p-2 rounded-full bg-gray-700 hover:bg-red-600 transition-colors"
                          title="Delete address"
                        >
                          <Trash2Icon size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedAddressId === data.address_id && (
                    <div className="px-5 py-4 bg-gray-750 border-t border-gray-700 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Province</p>
                          <p className="text-sm">{data.province || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">City</p>
                          <p className="text-sm">{data.city || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Subdistrict</p>
                          <p className="text-sm">{data.subdistrict || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Postal Code</p>
                          <p className="text-sm">{data.postcode || "—"}</p>
                        </div>
                      </div>

                      {!data.is_primary && (
                        <button
                          onClick={() => setPrimaryAddressEdit(data.address_id)}
                          className="w-full mt-2 py-2 bg-transparent hover:bg-blue-700 text-blue-400 hover:text-white border border-blue-500 rounded-md transition-all text-sm"
                        >
                          Set as Primary Address
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* modal add address */}
        <Modal
          isOpen={modalAdd}
          onClose={() => setModalAdd(false)}
          title="Add New Address"
        >
          <FormAddressAdd
            onsubmit={handleAddAddress}
            location={location}
            setLocation={setLocation}
          />
        </Modal>

        {/* modal edit address */}
        <Modal
          isOpen={modalEdit}
          onClose={() => setModalEdit(false)}
          title="Edit Address"
        >
          <FormAddressEdit
            formData={formEditData}
            onSubmit={handleEditAddress}
            setPrimaryAddress={setPrimaryAddressEdit}
            location={location}
            setLocation={setLocation}
          />
        </Modal>
        <DeleteAddressModal
          isOpen={modalDelete}
          onClose={() => setModalDelete(false)}
          onDelete={async () => {
            if (selectedAddressId !== null) {
              await confirmDelete(selectedAddressId);
            }
            setModalDelete(false);
          }}
        />
      </section>
    </>
  );
};

export default Section2;