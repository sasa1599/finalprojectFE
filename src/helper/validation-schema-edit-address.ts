// helper/validation-schema-login.ts
import * as Yup from "yup";

export const addressSchema = Yup.object().shape({
  address_name: Yup.string().required("Address name is required"),
  address: Yup.string().required("Address is required"),
  subdistrict: Yup.string().required("Subdistrict is required"),
  city: Yup.string().required("City is required"),
  city_id: Yup.string().required("City ID is required"),
  province: Yup.string().required("Province is required"),
  province_id: Yup.string().required("Province ID is required"),
  postcode: Yup.string().required("Postcode is required"),
  latitude: Yup.number().typeError("Must be a number").required("Latitude is required"),
  longitude: Yup.number().typeError("Must be a number").required("Longitude is required"),
});