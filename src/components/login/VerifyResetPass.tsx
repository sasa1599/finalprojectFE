"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { StoreIcon, Eye, EyeOff, AlertCircle } from "lucide-react";
import type { VerifyResetPassValues } from "../../types/auth-types";
import { verifyResetPass } from "@/helper/validation-schema-verify-reset-pass";

// Define a specific props interface for this component
interface VerifyResetPassProps {
  onSubmit: (values: VerifyResetPassValues) => Promise<void>;
}

const VerifyResetPass: React.FC<VerifyResetPassProps> = ({ onSubmit }) => {
  const [showPasswordFields, setShowPasswordFields] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });
  const [serverError, setServerError] = useState("");

  const initialValues: VerifyResetPassValues = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };

  const togglePasswordVisibility = (field: keyof VerifyResetPassValues) => {
    setShowPasswordFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (
    values: VerifyResetPassValues,
    { setSubmitting }: FormikHelpers<VerifyResetPassValues>
  ) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during verification";
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const fields: { id: keyof VerifyResetPassValues; label: string }[] = [
    { id: "password", label: "New Password" },
    { id: "confirmPassword", label: "Confirm Password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 bg-gradient-to-br from-black to-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <StoreIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your new password is almost complete
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={verifyResetPass}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {fields.map(({ id, label }) => (
                  <div key={id} className="relative">
                    <label
                      htmlFor={id}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {label} <span className="text-red-700">*</span>
                    </label>
                    <div className="mt-1 relative">
                      <Field
                        id={id}
                        name={id}
                        type={showPasswordFields[id] ? "text" : "password"}
                        autoComplete="current-password"
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          ${
                            errors[id] && touched[id]
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(id)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPasswordFields[id] ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors[id] && touched[id] && (
                      <p className="mt-1 text-sm text-red-600">{errors[id]}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Verify Now"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-xs text-gray-500 text-center mt-4">
          Don&apos;t have an account?{" "}
          <a href="/register-user-customer" className="text-blue-500">
            Register here.
          </a>
          <br />
          This is a secure, encrypted connection. All login attempts are logged.
        </div>
      </div>
    </div>
  );
};

export default VerifyResetPass;
