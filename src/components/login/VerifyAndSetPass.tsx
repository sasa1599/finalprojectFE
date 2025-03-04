"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { StoreIcon, Eye, EyeOff, AlertCircle } from "lucide-react";
import type { VerifyAndSetPassProps, VerifyAndSetPassValues } from "../../types/auth-types";
import { verifySetPass } from "@/helper/validation-schema-verify-set-pass";

type FieldConfig = {
  name: keyof VerifyAndSetPassValues;
  label: string;
  type: string;
  required?: boolean;
};

const VerifyAndSetPass: React.FC<VerifyAndSetPassProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const initialValues: VerifyAndSetPassValues = {
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
    referralCode: "", 
  };

  const fields: FieldConfig[] = [
    { name: "username", label: "Username", type: "text", required: true },
    { name: "firstName", label: "First Name", type: "text" },
    { name: "lastName", label: "Last Name", type: "text" },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "referralCode", label: "Referral Code", type: "text" },
  ];

  const handleSubmit = async (
    values: VerifyAndSetPassValues,
    { setSubmitting }: FormikHelpers<VerifyAndSetPassValues>
  ) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred during verification";
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 bg-gradient-to-br from-black to-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <StoreIcon className="h-12 w-12 text-blue-600 mx-auto" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Let&apos;s Complete The Account</h2>
          <p className="mt-2 text-sm text-gray-600">Verification is almost complete</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <Formik initialValues={initialValues} validationSchema={verifySetPass} onSubmit={handleSubmit}>
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {fields.map(({ name, label, type, required }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                      {label} {required && <span className="text-red-700">*</span>}
                    </label>
                    <Field
                      id={name}
                      name={name}
                      type={type}
                      autoComplete={name}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[name as keyof VerifyAndSetPassValues] && touched[name as keyof VerifyAndSetPassValues]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder={`Enter your ${label}`}
                    />
                    {errors[name as keyof VerifyAndSetPassValues] && touched[name as keyof VerifyAndSetPassValues] && (
                      <p className="mt-1 text-sm text-red-600">{errors[name as keyof VerifyAndSetPassValues]}</p>
                    )}
                  </div>
                ))}

                {["password", "confirmPassword"].map((name, index) => (
                  <div key={name} className="relative">
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                      {name === "password" ? "Password" : "Confirm Password"} <span className="text-red-700">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <Field
                        id={name}
                        name={name}
                        type={index === 0 ? (showPassword ? "text" : "password") : (showConfirmPassword ? "text" : "password")}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[name as keyof VerifyAndSetPassValues] && touched[name as keyof VerifyAndSetPassValues]
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => (index === 0 ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword))}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {index === 0
                          ? showPassword
                            ? <EyeOff className="h-5 w-5 text-gray-400" />
                            : <Eye className="h-5 w-5 text-gray-400" />
                          : showConfirmPassword
                          ? <EyeOff className="h-5 w-5 text-gray-400" />
                          : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                    {errors[name as keyof VerifyAndSetPassValues] && touched[name as keyof VerifyAndSetPassValues] && (
                      <p className="mt-1 text-sm text-red-600">{errors[name as keyof VerifyAndSetPassValues]}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? "Authenticating..." : "Verify Now"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default VerifyAndSetPass;
