"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ArrowLeft, Eye, EyeOff, Lock, AlertCircle, Shield, CheckCircle, Zap } from "lucide-react"
import { useAuth, AuthState } from "@/contexts/auth-context"
import { AuthScreen } from "../../types/auth.types"

interface ResetPasswordScreenProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
  authState: AuthState
}

// Check if device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768)
}

export function ResetPasswordScreen({ onNavigate, authState }: ResetPasswordScreenProps) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [email, setEmail] = useState(authState.email || "")
  const [otp, setOtp] = useState(authState.otp || "")

  const { resetPassword } = useAuth()
  
  // Check if device is mobile and retrieve stored values
  useEffect(() => {
    const mobile = isMobileDevice()
    setIsMobile(mobile)
    
    // For mobile devices, check if email and OTP are in localStorage
    if (mobile) {
      const storedEmail = localStorage.getItem("reset_email")
      const storedOTP = localStorage.getItem("reset_otp")
      
      if (storedEmail && !email) {
        setEmail(storedEmail)
        console.log("Retrieved email from localStorage:", storedEmail)
      }
      
      if (storedOTP && !otp) {
        setOtp(storedOTP)
        console.log("Retrieved OTP from localStorage:", storedOTP)
      }
    }
  }, [authState, email, otp])
  
  // Use stable callbacks for form updates to prevent cursor jumping
  const handlePasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, password: value }))
  }, [])
  
  const handleConfirmPasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, confirmPassword: value }))
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Check if we have email and OTP
    if (!email) {
      newErrors.general = "Email is missing. Please go back and try again."
    }
    
    if (!otp) {
      newErrors.general = "Verification code is missing. Please go back and try again."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleResetPassword function to properly handle errors
  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      console.log(`Resetting password for ${email} with OTP ${otp}`)
      const success = await resetPassword(email, otp, formData.password)
      
      if (success) {
        // Clear stored values on success
        if (isMobile) {
          localStorage.removeItem("reset_email")
          localStorage.removeItem("reset_otp")
        }
        
        onNavigate("success", { 
          email: email,
          message: "Password reset successful! You can now login with your new password."
        })
      } else {
        setErrors({ general: "Failed to reset password. Please try again." })
      }
    } catch (error: any) {
      console.error("Password reset error:", error)
      setErrors({ general: error.message || "Failed to reset password. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 6) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = useMemo(() => ["Very Weak", "Weak", "Fair", "Good", "Strong"], [])
  const strengthColors = useMemo(() => ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"], [])

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
              onClick={() => onNavigate("otp-verification", { ...authState, email, otp })}
              className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <ThemeToggle />
          </div>

          <div className="relative z-10 px-4 sm:px-6 pb-6 sm:pb-8">
            <h1 className="text-white text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">New Password</h1>
            <p className="text-white/90 text-base sm:text-lg">Create a strong, secure password</p>
          </div>

          <div className="absolute top-16 right-4 sm:top-20 sm:right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-8 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
        </div>

        <div className="px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-20 pb-6">
          <Card className="bg-card/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-0 max-w-md mx-auto animate-slide-up">
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg animate-pulse-glow">
                  <Lock className="text-white" size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Create New Password</h2>
                <p className="text-sm sm:text-base text-muted-foreground px-2">
                  Your new password must be different from previous passwords
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <Shield size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">Secure</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <CheckCircle size={16} className="text-blue-500" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Verified</span>
                </div>
              </div>

              {/* Display general errors */}
              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.general}
                  </p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4 sm:space-y-6" encType="application/x-www-form-urlencoded">
                <div className="space-y-2">
                  <Label
                    htmlFor="mobile-new-password"
                    className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Lock size={14} className="sm:w-4 sm:h-4 text-primary-blue" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="mobile-new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-lg sm:rounded-xl py-3 px-4 pr-12 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg text-sm sm:text-base touch-manipulation ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength >= level
                                ? strengthColors[Math.min(passwordStrength - 1, 4)]
                                : "bg-neutral-gray"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          passwordStrength >= 4
                            ? "text-green-600 dark:text-green-400"
                            : passwordStrength >= 3
                              ? "text-blue-600 dark:text-blue-400"
                              : passwordStrength >= 2
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        Password strength: {strengthLabels[Math.min(passwordStrength, 4)] || "Very Weak"}
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="mobile-confirm-password"
                    className="text-foreground font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <Lock size={14} className="sm:w-4 sm:h-4 text-primary-blue" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="mobile-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-lg sm:rounded-xl py-3 px-4 pr-12 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg text-sm sm:text-base touch-manipulation ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Password Requirements:</h4>
                  <div className="space-y-2">
                    <div
                      className={`flex items-center gap-3 text-xs sm:text-sm ${
                        formData.password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          formData.password.length >= 8 ? "bg-green-500" : "bg-neutral-gray"
                        }`}
                      ></div>
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 text-xs sm:text-sm ${
                        /[A-Z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-neutral-gray"}`}
                      ></div>
                      <span>One uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 text-xs sm:text-sm ${
                        /[a-z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.password) ? "bg-green-500" : "bg-neutral-gray"}`}
                      ></div>
                      <span>One lowercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-3 text-xs sm:text-sm ${
                        /[0-9]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-500" : "bg-neutral-gray"}`}
                      ></div>
                      <span>One number</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:shadow-xl text-white rounded-lg sm:rounded-xl py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating Password...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield size={18} />
                      Update Password
                    </div>
                  )}
                </Button>
              </form>
              
              {/* Mobile device indicator - helpful for debugging */}
              {import.meta.env.DEV && (
                <div className="text-xs text-center text-muted-foreground opacity-50 pt-2">
                  {isMobile ? "Mobile Device Detected" : "Desktop Device Detected"} |
                  Email: {email || "None"} | OTP: {otp ? "Set" : "None"}
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
                  <Lock size={48} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                    New Password
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Create a strong, secure password</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl border border-green-500/20">
                  <Shield size={48} className="text-green-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Secure</h3>
                  <p className="text-lg text-muted-foreground">Bank-level encryption and security protocols</p>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-3xl border border-blue-500/20">
                  <CheckCircle size={48} className="text-blue-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-3">Verified</h3>
                  <p className="text-lg text-muted-foreground">Identity confirmed and authenticated</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Password Security Tips</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Use a strong password</h3>
                    <p className="text-lg text-muted-foreground">Mix of uppercase, lowercase, numbers, and symbols</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-blue to-primary-blue rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Make it unique</h3>
                    <p className="text-lg text-muted-foreground">Don't reuse passwords from other accounts</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Keep it secure</h3>
                    <p className="text-lg text-muted-foreground">Store it safely and don't share with others</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Panel */}
        <div className="w-[600px] flex items-center justify-center p-16 relative z-10">
          <div className="absolute top-8 right-8">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-lg bg-card/95 backdrop-blur-lg rounded-4xl p-12 shadow-2xl border-0 animate-slide-up">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse-glow">
                  <Lock className="text-white" size={48} />
                </div>
                <h2 className="text-4xl font-bold text-foreground">Create New Password</h2>
                <p className="text-xl text-muted-foreground">
                  Your new password must be different from previous passwords
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Shield size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Secure</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <CheckCircle size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Verified</div>
                </div>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6" encType="application/x-www-form-urlencoded">
                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-new-password"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Lock size={20} className="text-primary-blue" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-2xl py-4 px-6 pr-16 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        errors.password
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>

                  {formData.password && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                              passwordStrength >= level
                                ? strengthColors[Math.min(passwordStrength - 1, 4)]
                                : "bg-neutral-gray"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-base font-medium ${
                          passwordStrength >= 4
                            ? "text-green-600 dark:text-green-400"
                            : passwordStrength >= 3
                              ? "text-blue-600 dark:text-blue-400"
                              : passwordStrength >= 2
                                ? "text-yellow-600 dark:text-yellow-400"
                                : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        Password strength: {strengthLabels[Math.min(passwordStrength, 4)] || "Very Weak"}
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-confirm-password"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Lock size={20} className="text-primary-blue" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                      autoComplete="new-password"
                      className={`bg-background border-2 rounded-2xl py-4 px-6 pr-16 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        errors.confirmPassword
                          ? "border-red-500 focus:border-red-500"
                          : "border-border focus:border-primary-blue"
                      }`}
                      autoFocus={false}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-gray/20 dark:bg-neutral-gray/10 rounded-2xl p-6 border border-border">
                  <h4 className="font-semibold text-foreground mb-4 text-lg">Password Requirements:</h4>
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-4 text-base ${
                        formData.password.length >= 8 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          formData.password.length >= 8 ? "bg-green-500" : "bg-neutral-gray"
                        }`}
                      ></div>
                      <span>At least 8 characters</span>
                    </div>
                    <div
                      className={`flex items-center gap-4 text-base ${
                        /[A-Z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-500" : "bg-neutral-gray"}`}
                      ></div>
                      <span>One uppercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-4 text-base ${
                        /[a-z]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${/[a-z]/.test(formData.password) ? "bg-green-500" : "bg-neutral-gray"}`}
                      ></div>
                      <span>One lowercase letter</span>
                    </div>
                    <div
                      className={`flex items-center gap-4 text-base ${
                        /[0-9]/.test(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-500" : "bg-neutral-gray"}`}
                      ></div>
                      <span>One number</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating Password...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap size={24} />
                      Update Password
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
