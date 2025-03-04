import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { addressSchema } from "@/helper/validation-schema-add-address";
import ReactSelect from "react-select";
import { PROVINCES } from "@/data/province";
import { REGENCIES } from "@/data/regency";
import { DISTRICTS } from "@/data/district";

// Ikon default untuk marker Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
});

const initialValues = {
  address_name: "",
  address: "",
  postcode: "",
  latitude: "",
  longitude: "",
};

interface LocationPickerProps {
  setFieldValue: (field: string, value: number) => void;
}

interface FormAddressAddProps {
  onsubmit: (values: typeof initialValues) => void;
  location: any;
  setLocation: any;
}

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

const LocationPicker: React.FC<LocationPickerProps> = ({ setFieldValue }) => {
  const [position, setPosition] = useState<[number, number]>([0, 0]);
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFieldValue("latitude", lat);
      setFieldValue("longitude", lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const FormAddressAdd: React.FC<FormAddressAddProps> = ({
  onsubmit,
  location,
  setLocation,
}) => (
  <Formik
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
      };
      onsubmit(payload);
    }}
  >
    {({ isSubmitting, setFieldValue, values }) => (
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
                options={
                  field.name === "subdistrict"
                    ? DISTRICTS?.filter(
                        (option: any) =>
                          option.regency_id == location.city?.value
                      )?.map((regency) => ({
                        value: regency.id,
                        label: regency.name,
                      }))
                    : field.name === "city"
                    ? REGENCIES?.filter(
                        (option: any) =>
                          option.province_id == location.province?.value
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
                    ? location.city == null
                    : field.name === "city"
                    ? location.province == null
                    : false
                }
                className="text-black"
                onChange={(option) => {
                  // setFieldValue(field.name, option?.value);
                  setLocation({ ...location, [field.name]: option });
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
            center={[
              Number(values.latitude) || -6.19676128457438,
              Number(values.longitude) || 106.83754574840799,
            ]}
            zoom={8}
            style={{ height: "300px", width: "100%", marginTop: "1rem" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {values.latitude && values.longitude && (
              <Marker
                position={[Number(values.latitude), Number(values.longitude)]}
              >
                <Popup>
                  <span>Your New Selected Address</span>
                </Popup>
              </Marker>
            )}
            <LocationPicker setFieldValue={setFieldValue} />
          </MapContainer>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Address"}
        </button>
      </Form>
    )}
  </Formik>
);

export default FormAddressAdd;