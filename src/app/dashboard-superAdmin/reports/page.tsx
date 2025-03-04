// app/dashboard-superAdmin/reports/page.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicMainReports = dynamic(
  () => import("@/components/super-reports/MainReports"),
  {
    ssr: false,
  }
);

export default function ReportsPage() {
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
          <span className="text-blue-600">Reports</span>
        </div>
        <h1 className="text-2xl font-bold">Reports</h1>
      </div>

      <DynamicMainReports />
    </>
  );
}
