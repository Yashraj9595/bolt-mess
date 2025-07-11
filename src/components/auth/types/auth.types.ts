// Define types used across auth components

export type UserRole = "user" | "mess-owner";

export type AuthScreen = 
  | "welcome"
  | "login"
  | "register"
  | "register-role"
  | "forgot-password"
  | "otp-verification"
  | "reset-password"
  | "success";

export interface AuthState {
  email?: string;
  resetFlow?: boolean;
  role?: UserRole;
  message?: string;
  redirectTo?: AuthScreen;
}

export interface AuthNavigationProps {
  onNavigate: (screen: AuthScreen, state?: Partial<AuthState>) => void;
  state?: AuthState;
} 