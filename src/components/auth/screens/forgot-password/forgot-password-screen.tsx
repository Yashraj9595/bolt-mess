"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Mail, AlertCircle, Send, Shield, Clock, Zap } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "../../types/auth.types"

interface ForgotPasswordScreenProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
}

// Check if device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768)
}

export function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { toggleTheme } = useTheme()
  const { forgotPassword } = useAuth()
  
  // Check if device is mobile on component mount
  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])
  
  // Use stable callback for email update to prevent cursor jumping
  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    
    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address";
    }
    
    // Check for common typos in email domains
    const commonTypos = {
      'gamil.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'gmail.con': 'gmail.com',
      'gmail.om': 'gmail.com',
      'gmail.cm': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gmail.comm': 'gmail.com',
      'gmail.coom': 'gmail.com',
      'gmail.cim': 'gmail.com',
      'hotmal.com': 'hotmail.com',
      'hotmail.co': 'hotmail.com',
      'yaho.com': 'yahoo.com',
      'yahoo.co': 'yahoo.com'
    };
    
    const [localPart, domain] = email.toLowerCase().split('@');
    if (commonTypos[domain]) {
      return `Did you mean ${localPart}@${commonTypos[domain]}?`;
    }
    
    return "";
  };

  const handleEmailChange = useCallback((value: string) => {
    const error = validateEmail(value);
    if (error) {
      setError(error);
    } else {
      setError("");
    }
    setEmail(value);
  }, []);

  // Update the handleSendOTP function to properly handle errors
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    setSubmitAttempted(true)
    if (!validateEmail(email)) return

    setIsLoading(true)
    setError("")

    try {
      const trimmedEmail = email.trim()
      console.log(`Sending reset OTP for ${trimmedEmail} from ${isMobile ? 'mobile' : 'desktop'} device`)
      
      // Store email in multiple locations for better state persistence
      localStorage.setItem("reset_email", trimmedEmail)
      sessionStorage.setItem("auth_email", trimmedEmail)
      
      const success = await forgotPassword(trimmedEmail)
      if (success) {
        // Pass email and device type in state
        onNavigate("otp-verification", { 
          email: trimmedEmail, 
          resetFlow: true,
          isMobile: isMobile
        })
      } else {
        throw new Error("Failed to send reset code. Please try again.")
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error)
      setError(error.message || "Failed to send reset code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-background via-neutral-gray/10 to-background">
        <div className="relative gradient-primary h-64 sm:h-72 rounded-b-[40px] sm:rounded-b-[60px] shadow-2xl">
          <div className="absolute inset-0 bg-black/10 rounded-b-[40px] sm:rounded-b-[60px]"></div>

          <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 pt-12 sm:pt-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("login")}
              className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
            >
              <span className="sr-only">Toggle theme</span>
              <span className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </span>
              <span className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </span>
            </Button>
          </div>

          <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">Reset Password</h1>
            <p className="text-white/90 text-base sm:text-lg">{"We'll send you a secure reset code"}</p>
          </div>

          <div className="absolute top-16 right-4 sm:top-20 sm:right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
        </div>

        <div className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20 pb-6">
          <Card className="bg-card/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-0 max-w-md mx-auto animate-slide-up">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg animate-pulse-glow">
                  <Send className="text-white" size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Forgot Your Password?</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  {"Don't worry! Enter your email address and we'll send you a secure code to reset your password."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Secure</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Fast</span>
                </div>
              </div>

              <form 
                onSubmit={handleSendOTP} 
                className="space-y-4" 
                encType="application/x-www-form-urlencoded"
                noValidate
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="reset-email"
                    className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Mail size={14} className="sm:w-4 sm:h-4 text-primary-blue" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      autoComplete="email"
                      className={`bg-background border-2 rounded-lg sm:rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg text-sm sm:text-base touch-manipulation ${
                        error ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    {error && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <AlertCircle size={16} className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} />
                      {error}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:shadow-lg text-white rounded-xl py-3 text-sm sm:text-base font-semibold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send reset code to email"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send size={16} />
                      <span>Send Reset Code</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-xl p-4">
                <h4 className="font-semibold text-foreground mb-3 text-sm">What happens next:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-primary-blue rounded-full"></div>
                    <span>We'll send a 6-digit code to your email</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-secondary-blue rounded-full"></div>
                    <span>Enter the code to verify your identity</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Create a new secure password</span>
                  </div>
                </div>
              </div>

              <div className="text-center pt-3 sm:pt-4">
                <p className="text-sm sm:text-base text-muted-foreground">
                  Remember your password?{" "}
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("login")}
                    className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-sm sm:text-base"
                  >
                    Sign In
                  </Button>
                </p>
              </div>

              {/* Mobile device indicator - helpful for debugging */}
              {import.meta.env.DEV && (
                <div className="text-xs text-center text-muted-foreground opacity-50 pt-2">
                  {isMobile ? "Mobile Device Detected" : "Desktop Device Detected"}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-background via-neutral-gray/5 to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-primary-blue/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-secondary-blue/8 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        {/* Desktop Left Panel */}
        <div className="flex-1 flex items-center justify-center p-16 relative z-10">
          <div className="max-w-2xl space-y-12 animate-fade-in">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Send size={48} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                    Password Reset
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Secure and fast recovery process</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-500/20">
                  <Shield size={48} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Secure Process</h3>
                  <p className="text-lg text-muted-foreground">Bank-level security with encrypted verification codes</p>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl border border-blue-500/20">
                  <Zap size={48} className="text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Lightning Fast</h3>
                  <p className="text-lg text-muted-foreground">Instant code delivery and quick verification</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">How it works</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Enter your email</h3>
                    <p className="text-lg text-muted-foreground">We'll send a secure verification code</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-blue to-primary-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Verify your identity</h3>
                    <p className="text-lg text-muted-foreground">Enter the 6-digit code from your email</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Create new password</h3>
                    <p className="text-lg text-muted-foreground">Set a strong, secure password for your account</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Panel */}
        <div className="w-[600px] flex items-center justify-center p-16 relative z-10">
          <div className="absolute top-8 right-8">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleTheme}
              className="rounded-full p-3 transition-all duration-300"
            >
              <span className="sr-only">Toggle theme</span>
              <span className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              </span>
              <span className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </span>
            </Button>
          </div>

          <Card className="w-full max-w-lg bg-card/95 backdrop-blur-lg rounded-4xl p-12 shadow-2xl border-0 animate-slide-up">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse-glow">
                  <Send className="text-white" size={48} />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Reset Password</h2>
                <p className="text-xl text-muted-foreground">Enter your email to receive a secure reset code</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Shield size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Secure</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Clock size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Fast</div>
                </div>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6" encType="application/x-www-form-urlencoded">
                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-reset-email"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Mail size={20} className="text-primary-blue" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-reset-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      autoComplete="email"
                      className={`bg-background border-2 rounded-2xl py-4 px-6 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        error ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    {error && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <AlertCircle size={20} className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Recovery Process:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="w-3 h-3 bg-primary-blue rounded-full"></div>
                      <span>Secure 6-digit code sent to your email</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="w-3 h-3 bg-secondary-blue rounded-full"></div>
                      <span>Identity verification with the code</span>
                    </div>
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Create your new secure password</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  aria-label="Send reset code to email"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending Reset Code...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send size={24} />
                      Send Reset Code
                    </div>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <p className="text-lg text-muted-foreground">
                    Remember your password?{" "}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onNavigate("login")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-lg"
                    >
                      Sign In
                    </Button>
                  </p>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
