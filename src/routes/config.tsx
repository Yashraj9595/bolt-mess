// Route configuration for MessHub application
import { MessOwnerDashboard } from "@/components/mess-owner/mess-owner-dashboard";
import { Profile } from "@/components/mess-owner/profile";
import { SettingsScreen } from "@/components/mess-owner/settings-screen";
import { UserDashboard } from "@/components/user/user-dashboard";
import AdminDashboard from "@/pages/admin/dashboard";
import NotFound from "@/pages/NotFound";
import ThemeShowcasePage from "@/pages/theme-showcase";
import DevLogin from "@/pages/DevLogin";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import Index from "@/pages/Index";

export type UserRole = "user" | "mess-owner" | "admin";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedRoles?: UserRole[];
  isPublic?: boolean;
}

export const routes: RouteConfig[] = [
  // Public routes (no auth required)
  {
    path: "/",
    element: <Index />,
    isPublic: true
  },
  {
    path: "/welcome",
    element: <AuthWrapper initialScreen="welcome" />,
    isPublic: true
  },
  {
    path: "/login",
    element: <AuthWrapper initialScreen="login" />,
    isPublic: true
  },
  {
    path: "/register",
    element: <AuthWrapper initialScreen="register" />,
    isPublic: true
  },
  {
    path: "/forgot-password",
    element: <AuthWrapper initialScreen="forgot-password" />,
    isPublic: true
  },
  {
    path: "/reset-password",
    element: <AuthWrapper initialScreen="reset-password" />,
    isPublic: true
  },
  {
    path: "/otp-verification",
    element: <AuthWrapper initialScreen="otp-verification" />,
    isPublic: true
  },
  {
    path: "/success",
    element: <AuthWrapper initialScreen="success" />,
    isPublic: true
  },
  {
    path: "/dev-login",
    element: <DevLogin />,
    isPublic: true
  },
  {
    path: "/theme-showcase",
    element: <ThemeShowcasePage />,
    isPublic: true
  },

  // User routes
  {
    path: "/user/dashboard",
    element: <UserDashboard />,
    allowedRoles: ["user"]
  },

  // Mess Owner routes
  {
    path: "/mess-owner/dashboard",
    element: <MessOwnerDashboard />,
    allowedRoles: ["mess-owner"]
  },
  {
    path: "/mess-owner/profile",
    element: <Profile />,
    allowedRoles: ["mess-owner"]
  },
  {
    path: "/mess-owner/settings",
    element: <SettingsScreen />,
    allowedRoles: ["mess-owner"]
  },

  // Admin routes
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    allowedRoles: ["admin"]
  },

  // Catch-all route
  {
    path: "*",
    element: <NotFound />,
    isPublic: true
  }
]; 