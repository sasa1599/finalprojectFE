// app/dashboard-superAdmin/inventory/page.tsx
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const DynamicInventoryAdmin = dynamic(
  () => import("@/app/dashboard-superAdmin/inventory/InventoryAdmin"),
  {
    ssr: false,
  }
);

export default function InventoryPage() {
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
          <span className="text-blue-600">Inventory</span>
        </div>
      </div>

      <DynamicInventoryAdmin />
    </>
  );
}
