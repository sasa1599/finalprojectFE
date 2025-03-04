// components/navbar-comp/NavLinks.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Swal from "sweetalert2";
import ProfileServices from "@/services/profile/services1";

interface CustomJwtPayload extends JwtPayload {
  role?: string;
}

interface NavLinksProps {
  className?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({ className }) => {
  const [isCustomer, setIsCustomer] = useState(false);
  const { profile } = ProfileServices();

  // useEffect(() => {
  //   const checkAuthStatus = () => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const decoded = jwtDecode<CustomJwtPayload>(token);
  //         setIsCustomer(decoded?.role === "customer");
  //       } catch (error) {
  //         console.error("Error decoding token:", error);
  //         setIsCustomer(false);
  //       }
  //     } else {
  //       setIsCustomer(false);
  //     }
  //   };

  //   checkAuthStatus();
  //   window.addEventListener("storage", checkAuthStatus);

  //   return () => {
  //     window.removeEventListener("storage", checkAuthStatus);
  //   };
  // }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      background: "#1a1a1a",
      color: "#fff",
      heightAuto: false,
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("is_login");
      localStorage.removeItem("user_id");
      localStorage.removeItem("exp_token");

      await Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        heightAuto: false,
        timer: 1500,
        showConfirmButton: false,
      });
      window.location.assign("/login-user-customer");
    }
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Deals", path: "/deals" },
    ...(profile &&
    profile.userId &&
    profile.verified &&
    profile.password_reset_token === null
      ? [
          { name: "Profile", path: "/profile", icon: User },
          {
            name: "Logout",
            icon: LogOut,
            onClick: handleLogout,
            isLogout: true,
          },
        ]
      : [{ name: "Login", path: "/login-user-customer" }]),
  ];


  return (
    <div className="flex flex-col items-center md:flex-row">
      <div className="flex items-center gap-8">
        {navigationItems.map((item) => (
          <React.Fragment key={item.name}>
            {item.onClick ? (
              <motion.button
                onClick={item.onClick}
                className={`relative group flex items-center gap-2 ${
                  item.isLogout
                    ? "px-4 py-1.5 bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-lg border border-rose-500/20 hover:from-rose-500/30 hover:to-purple-500/30"
                    : ""
                }`}
              >
                <motion.span
                  whileHover={{
                    scale: 1.05,
                    background: item.isLogout
                      ? "none"
                      : "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
                    backgroundClip: item.isLogout ? "none" : "text",
                    color: item.isLogout ? "#f43f5e" : "transparent",
                    transition: { duration: 0.3 },
                  }}
                  className={`flex items-center gap-2 ${
                    item.isLogout
                      ? "text-rose-500 hover:text-rose-400"
                      : "text-neutral-400 hover:text-neutral-200"
                  } transition-colors`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </motion.span>
                {!item.isLogout && (
                  <motion.span
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                    className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                  />
                )}
              </motion.button>
            ) : (
              <Link
                href={item.path}
                className="relative group flex items-center gap-2"
              >
                <motion.span
                  whileHover={{
                    scale: 1.05,
                    background:
                      "linear-gradient(to right, #f43f5e, #6366f1, #3b82f6)",
                    backgroundClip: "text",
                    color: "transparent",
                    transition: { duration: 0.3 },
                  }}
                  className="flex items-center gap-2 text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </motion.span>
                <motion.span
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                />
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
