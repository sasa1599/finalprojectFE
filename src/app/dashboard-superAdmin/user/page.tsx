"use client";

import React from "react";
import UserManagement from "@/components/user-management/UserManagement";

export default function UserAdmin() {
  return (
    <>
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Dashboard</span>
          <span className="mx-2">›</span>
          <span className="text-blue-600">User Management</span>
        </div>
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <UserManagement />
    </>
  );
}
