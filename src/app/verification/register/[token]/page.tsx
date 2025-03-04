"use client";

import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import VerifyAndSetPass from "@/components/login/VerifyAndSetPass";
import { VerifyAndSetPassValues, VerifyResponse } from "@/types/auth-types";
import { AuthService } from "@/services/auth.service";


export default function VerifyTokenForm() {
  const router = useRouter();

  useEffect(() => {
    if (
      !localStorage.getItem("verify_email") &&
      !localStorage.getItem("token") &&
      (localStorage.getItem("is_login") || !localStorage.getItem("is_login"))
    ) {
      router.push("/");
    }
    void checkToken();
  }, [router]);

  const checkToken = async (): Promise<void> => {
    try {
      const res = await AuthService.checkTokenVerifyEmailExp();
      if (res.status === "ok") {
        console.log(res.message);
      } else {
        window.location.assign("/login-user-customer");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Token Expired") {
        window.location.assign("/login-user-customer");
        return;
      }
      console.log(error);
    }
  };

  const handleSubmit = async (
    values: VerifyAndSetPassValues
  ): Promise<void> => {
    try {
      toast.info("Verify and process the data...", {
        autoClose: false,
        isLoading: true,
      });

      const response: VerifyResponse = await AuthService.verifikasiAndSetPass(
        values
      );

      if (response.status === "success") {
        localStorage.removeItem("verify_email");
        localStorage.removeItem("token");
        localStorage.removeItem("user_id")
        toast.dismiss();
        toast.success("Verify successful, please login! Redirecting...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            switch (response.role) {
              case "customer":
                window.location.assign("/login-user-customer");
                break;
              case "store_admin":
                router.push("/login-store-admin");
                break;
              case "super_admin":
                router.push("/login-super-admin");
                break;
            }
          },
        });
      } else {
        toast.dismiss();
        toast.error("Failed To verify. Please Try again!", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          hideProgressBar: false,
        });
        setTimeout(() => {
          router.push("/verify-register");
        }, 5000);
      }
    } catch (error: unknown) {
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
      <VerifyAndSetPass onSubmit={handleSubmit} />
    </>
  );
}
