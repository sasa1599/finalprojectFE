"use client"
import Link from "next/link";
import { Bell, ChevronDown, User } from 'lucide-react';
import React from 'react'

interface HeaderSuperAdminProps {
  setIsProfileDropdownOpen: (value: boolean) => void;
  isProfileDropdownOpen: boolean;
}

const HeaderSuperAdmin: React.FC<HeaderSuperAdminProps> = ({ setIsProfileDropdownOpen, isProfileDropdownOpen }) => {
  return (
    <header className="bg-white dark:bg-gray-800 dark:text-white">
    <div className="flex items-center justify-end px-4 py-3">

      <div className="flex items-center space-x-4">
        <button className="">
          <Bell className="h-6 w-6" />
        </button>

        <div className="relative">
          <button
            onClick={() =>
              setIsProfileDropdownOpen(!isProfileDropdownOpen)
            }
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <span>Admin</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <Link
                href="/dashboard/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>
              <hr className="my-1" />
              <Link
                href="/"
                className="block px-4 py-2 text-red-600 hover:bg-red-50"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  </header>
  )
}

export default HeaderSuperAdmin