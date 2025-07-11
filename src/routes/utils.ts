import { UserRole } from "./config";

// Helper function to get dashboard path based on role
export function getDashboardPath(role?: UserRole): string {
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