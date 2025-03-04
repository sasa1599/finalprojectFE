"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname();

  // Untuk misahin navbar customer dan promotor
  const noFooterRoutes = [
    "/dashboard-superAdmin",
    "/dashboard-superAdmin/store/create-store",
    "/dashboard-superAdmin/store",
    "/dashboard-superAdmin/user",
    "/dashboard-superAdmin/categories",
    "/dashboard-superAdmin/product",
    "/dashboard-superAdmin/inventory",
    "/dashboard-storeAdmin",
    "/dashboard-storeAdmin/discount",
    "/dashboard-storeAdmin/reports",
    "/dashboard-superAdmin/reports",
  ];

  return noFooterRoutes.includes(pathname) ? null : <Footer />;
}
