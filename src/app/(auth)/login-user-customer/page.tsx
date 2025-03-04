"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginFormCustomerValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginUser from "@/components/login/loginUser";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Laptop, Store, Headphones } from "lucide-react";

export default function StoreLoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (values: LoginFormCustomerValues) => {
    try {
      toast.info("Logging in...", {
        autoClose: false,
        isLoading: true,
      });

      const response = await AuthService.login(values);

      if (response.user.role === "customer") {
        toast.dismiss();
        toast.success("Login successful!", {
          position: "bottom-right",
          autoClose: 1500,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            window.location.href = "/";
          },
        });
      } else {
        toast.dismiss();
        toast.error("Access denied. Store-Admin privileges required.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 5000);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error instanceof Error ? error.message : "Login failed", {
        position: "bottom-right",
        autoClose: 5000,
        theme: "colored",
        hideProgressBar: false,
      });
    }
  };

  const handlegoogle = async () => {
    try {
      const res = await signIn("google", { callbackUrl: "/waiting" });
      if (!res) throw new Error("Failed to login with Google");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-gray-800 flex items-center justify-center py-20 px-4 mt-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="h-auto md:h-[90vh] w-full rounded-2xl overflow-hidden relative"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

        <div className="relative h-full w-full flex flex-col md:flex-row">
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:w-3/5 p-6 md:p-10"
          >
            <div className="h-full flex flex-col justify-center space-y-8">
              {/* Video Section */}
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/eDqfg_LexCQ?autoplay=1&loop=1&playlist=eDqfg_LexCQ&controls=0&modestbranding=1"
                  title="TechElite Promo Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Content Section */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      Welcome to TechElite
                    </h2>
                  </div>
                  <p className="text-lg md:text-xl text-gray-300 pl-11">
                    Your premium tech shopping destination
                  </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <Laptop className="w-6 h-6 text-purple-400" />
                    <span className="text-gray-300">Premium Products</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                    <span className="text-gray-300">Secure Shopping</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <Store className="w-6 h-6 text-pink-400" />
                    <span className="text-gray-300">Multiple Stores</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <Headphones className="w-6 h-6 text-green-400" />
                    <span className="text-gray-300">24/7 Support</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:w-[40%] flex justify-center items-center bg-white/5 backdrop-blur-md border-t md:border-l border-white/10 p-6 md:p-10"
          >
            <div className="w-full max-w-md md:max-w-lg px-6 md:px-8">
              <LoginUser
                onSubmit={handleSubmit}
                handleGoogleLogin={handlegoogle}
              />
            </div>
          </motion.div>
        </div>

        {/* Toast Container */}
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </motion.div>
    </div>




  );
}
