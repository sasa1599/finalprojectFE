"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { StoreIcon, AlertCircle } from "lucide-react";
import {
  RegisterFormCustomerProps,
  RegisterFormCustomerValues,
} from "@/types/auth-types";
import { registerSchema } from "@/helper/validation-schema-register";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const RegisterCustomer: React.FC<RegisterFormCustomerProps> = ({
  onSubmit,
  handleGoogleRegister
}) => {
  const [serverError, setServerError] = useState("");

  const initialValues: RegisterFormCustomerValues = {
    email: "",
  };

  const handleSubmit = async (
    values: RegisterFormCustomerValues,
    { setSubmitting }: FormikHelpers<RegisterFormCustomerValues>
  ) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during registration";
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-10 bg-gradient-to-br from-black to-gray-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <StoreIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Register TechElite
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let&apos;s create an account
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4 flex items-center">
            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                      ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    placeholder="jhonyreva@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
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
                    Registering...
                  </div>
                ) : (
                  "Sign Up Now"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-600">
                Or continue with
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleRegister}
            className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-600/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            <Image src="/google.png" alt="Google" width={20} height={20} />
            <span className="text-black">Sign up with Google</span>
          </motion.button>
        </motion.div>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <a href="/login-user-customer" className="text-blue-500">
            Login here.
          </a>
          <br />
          This is a secure, encrypted connection. All registration attempts are
          logged.
        </div>
      </div>
    </div>
  );
};

export default RegisterCustomer;
