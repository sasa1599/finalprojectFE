// app/dashboard-superAdmin/categories/page.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicCategoriesAdmin = dynamic(
  () => import("@/app/dashboard-superAdmin/categories/CategoriesAdmin"),
  {
    ssr: false,
  }
);

export default function CategoriesPage() {
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
          <span className="text-blue-600">Categories</span>
        </div>
      </div>

      <DynamicCategoriesAdmin />
    </>
  );
}
