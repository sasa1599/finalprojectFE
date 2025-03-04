"use client";

import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import React, { useEffect } from "react";
import ToastContainerElement from "@/components/ToastContainerElement";

export default function VerifyEmailRegister() {
  const router = useRouter();
    useEffect(() => {
        if (!localStorage.getItem('verify_email')) {
          router.push("/");
        }
    }, [router])
  return (
    <>
    <ToastContainerElement />
      <div className="min-h-screen flex items-center justify-center mt-10 bg-gradient-to-br from-black to-gray-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-black flex flex-col items-center max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-xl">
            <Image src={"/mail-sent.svg"} width={"200"} height={"200"} alt="image-sent" />
            <h1 className="font-bold m-0">Verify You&apos;re Email</h1>
            <p>We already send verify account to your email, please check it! 
              <br />
              Remember, the link only work in 1 hours.
            </p>
        </div>
      </div>
    </>
  );
}
