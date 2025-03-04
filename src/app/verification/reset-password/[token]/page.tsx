"use client";

import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { VerifyResetPassValues, } from "@/types/auth-types";
import { AuthService } from "@/services/auth.service";
import VerifyResetPass from "@/components/login/VerifyResetPass";

export default function VerifyTokenFormResetPass() {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('verify_reset_pass') && !localStorage.getItem('token') && (localStorage.getItem('is_login') || !localStorage.getItem('is_login'))) {
      router.push("/");
    }
}, [router])


  const handleSubmit = async (values: VerifyResetPassValues) => {
    try {
      toast.info("Verify and process the data...", {
        autoClose: false, 
        isLoading: true,
      });

      const response = await AuthService.verifikasResetPass(values);

      if (response.status === "success") {
        localStorage.removeItem('verify_reset_pass')
        localStorage.removeItem('token')
        toast.dismiss();
        toast.success("Password Changed successfully, please login!...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            if (response.role === "customer") {
              router.push("/login-user-customer");
            } else if (response.role === "store_admin") {
              router.push("/login-store-admin");
            } else if (response.role === "super_admin") {
              router.push("/login-super-admin");
            }
          } ,
        });
      } else {
        toast.dismiss();
        toast.error("Failed To verify. Please Try again !.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          hideProgressBar: false,
        })
        setTimeout(() => {
          // router.push("/verify-reset-password");
          location.reload()
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
      <VerifyResetPass onSubmit={handleSubmit} />
    </>
  );
}
