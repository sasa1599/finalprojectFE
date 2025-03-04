// helper/validation-schema-login.ts
import * as Yup from "yup";

export const addressSchema = Yup.object().shape({
  address_name: Yup.string().required("Address name is required"),
  address: Yup.string().required("Address is required"),
  subdistrict: Yup.string().optional(),
  city: Yup.string().optional(),
  city_id: Yup.string().optional(),
  province: Yup.string().optional(),
  province_id: Yup.string().optional(),
  postcode: Yup.string().required("Postcode is required"),
  latitude: Yup.number().typeError("Must be a number").required("Latitude is required"),
  longitude: Yup.number().typeError("Must be a number").required("Longitude is required"),
});