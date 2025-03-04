"use client";

import React, { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { ShoppingBag, Eye, EyeOff, AlertCircle } from "lucide-react";
import { loginSchema } from "../../helper/validation-schema-login";
import type {
  LoginFormCustomerProps,
  LoginFormCustomerValues,
} from "../../types/auth-types";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LoginUser: React.FC<LoginFormCustomerProps> = ({
  onSubmit,
  handleGoogleLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const initialValues: LoginFormCustomerValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (
    values: LoginFormCustomerValues,
    { setSubmitting }: FormikHelpers<LoginFormCustomerValues>
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
    <div className="min-h-screen flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[600px] relative" // Change from max-w-md to w-[600px]
      >
        {/* Animated background glow */}
        <motion.div
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-3xl -z-10"
        />

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <ShoppingBag className="h-12 w-12 text-blue-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
            >
              Welcome Back!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 text-sm text-gray-300"
            >
              Sign in to your account
            </motion.p>
          </motion.div>

          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-lg p-4 mt-4 flex items-center"
              >
                <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                <p className="text-sm text-red-400">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="mt-2 space-y-4">
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-200">
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 block w-full px-3 py-2 bg-white/5 border border-gray-300/10 rounded-lg text-gray-200 placeholder-gray-400
                        focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && touched.email && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-400"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <label className="block text-sm font-medium text-gray-200">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="block w-full px-3 py-2 bg-white/5 border border-gray-300/10 rounded-lg text-gray-200 placeholder-gray-400
                          focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                        placeholder="••••••••"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </motion.button>
                    </div>
                    {errors.password && touched.password && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-sm text-red-400"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                    <div className="flex justify-end mt-2">
                      <motion.a
                        whileHover={{ color: "#60A5FA" }}
                        href="/reset-password"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </motion.a>
                    </div>
                  </motion.div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200" />
                  <div className="relative px-6 py-3 bg-black rounded-lg leading-none flex items-center justify-center">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2" />
                        <span className="text-gray-200">Authenticating...</span>
                      </div>
                    ) : (
                      <span className="text-gray-200">Sign in</span>
                    )}
                  </div>
                </motion.button>
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
                <div className="w-full border-t border-gray-300/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
            >
              <Image src="/google.png" alt="Google" width={20} height={20} />
              <span className="text-gray-200">Sign in with Google</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center space-y-2 text-sm text-gray-400"
          >
            <p>
              Don&apos;t have an account?{" "}
              <motion.a
                whileHover={{ color: "#60A5FA" }}
                href="/register-user-customer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Register here
              </motion.a>
            </p>
            <p>
              Want to login as super admin?{" "}
              <motion.a
                whileHover={{ color: "#60A5FA" }}
                href="/login-super-admin"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Login as admin
              </motion.a>
            </p>
            <p className="text-xs text-gray-500">
              This is a secure, encrypted connection
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginUser;
