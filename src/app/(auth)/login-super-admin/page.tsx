"use client";

import LoginFormSuper from "@/components/login/loginSuperAdmin";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { LoginFormSuperValues } from "@/types/auth-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SuperLoginPage() {
  const router = useRouter();

  const handleSubmit = async (values: LoginFormSuperValues) => {
    try {
      // Show loading toast
      toast.info("Logging in...", {
        autoClose: false, // Won't auto close
        isLoading: true,
      });

      const response = await AuthService.login(values);

      if (response.user.role === "super_admin") {
        // Dismiss all toasts first
        toast.dismiss();

        // Show success toast
        toast.success("Login successful! Redirecting...", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
          hideProgressBar: false,
          onClose: () => {
            router.push("/dashboard-superAdmin");
          },
        });
      } else {
        toast.dismiss();
        toast.error("Access denied. Admin privileges required.", {
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
      <LoginFormSuper onSubmit={handleSubmit} />
    </>
  );
}
