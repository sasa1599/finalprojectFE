"use client";

import Sidebar from "@/components/sidebarSuperAdmin";
import { withAuth } from "@/components/high-ordered-component/AdminGuard";
import { ReactNode, useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check window size and handle mobile sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Only auto-open sidebar on desktop when the component mounts or window resizes from mobile to desktop
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main
        className={`flex-1 transition-all duration-300 w-full 
        ${isSidebarOpen && !isMobile ? "md:ml-64" : ""}`}
      >
        {/* Mobile Header with toggle */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white shadow-sm p-3 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
          <h1 className="ml-4 text-lg font-semibold">Super Admin</h1>
        </div>

        <div className="max-w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm p-2 sm:p-4 md:p-6 mt-14 md:mt-0">
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default withAuth(SuperAdminLayout, {
  allowedRoles: ["super_admin"],
  redirectPath: "/not-authorized-superadmin",
});
