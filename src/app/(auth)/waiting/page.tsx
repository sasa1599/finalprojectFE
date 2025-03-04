"use client"
import ToastContainerElement from '@/components/ToastContainerElement'
import { getSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const Page = () => {
    useEffect(() => {
        CekSesiGoogle()
    })
    
    const CekSesiGoogle = async () => {
    try {
        // Tunggu hingga sesi tersedia
        const session = await getSession();
        // jika sesi ga ada maka redirect ke home
        if (!session || !session.user) {
            toast.dismiss();
            toast.error("Access denied. Kamu tidak memiliki sesi auth google, redirecting...", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "colored",
                hideProgressBar: false,
            })
            setTimeout(() => {
                // router.push("/");
                window.location.href = "/"
            }, 2000);
        };
    
        // Kirim data user ke backend untuk validasi
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_BE}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: session?.user?.email,
            name: session?.user?.name,
            picture: session?.user?.image,
            }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem("exp_token", "24 Hours");
            localStorage.setItem("token", data.token);
            window.location.href = "/"
        }
    } catch (error) {
        console.error(error)
    }
    }
  return (
    <div className='w-full h-screen text-center items-center justify-center flex'>
        <ToastContainerElement />
        <h1 className='text-white'>Waiting when we verify you...</h1>
    </div>
  )
}

export default Page