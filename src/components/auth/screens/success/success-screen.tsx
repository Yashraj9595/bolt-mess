"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthScreen, AuthState } from "../../types/auth.types";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import { getDashboardPath } from "@/routes/utils";

interface SuccessScreenProps {
  onNavigate: (screen: AuthScreen) => void;
  state?: AuthState;
}

export function SuccessScreen({ onNavigate, state }: SuccessScreenProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const isPasswordReset = state?.resetFlow;
  const customMessage = state?.message;
  
  const title = customMessage 
    ? customMessage 
    : isPasswordReset 
      ? "Password Reset Successfully" 
      : "Account Created Successfully";
      
  const description = isPasswordReset
    ? "Your password has been reset successfully. You can now sign in with your new password."
    : "Your account has been created successfully. You can now sign in to your account.";
  
  // Redirect authenticated users to their role-specific dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      // Short delay to show success message before redirecting
      const redirectTimer = setTimeout(() => {
        navigate(dashboardPath, { replace: true });
      }, 1500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold">{title}</h1>
          
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? "Redirecting you to your dashboard..." 
              : description}
          </p>
        </div>

        {!isAuthenticated && (
          <Button
            onClick={() => onNavigate(state?.redirectTo || "login")}
            className="w-full"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
} 