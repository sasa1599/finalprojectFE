"use client";

import React from "react";
import { Store, MapPin, Building2 } from "lucide-react";
import { InputField } from "@/components/store-management/StoreInputFields";
import { StoreData, FormErrorsWithIndex } from "@/types/store-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { SelectField } from "./StoreSelectFields";
import { User } from "@/types/user-types";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

interface AddStoreFormProps {
  formData: StoreData;
  errors: FormErrorsWithIndex;
  handleChange: (e: React.ChangeEvent<any>) => void;
  setFormData: React.Dispatch<React.SetStateAction<StoreData>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  users: User[]
}
function MapClickHandler({
  setFormData,
}: {
  setFormData: React.Dispatch<React.SetStateAction<StoreData>>;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
    },
  });
  return null;
}

export default function AddStoreForm({
  formData,
  errors,
  handleChange,
  setFormData,
  handleSubmit,
  isSubmitting,
  users
}: AddStoreFormProps) {
  const handleNumberChange =
    (fieldName: "latitude" | "longitude") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value ? parseFloat(value) : undefined,
      }));
    };

  const DEFAULT_CENTER = {
    lat: -6.9175,
    lng: 107.6191,
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form submitted", formData); // Debug log
        handleSubmit(e).catch((error) => {
          console.error("Submit error:", error);
        });
      }}
      className="space-y-6"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="store_name"
          label="Store Name"
          Icon={Building2}
          value={formData.store_name}
          error={errors.store_name}
          onChange={handleChange}
        />
        <InputField
          name="subdistrict"
          label="Subdistrict"
          Icon={MapPin}
          value={formData.subdistrict}
          error={errors.subdistrict}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="city"
          label="City"
          Icon={MapPin}
          value={formData.city}
          error={errors.city}
          onChange={handleChange}
        />
        <InputField
          name="province"
          label="Province"
          Icon={MapPin}
          value={formData.province}
          error={errors.province}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="address"
          label="Full Address"
          Icon={MapPin}
          value={formData.address}
          error={errors.address}
          onChange={handleChange}
        />
        <InputField
          name="postcode"
          label="Postcode"
          Icon={MapPin}
          value={formData.postcode}
          error={errors.postcode}
          onChange={handleChange}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          name="latitude"
          label="Latitude (Optional)"
          Icon={MapPin}
          type="number"
          value={formData.latitude?.toString()}
          error={errors.latitude?.toString()}
          onChange={handleNumberChange("latitude")}
        />
        <InputField
          name="longitude"
          label="Longitude (Optional)"
          Icon={MapPin}
          type="number"
          value={formData.longitude}
          error={errors.longitude}
          onChange={handleNumberChange("longitude")}
        />
        <SelectField
          name="user_id"
          label="Store Admin"
          Icon={MapPin}
          value={formData.user_id}
          error={errors.user_id}
          onChange={handleChange}
          options={users?.map((v: User) => ({
            value: v.user_id,
            label:
              v.username ||
              `${v.first_name || ""} ${v.last_name || ""}`.trim() ||
              "Unnamed Admin",
          }))}
        />
      </div>

      <div className="mb-6 h-[300px] w-full">
        <MapContainer
          center={[
            formData.latitude || DEFAULT_CENTER.lat,
            formData.longitude || DEFAULT_CENTER.lng,
          ]}
          zoom={13}
          className="h-full w-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {formData.latitude && formData.longitude && (
            <Marker position={[formData.latitude, formData.longitude]}>
              <Popup>
                <span>Store Location</span>
              </Popup>
            </Marker>
          )}
          <MapClickHandler setFormData={setFormData} />
        </MapContainer>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Store className="h-5 w-5 mr-2" />
          {isSubmitting ? "Creating..." : "Create Store"}
        </button>
      </div>
    </form>
  );
}
