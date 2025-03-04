"use client";

import StoreSideBar from "@/components/sidebarStoreAdmin";
import { withAuth } from "@/components/high-ordered-component/AdminGuard";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <StoreSideBar />
      
      <main className="flex-1 transition-all duration-300 lg:ml-64">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default withAuth(DashboardLayout, {
  allowedRoles: ["store_admin"],
  redirectPath: "/not-authorized-storeadmin", 
});