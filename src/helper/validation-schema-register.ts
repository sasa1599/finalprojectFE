// helper/validation-schema-login.ts
import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
