import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { LoadingScreen } from "@/components/loading-screen";
import { UserRole } from "./config";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  isPublic?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, isPublic = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If it's a public route, allow access
  if (isPublic) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If no roles specified or user's role is allowed, grant access
  if (!allowedRoles || allowedRoles.includes(user?.role as UserRole)) {
    return <>{children}</>;
  }

  // If user's role is not allowed, redirect to their dashboard
  const dashboardPath = getDashboardPath(user?.role as UserRole);
  return <Navigate to={dashboardPath} replace />;
}

// Helper function to get dashboard path based on role
function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "mess-owner":
      return "/mess-owner/dashboard";
    case "admin":
      return "/admin/dashboard";
    case "user":
    default:
      return "/user/dashboard";
  }
} 