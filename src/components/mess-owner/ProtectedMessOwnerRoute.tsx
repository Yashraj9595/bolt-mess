import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth-context";
import { LoadingScreen } from "@/components/loading-screen";

interface ProtectedMessOwnerRouteProps {
  children: ReactNode;
}

export function ProtectedMessOwnerRoute({ children }: ProtectedMessOwnerRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "mess-owner") {
    // If not a mess owner, redirect to their appropriate dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
} 