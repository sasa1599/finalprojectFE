"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginSchema } from "../../helper/validation-schema-login";
import type {
  LoginFormSuperValues,
  LoginFormSuperProps,
} from "../../types/auth-types";

const LoginFormSuper: React.FC<LoginFormSuperProps> = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const initialValues: LoginFormSuperValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormSuperValues,
    { setSubmitting }: FormikHelpers<LoginFormSuperValues>
  ) => {
    try {
      await onSubmit(values);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setServerError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-black/80 to-neutral-800 
      py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div
        className="max-w-md w-full space-y-8 
        bg-white dark:bg-neutral-900 
        p-8 rounded-lg shadow-2xl 
        transform transition-all duration-500 
        hover:scale-[1.01] 
        animate-fade-in-down"
      >
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center animate-bounce-slow">
            <Shield
              className="h-12 w-12 
              text-red-600 dark:text-red-500 
              transform transition-all duration-300 
              hover:rotate-12"
            />
          </div>
          <h2
            className="mt-4 text-3xl font-bold 
            text-neutral-900 dark:text-neutral-100
            animate-fade-in-left"
          >
            Super Admin Access
          </h2>
          <p
            className="mt-2 text-sm 
            text-neutral-600 dark:text-neutral-400
            text-balance
            animate-fade-in-right"
          >
            Secure login portal for administrative control
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div
            className="bg-red-50 dark:bg-red-950 
            border-l-4 border-red-400 
            p-4 mt-4 flex items-center 
            animate-shake"
          >
            <AlertCircle
              className="h-4 w-4 
              text-red-500 dark:text-red-400 
              mr-2"
            />
            <p
              className="text-sm 
              text-red-700 dark:text-red-300"
            >
              {serverError}
            </p>
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <div className="space-y-4">
                {/* Email Field */}
                <div className="animate-fade-in-up">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium 
                      text-neutral-700 dark:text-neutral-300"
                  >
                    Email Address
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`mt-1 block w-full px-3 py-2 
                      border rounded-md shadow-sm 
                      transition-all duration-300 ease-in-out
                      bg-white dark:bg-neutral-800
                      text-neutral-900 dark:text-neutral-100
                      focus:outline-none focus:ring-2 
                      focus:ring-red-500 focus:border-red-500 
                      hover:border-red-300
                      ${
                        errors.email && touched.email
                          ? "border-red-500 dark:border-red-600"
                          : "border-neutral-300 dark:border-neutral-600"
                      }`}
                    placeholder="super.admin@example.com"
                  />
                  {errors.email && touched.email && (
                    <p
                      className="mt-1 text-sm 
                      text-red-600 dark:text-red-400 
                      animate-shake"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="relative animate-fade-in-up delay-100">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium 
                      text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`block w-full px-3 py-2 
                        border rounded-md shadow-sm 
                        transition-all duration-300 ease-in-out
                        bg-white dark:bg-neutral-800
                        text-neutral-900 dark:text-neutral-100
                        focus:outline-none focus:ring-2 
                        focus:ring-red-500 focus:border-red-500 
                        hover:border-red-300
                        ${
                          errors.password && touched.password
                            ? "border-red-500 dark:border-red-600"
                            : "border-neutral-300 dark:border-neutral-600"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center 
                        transform transition-transform duration-300 
                        hover:scale-110 active:scale-95
                        text-neutral-400 dark:text-neutral-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p
                      className="mt-1 text-sm 
                      text-red-600 dark:text-red-400 
                      animate-shake"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button with Spinner */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 
                  border border-transparent rounded-md 
                  shadow-sm text-sm font-medium text-white 
                  transition-all duration-300 ease-in-out
                  transform hover:scale-[1.02] active:scale-95
                  ${
                    isSubmitting
                      ? "bg-red-400 dark:bg-red-600 cursor-not-allowed"
                      : "bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign in as Super Admin"
                )}
              </button>
            </Form>
          )}
        </Formik>

        {/* Security Notice */}
        <div
          className="text-xs 
          text-neutral-500 dark:text-neutral-400 
          text-center mt-4 
          animate-fade-in-up delay-200
          text-balance"
        >
          This is a secure, encrypted connection. All login attempts are logged.
        </div>
      </div>
    </div>
  );
};

export default LoginFormSuper;
