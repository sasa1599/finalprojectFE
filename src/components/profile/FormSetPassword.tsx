import { verifySetPassProfileGoogle } from "@/helper/validation-schema-verify-set-pass";
import { FormSetPassAccGoogle, ValuesSetPassAccGoogle } from "@/types/setpass-types";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const fields = [
  { name: "password", placeholder: "Enter password", label: "Password", type: "password" },
  { name: "confirmPassword", placeholder: "Confirm password", label: "Confirm Password", type: "password" },
];

const FormSetPassword: React.FC<FormSetPassAccGoogle> = ({ onsubmit }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={verifySetPassProfileGoogle}
    onSubmit={(values: ValuesSetPassAccGoogle) => {
      console.log("Submitted Data:", values);
      onsubmit(values);
    }}
  >
    {({ isSubmitting, setFieldValue, values }) => (
  <Form className="space-y-4">
    {fields.map((field) => (
      <div key={field.name}>
        <label htmlFor={field.name} className="block text-sm font-medium text-gray-500">
          {field.label}
        </label>
        <Field
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          type={field.type}
          className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        <ErrorMessage
          name={field.name}
          component="p"
          className="mt-1 text-sm text-red-600"
        />
      </div>
    ))}

    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${
        isSubmitting ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700"
      }`}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  </Form>
)}
  </Formik>
);

export default FormSetPassword;