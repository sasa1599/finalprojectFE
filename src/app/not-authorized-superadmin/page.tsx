"use client";

import React from "react";
import Link from "next/link";
import { Shield, Home, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function NotAuthorizedSuperAdmin() {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-neutral-800 rounded-xl shadow-2xl p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <Shield className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-100 mb-4">
          Access Denied
        </h1>

        <p className="text-neutral-400 mb-6">
          You do not have the required permissions to access the Super Admin
          Dashboard. Please contact your system administrator if you believe
          this is an error.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            href="/login-super-admin"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-2 px-4 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
