"use client";

import React, { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Define supported roles
export type UserRole = "customer" | "store_admin" | "super_admin";

// Dynamic imports for unauthorized pages
const NotAuthorizedSuperAdmin = dynamic(
  () => import("@/app/not-authorized-superadmin/page"),
  { ssr: false }
);
const NotAuthorizedStoreAdmin = dynamic(
  () => import("@/app/not-authorized-storeadmin/page"),
  { ssr: false }
);

// Authentication configuration interface
interface AuthConfig {
  allowedRoles?: UserRole[];
  redirectPath?: string;
}

// Loading Component
const LoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-neutral-900">
    <motion.div
      animate={{
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"
    />
    <p className="text-neutral-400 text-lg font-semibold ml-4">
      Checking Authorization
    </p>
  </div>
);

// Higher-Order Component for Authentication - modified to be SSR-safe
export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  config: AuthConfig = {}
) => {
  const {
    allowedRoles = ["customer", "store_admin", "super_admin"],
    redirectPath = "/login-user-customer",
  } = config;

  // Create the Auth Wrapper
  const AuthWrapper: React.FC<P> = (props) => {
    const router = useRouter();
    const [authState, setAuthState] = useState({
      isLoading: true,
      isAuthorized: false,
      role: null as UserRole | null,
    });

    useEffect(() => {
      // This function will only run on the client
      const checkAuthorization = () => {
        try {
          // Get token from storage
          const token = AuthService.getToken();

          // No token found
          if (!token) {
            setAuthState({
              isLoading: false,
              isAuthorized: false,
              role: null,
            });
            router.push(redirectPath);
            return;
          }

          // Parse token
          const decodedToken = AuthService.parseToken();

          // Invalid token
          if (!decodedToken) {
            setAuthState({
              isLoading: false,
              isAuthorized: false,
              role: null,
            });
            router.push(redirectPath);
            return;
          }

          // Check if user's role is allowed
          const userRole = decodedToken.role as UserRole;
          const isRoleAllowed = allowedRoles.includes(userRole);

          if (!isRoleAllowed) {
            setAuthState({
              isLoading: false,
              isAuthorized: false,
              role: userRole,
            });
            return;
          }

          // Authorized
          setAuthState({
            isLoading: false,
            isAuthorized: true,
            role: userRole,
          });
        } catch (error) {
          console.error("Authorization check failed:", error);
          setAuthState({
            isLoading: false,
            isAuthorized: false,
            role: null,
          });
          router.push(redirectPath);
        }
      };

      // Only run on client-side
      if (typeof window !== "undefined") {
        checkAuthorization();
      } else {
        // For SSR, just show loading initially
        // This branch should never actually run with "use client" directive
        setAuthState({
          isLoading: true,
          isAuthorized: false,
          role: null,
        });
      }
    }, [router]);

    // Loading state
    if (authState.isLoading) {
      return <LoadingComponent />;
    }

    // Unauthorized state with specific pages
    if (!authState.isAuthorized) {
      switch (authState.role) {
        case "super_admin":
          return <NotAuthorizedSuperAdmin />;
        case "store_admin":
          return <NotAuthorizedStoreAdmin />;
        default:
          router.push(redirectPath);
          return null;
      }
    }

    // Render wrapped component
    return <WrappedComponent {...props} />;
  };

  // Set display name for better debugging
  AuthWrapper.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return AuthWrapper;
};

// Utility function to get current user role - made SSR-safe
export const getCurrentUserRole = (): UserRole | null => {
  // Only run on client-side
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const token = AuthService.getToken();
    if (!token) return null;

    const decoded = AuthService.parseToken();
    return decoded?.role as UserRole;
  } catch (error) {
    console.error("Failed to get current user role", error);
    return null;
  }
};
