"use client";

import LoginFormStore from "@/components/login/loginStoreAdmin";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginFormStoreValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StoreLoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: LoginFormStoreValues) => {
    try {
      toast.info("Logging in...", {
        autoClose: false, 
        isLoading: true,
      });

      const response = await AuthService.login(values);

      if (response.user.role === "store_admin") {
        toast.dismiss();
        toast.success("Login successful! Redirecting...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            router.push("/dashboard-storeAdmin");
          },
        });
      } else {
        toast.dismiss();
        toast.error("Access denied.Store-Admin privileges required.", {
          position: "bottom-right",
          autoClose: 5000,
          theme: "colored",
          hideProgressBar: false,
        })
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
      <LoginFormStore onSubmit={handleSubmit} />
    </>
  );
}
