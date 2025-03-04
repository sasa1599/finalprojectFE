// app/dashboard-superAdmin/store/page.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

const DynamicStoreDashboard = dynamic(() => import("./StoreDashboardContent"), {
  ssr: false,
});

export default function StoreDashboardPage() {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link
            href="/dashboard-superAdmin"
            className="hover:text-blue-600 transition-colors"
          >
            Dashboard
          </Link>
          <span className="mx-2">›</span>
          <span className="text-blue-600">My Store</span>
        </div>
        <h1 className="text-2xl font-bold">Store Dashboard</h1>
      </div>

      <DynamicStoreDashboard />
    </>
  );
}
