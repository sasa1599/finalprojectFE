"use client";

import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { RegisterFormCustomerValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterCustomer from "@/components/register/RegisterCustomer";
import React, { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function StoreRegisterPage() {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (values: RegisterFormCustomerValues) => {
    try {
      toast.info("Sign up...", {
        autoClose: false,
        isLoading: true,
      });

      const response = await AuthService.register(values);

      if (response.user.role === "customer") {
        localStorage.setItem("verify_email", "true");
        localStorage.setItem("token", response.token);
        toast.dismiss();
        toast.success(
          "Register successful, please check youre email! Redirecting...",
          {
            position: "bottom-right",
            autoClose: 3000,
            theme: "colored",
            hideProgressBar: false,
            onClose: () => {
              // router.push("/verify-register");
              window.location.href = "/verify-register";
            },
          }
        );
      } else {
        toast.dismiss();
        toast.error("Access denied.Youre not customer !.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          hideProgressBar: false,
        });
        setTimeout(() => {
          router.push("/");
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

  const handlegoogleRegister = async () => {
    try {
      const res = await signIn("google", { callbackUrl: "/waiting" });
      if (!res) throw new Error("Failed to login with Google");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
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
      <RegisterCustomer
        handleGoogleRegister={handlegoogleRegister}
        onSubmit={handleSubmit}
      />
    </>
  );
}
