// app/profile/ProfileContent.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ToastContainerElement from "@/components/ToastContainerElement";
import Section1 from "@/components/profile/Section1";
import Section2 from "@/components/profile/Section2";
import Section3 from "@/components/profile/Section3";
import { VoucherList } from "@/components/voucher-customer/VoucherList";
import { withAuth } from "@/components/high-ordered-component/AdminGuard";

function ProfileContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          router.push("/login-user-customer");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/login-user-customer");
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(checkAuthentication, 0);
    return () => clearTimeout(timeoutId);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
        </header>
        <main className="space-y-8">
          <Section1 />
          <Section2 />
          <Section3 />
          <VoucherList />
        </main>
        <ToastContainerElement />
      </div>
    </div>
  );
}
export default withAuth(ProfileContent, {
  allowedRoles: ["customer"],
  redirectPath: "/not-authorized-customer",
});