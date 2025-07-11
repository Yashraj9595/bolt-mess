"use client"

import { useEffect, useState, ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "@/contexts/auth-context"
import { LoadingScreen } from "@/components/loading/loading-screen"
import { WelcomeScreen } from "@/components/auth/screens/welcome/welcome-screen"
import { LoginScreen } from "@/components/auth/screens/login/login-screen"
import { RegisterScreen } from "@/components/auth/screens/register/register-screen"
import { ForgotPasswordScreen } from "@/components/auth/screens/forgot-password/forgot-password-screen"
import { OTPVerificationScreen } from "@/components/auth/screens/otp-verification/otp-verification-screen"
import { ResetPasswordScreen } from "@/components/auth/screens/reset-password/reset-password-screen"
import { SuccessScreen } from "@/components/auth/screens/success/success-screen"
import { useLocation, useNavigate, Routes, Route, Navigate } from "react-router-dom"
import { QuickLoginScreen } from "@/components/dev/quick-login-screen"
import { getDashboardPath } from "@/routes/utils"

interface RootClientWrapperProps {
  children: ReactNode
}

export function RootClientWrapper({ children }: RootClientWrapperProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [initialLoad, setInitialLoad] = useState(true)
  const [showQuickLogin, setShowQuickLogin] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  // Handle initial load only - not auth operations
  useEffect(() => {
    if (!isLoading && initialLoad) {
      setTimeout(() => {
        setInitialLoad(false)
      }, 1000)
    }
  }, [isLoading, initialLoad])

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && location.pathname === "/") {
      const dashboardPath = getDashboardPath(user?.role);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, location.pathname, navigate])

  // If still in initial loading state, show loading screen
  if (initialLoad) {
    return <LoadingScreen />
  }

  // DEVELOPMENT: Show QuickLoginScreen before welcome screen
  if (!isAuthenticated && location.pathname === "/" && showQuickLogin) {
    return (
      <div>
        <QuickLoginScreen />
        <div className="text-center mt-4">
          <button
            className="text-xs underline text-blue-500 hover:text-blue-700 mt-2"
            onClick={() => setShowQuickLogin(false)}
          >
            Continue to normal login/signup
          </button>
        </div>
      </div>
    )
  }

  // If not authenticated and on root path, show auth routes
  if (!isAuthenticated && location.pathname === "/") {
    const commonState = { email: "", otp: "" };
    return (
      <Routes>
        <Route path="/" element={<WelcomeScreen onNavigate={screen => navigate(getAuthPath(screen))} />} />
        <Route path="/login" element={<LoginScreen onNavigate={screen => navigate(getAuthPath(screen))} />} />
        <Route path="/register" element={<RegisterScreen onNavigate={screen => navigate(getAuthPath(screen))} />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen onNavigate={screen => navigate(getAuthPath(screen))} />} />
        <Route path="/otp-verification" element={<OTPVerificationScreen onNavigate={screen => navigate(getAuthPath(screen))} state={commonState} />} />
        <Route path="/reset-password" element={<ResetPasswordScreen onNavigate={screen => navigate(getAuthPath(screen))} authState={commonState} />} />
        <Route path="/success" element={<SuccessScreen onNavigate={screen => navigate(getAuthPath(screen))} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Otherwise, render the children (app routes)
  return <>{children}</>;
}

// Helper to map AuthScreen to path
function getAuthPath(screen: AuthScreen): string {
  switch (screen) {
    case "login":
      return "/login"
    case "register":
      return "/register"
    case "forgot-password":
      return "/forgot-password"
    case "otp-verification":
      return "/otp-verification"
    case "reset-password":
      return "/reset-password"
    case "success":
      return "/success"
    default:
      return "/"
  }
} 