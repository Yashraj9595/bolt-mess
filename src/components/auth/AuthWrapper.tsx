import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthScreen, AuthState } from "./types/auth.types";
import { WelcomeScreen } from "./screens/welcome/welcome-screen";
import { LoginScreen } from "./screens/login/login-screen";
import { RegisterScreen } from "./screens/register/register-screen";
import { ForgotPasswordScreen } from "./screens/forgot-password/forgot-password-screen";
import { ResetPasswordScreen } from "./screens/reset-password/reset-password-screen";
import { OTPVerificationScreen } from "./screens/otp-verification/otp-verification-screen";
import { SuccessScreen } from "./screens/success/success-screen";
import { AuthLayout } from "./shared/AuthLayout";

interface AuthWrapperProps {
  initialScreen?: AuthScreen;
}

export function AuthWrapper({ initialScreen = "welcome" }: AuthWrapperProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(initialScreen);
  const [authState, setAuthState] = useState<AuthState>({});
  const navigate = useNavigate();

  const handleNavigate = (screen: AuthScreen, state?: Partial<AuthState>) => {
    setCurrentScreen(screen);
    if (state) {
      setAuthState(prev => ({ ...prev, ...state }));
    }
    // Update URL without triggering a route change
    window.history.pushState(null, "", `/${screen === "welcome" ? "" : screen}`);
  };

  const renderScreen = () => {
    const props = { onNavigate: handleNavigate, state: authState };

    switch (currentScreen) {
      case "welcome":
        return <WelcomeScreen {...props} />;
      case "login":
        return <LoginScreen {...props} />;
      case "register":
        return <RegisterScreen {...props} />;
      case "forgot-password":
        return <ForgotPasswordScreen {...props} />;
      case "reset-password":
        return <ResetPasswordScreen onNavigate={handleNavigate} authState={authState as AuthState} />;
      case "otp-verification":
        return <OTPVerificationScreen {...props} />;
      case "success":
        return <SuccessScreen {...props} />;
      default:
        return <WelcomeScreen {...props} />;
    }
  };

  return (
    <AuthLayout>
      {renderScreen()}
    </AuthLayout>
  );
} 