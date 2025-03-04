import * as Yup from "yup";

export const verifyResetPass = Yup.object().shape({
  password: Yup.string()
    .min(6, "New Password must be at least 6 characters")
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});
