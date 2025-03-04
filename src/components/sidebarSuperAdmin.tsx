"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  LogOut,
  StoreIcon,
  X,
  Menu,
  FolderKanban,
  Boxes,
  PackageOpen,
  Clipboard,
} from "lucide-react";
import { AuthService } from "@/services/auth.service";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";
import { useState, useEffect } from "react";
import ProfileServices from "@/services/profile/services1";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile } = ProfileServices();
  const [activeLink, setActiveLink] = useState(pathname);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/",
    },
    {
      title: "My Store",
      icon: <StoreIcon className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/store",
    },
    {
      title: "User Management",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/user",
    },
    {
      title: "Categories",
      icon: <FolderKanban className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/categories",
    },
    {
      title: "Product",
      icon: <Boxes className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/product",
    },
    {
      title: "Inventory",
      icon: <PackageOpen className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/inventory",
    },
    {
      title: "Reports",
      icon: <Clipboard className="h-4 w-4 sm:h-5 sm:w-5" />,
      href: "/dashboard-superAdmin/reports",
    },
  ].filter(Boolean);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AuthService.logout();
          Swal.fire({
            title: "Logged Out!",
            text: "Successfully logged out",
            icon: "success",
            timer: 1500,
          });
          router.push("/login-super-admin");
        } catch (error) {
          console.error("Logout failed:", error);
          Swal.fire({
            title: "Error!",
            text: error instanceof Error ? error.message : "Failed to logout",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button - removed as we now have this in the layout */}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 bg-gradient-to-b from-indigo-50 via-white to-white border-r border-gray-200 w-64 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center text-white text-sm sm:text-base font-bold backdrop-blur-sm">
                SA
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Super Admin</h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 sm:top-6 right-3 sm:right-4 md:hidden text-white hover:text-red-200 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-1.5 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActiveLink(link.href);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base ${
                  activeLink === link.href
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <div className="transition-all duration-200">{link.icon}</div>
                <span className="font-medium">{link.title}</span>
                {activeLink === link.href && (
                  <div className="ml-auto w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 sm:p-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl
                bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:shadow-md
                transition-all duration-200 font-medium text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}