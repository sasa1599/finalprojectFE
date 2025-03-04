import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { addressSchema } from "@/helper/validation-schema-edit-address";
import ReactSelect from "react-select";
import { DISTRICTS } from "@/data/district";
import { REGENCIES } from "@/data/regency";
import { PROVINCES } from "@/data/province";
import { LatLngTuple } from "leaflet";

// Konfigurasi ikon Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

// Field input yang akan ditampilkan
const fields = [
  {
    name: "address_name",
    label: "Address Name",
    type: "text",
    placeholder: "Enter address name",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    placeholder: "Enter address",
  },
  {
    name: "province",
    label: "Province",
    type: "select",
    placeholder: "Choose Province",
  },
  {
    name: "city",
    label: "City",
    type: "select",
    placeholder: "Choose City",
  },
  {
    name: "subdistrict",
    label: "Subdistrict",
    type: "select",
    placeholder: "Choose Subdistrict",
  },
  {
    name: "postcode",
    label: "Postcode",
    type: "text",
    placeholder: "Enter postcode",
  },
  {
    name: "latitude",
    label: "Latitude",
    type: "number",
    placeholder: "Enter latitude",
  },
  {
    name: "longitude",
    label: "Longitude",
    type: "number",
    placeholder: "Enter longitude",
  },
];

// Komponen untuk memilih lokasi di peta
interface LocationPickerProps {
  setFieldValue: (field: string, value: number) => void;
  setMarkerPosition: (position: LatLngTuple) => void;
  markerPosition: LatLngTuple;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  setFieldValue,
  setMarkerPosition,
  markerPosition,
}) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setMarkerPosition([Number(lat), Number(lng)] as LatLngTuple);
      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
    },
  });

  return markerPosition ? <Marker position={markerPosition} /> : null;
};

// Formulir Edit Address
interface onsubmit {
  address_name: string;
  address: string;
  subdistrict: string;
  city: string;
  city_id: string;
  province: string;
  province_id: string;
  postcode: string;
  latitude: number;
  longitude: number;
}
interface FormAddressEditProps {
  formData: {
    address_id: number;
    address_name: string;
    address: string;
    subdistrict: string;
    city: string;
    city_id: string;
    province: string;
    province_id: string;
    postcode: string;
    latitude: number;
    longitude: number;
  };
  onSubmit: (id: number, values: onsubmit) => void;
  setPrimaryAddress: (id: number) => void;
  location: any;
  setLocation: any;
}

const DEFAULT_LATITUDE = -6.19676128457438;
const DEFAULT_LONGITUDE = 106.83754574840799;

const FormAddressEdit: React.FC<FormAddressEditProps> = ({
  formData,
  onSubmit,
  setPrimaryAddress,
  location,
  setLocation,
}) => {
  // State untuk menyimpan posisi marker
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple>([
    formData.latitude || DEFAULT_LATITUDE,
    formData.longitude || DEFAULT_LONGITUDE,
  ]);
  const [addressId, setAddressId] = useState(0);
  // State untuk initial values
  const [initialValues, setInitialValues] = useState({
    address_name: "",
    address: "",
    subdistrict: "",
    city: "",
    city_id: "",
    province: "",
    province_id: "",
    postcode: "",
    latitude: "",
    longitude: "",
  });

  // Efek untuk mengatur default values saat formData berubah
  useEffect(() => {
    if (formData) {
      setAddressId(formData.address_id);
      setInitialValues({
        address_name: formData.address_name || "",
        address: formData.address || "",
        subdistrict: formData.subdistrict || "",
        city: formData.city || "",
        city_id: formData.city_id || "",
        province: formData.province || "",
        province_id: formData.province_id || "",
        postcode: formData.postcode || "",
        latitude: String(formData.latitude) || String(DEFAULT_LATITUDE),
        longitude: String(formData.longitude) || String(DEFAULT_LONGITUDE),
      });

      // Explicitly cast to LatLngTuple
      const newMarkerPosition: LatLngTuple = [
        formData.latitude || DEFAULT_LATITUDE,
        formData.longitude || DEFAULT_LONGITUDE,
      ];

      setMarkerPosition(newMarkerPosition);
      setLocation({
        province: { value: formData?.province_id, label: formData?.province },
        city: {
          value: formData?.city_id,
          label: formData?.city,
          province_id: formData?.province_id,
        },
        subdistrict: {
          value: formData?.subdistrict,
          label: formData?.subdistrict,
          regency_id: formData?.city_id,
        },
      });
    }
  }, [formData]);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={addressSchema}
      onSubmit={(values) => {
        const payload = {
          ...values,
          province_id: location?.province?.value,
          province: location?.province?.label,
          city_id: location?.city?.value,
          city: location?.city?.label,
          subdistrict: location?.subdistrict?.label,
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
        };
        onSubmit(addressId, payload);
      }}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-500"
              >
                {field.label}
              </label>
              {field.type === "select" ? (
                <ReactSelect
                  id={field.name}
                  name={field.name}
                  value={
                    field?.name === "subdistrict"
                      ? location?.subdistrict
                      : field?.name === "city"
                      ? location?.city
                      : location?.province
                  }
                  options={
                    field.name === "subdistrict"
                      ? DISTRICTS?.filter(
                          (option: any) =>
                            option.regency_id == location?.city?.value
                        )?.map((regency) => ({
                          value: regency.id,
                          label: regency.name,
                        }))
                      : field.name === "city"
                      ? REGENCIES?.filter(
                          (option: any) =>
                            option.province_id == location?.province?.value
                        )?.map((regency) => ({
                          value: regency.id,
                          label: regency.name,
                        }))
                      : PROVINCES?.map((province) => ({
                          value: province.id,
                          label: province.name,
                        }))
                  }
                  placeholder={field.placeholder}
                  isDisabled={
                    field.name === "subdistrict"
                      ? location?.city == null
                      : field.name === "city"
                      ? location?.province == null
                      : false
                  }
                  className="text-black"
                  onChange={(option) => {
                    // setFieldValue(field.name, option?.value);
                    if (field.name == "province") {
                      setLocation({
                        province: option,
                        city: null,
                        subdistrict: null,
                      });
                      return;
                    }
                    if (field.name == "city") {
                      setLocation({
                        ...location,
                        city: option,
                        subdistrict: null,
                      });
                      return;
                    }
                    if (field.name == "subdistrict") {
                      setLocation({ ...location, subdistrict: option });
                      return;
                    }
                  }}
                />
              ) : (
                <Field
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              )}
              <ErrorMessage
                name={field.name}
                component="p"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          ))}

          {/* Map Section */}
          <div className="mt-5">
            <h3 className="text-sm font-medium text-gray-500">
              Select Location on Map
            </h3>
            <MapContainer
              center={markerPosition}
              zoom={8}
              style={{ height: "300px", width: "100%", marginTop: "1rem" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={markerPosition}>
                <Popup>
                  <span>Your Selected Address</span>
                </Popup>
              </Marker>
              <LocationPicker
                setFieldValue={setFieldValue}
                setMarkerPosition={setMarkerPosition}
                markerPosition={markerPosition}
              />
            </MapContainer>
          </div>

          <div className="grid-cols-2 grid gap-3">
            <button
              type="button"
              onClick={() => setPrimaryAddress(addressId)}
              className={`w-full py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-700}`}
            >
              {"Jadikan Alamat Utama"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Address"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormAddressEdit;
