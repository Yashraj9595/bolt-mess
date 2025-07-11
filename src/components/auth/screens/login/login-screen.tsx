"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ChefHat,
  Users,
  Star,
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle,
  Phone,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "../../types/auth.types"

interface LoginScreenProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
  state?: { message?: string }
}

export function LoginScreen({ onNavigate, state }: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(state?.message || "")
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email")

  const { login } = useAuth()
  
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
      setErrors(prev => ({ ...prev, email: error }));
    } else {
      setErrors(prev => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
    setFormData(prev => ({ ...prev, email: value }));
  }, []);
  
  const handlePasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, password: value }))
  }, [])

  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }))
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (loginMethod === "email") {
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email"
      }
    } else {
      if (!formData.phone) {
        newErrors.phone = "Phone number is required"
      } else if (!/^\+?[\d\s-]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number"
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleLogin function to properly handle errors
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      // For now, we'll use email for login since the backend expects email
      const loginIdentifier = loginMethod === "email" ? formData.email.trim() : formData.phone.trim()
      
      // Store email for potential OTP verification
      if (loginMethod === "email") {
        localStorage.setItem("auth_email", loginIdentifier)
        sessionStorage.setItem("auth_email", loginIdentifier)
      }
      
      console.log('Login attempt:', {
        identifier: loginIdentifier,
        method: loginMethod,
        passwordLength: formData.password.length
      })
      
      // Login attempt - errors will be thrown from auth context
      const success = await login(loginIdentifier, formData.password)
      
      // If we get here and success is true, login was successful
      // The user will be automatically redirected by the RootClientWrapper
      // No need to navigate manually here
      
      // If we get here and success is false, something went wrong but no error was thrown
      if (!success) {
        throw new Error("Login failed. Please check your credentials and try again.")
      }
    } catch (error: any) {
      console.error("Login error:", error.message)
      
      // Handle specific error cases
      if (error.message?.toLowerCase().includes("not verified")) {
        // If account not verified, redirect to OTP verification
        onNavigate("otp-verification", {
          email: loginMethod === "email" ? formData.email.trim() : formData.phone.trim(),
          resetFlow: false
        })
        return
      }
      
      // Set specific field error if possible, otherwise general error
      if (error.message?.toLowerCase().includes("password")) {
        setErrors({ password: error.message })
      } else if (error.message?.toLowerCase().includes("email")) {
        setErrors({ email: error.message })
      } else {
        setErrors({ [loginMethod]: error.message || "Login failed. Please try again." })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-background via-neutral-gray/10 to-background">
        {/* Mobile Curved Header */}
        <div className="fixed top-0 left-0 right-0 z-10">
          <div className="relative gradient-primary h-80 rounded-b-[60px] shadow-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-b-[60px]"></div>

            <div className="relative z-10 flex items-center justify-between p-6 pt-16">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate("welcome")}
                className="text-white hover:bg-white/20 rounded-full p-3 transition-all duration-300"
              >
                <ArrowLeft size={20} />
              </Button>
              <ThemeToggle />
            </div>

            <div className="relative z-10 px-6 pb-8">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-4">
                <ChefHat size={16} className="text-white" />
                <span className="text-sm font-medium text-white">MessHub Platform</span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">Welcome Back</h1>
              <p className="text-white/90 text-lg font-medium">Sign in to continue your culinary journey</p>
            </div>

            <div className="absolute top-20 right-8 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 left-8 w-20 h-20 bg-white/10 rounded-full blur-lg animate-pulse animation-delay-1000"></div>
          </div>
        </div>

        {/* Mobile Form */}
        <div className="fixed bottom-0 left-0 right-0 top-80 px-6 z-20">
          <div className="h-full -mt-8">
            <Card className="bg-card/95 backdrop-blur-lg rounded-3xl shadow-2xl border-0 h-full flex flex-col animate-slide-up">
              <div className="flex-1 overflow-y-auto p-8">
                {/* Mobile Platform Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-3 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 rounded-xl border border-primary-blue/20">
                    <Users size={20} className="text-primary-blue mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">25K+</div>
                    <div className="text-xs text-muted-foreground">Users</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-secondary-blue/10 to-secondary-blue/5 rounded-xl border border-secondary-blue/20">
                    <ChefHat size={20} className="text-secondary-blue mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">500+</div>
                    <div className="text-xs text-muted-foreground">Kitchens</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-xl border border-yellow-500/20">
                    <Star size={20} className="text-yellow-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-foreground">4.9</div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20 mb-6">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {successMessage}
                    </span>
                  </div>
                )}

                {/* Mobile Form Fields */}
                <form onSubmit={handleLogin} className="space-y-6" encType="application/x-www-form-urlencoded">
                  {/* Login Method Toggle */}
                  <div className="flex items-center justify-center gap-2 p-1 bg-neutral-gray/20 rounded-xl">
                    <Button
                      type="button"
                      variant={loginMethod === "email" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setLoginMethod("email")}
                      className={`rounded-lg transition-all duration-300 ${
                        loginMethod === "email" 
                          ? "gradient-primary text-white shadow-lg" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Mail size={16} className="mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={loginMethod === "phone" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setLoginMethod("phone")}
                      className={`rounded-lg transition-all duration-300 ${
                        loginMethod === "phone" 
                          ? "gradient-primary text-white shadow-lg" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Phone size={16} className="mr-2" />
                      Phone
                    </Button>
                  </div>

                  {loginMethod === "email" ? (
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground font-semibold flex items-center gap-2">
                        <Mail size={16} className="text-primary-blue" />
                        Email Address
                      </Label>
                      <div className="relative">
                        <Input
                          id="mobile-login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          autoComplete="email"
                          className={`bg-background border-2 rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : "border-border focus:border-primary-blue"
                          }`}
                          autoFocus={false}
                        />
                        {errors.email && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertCircle size={16} className="text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="login-phone" className="text-foreground font-semibold flex items-center gap-2">
                        <Phone size={16} className="text-primary-blue" />
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Input
                          id="mobile-login-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          autoComplete="tel"
                          className={`bg-background border-2 rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                            errors.phone
                              ? "border-red-500 focus:border-red-500"
                              : "border-border focus:border-primary-blue"
                          }`}
                          autoFocus={false}
                        />
                        {errors.phone && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <AlertCircle size={16} className="text-red-500" />
                          </div>
                        )}
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle size={12} />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground font-semibold flex items-center gap-2">
                      <Lock size={16} className="text-primary-blue" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="mobile-login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        autoComplete="current-password"
                        className={`bg-background border-2 rounded-xl py-3 px-4 pr-12 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onNavigate("forgot-password")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold"
                    >
                      Forgot Password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full gradient-primary hover:shadow-xl text-white rounded-xl py-4 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap size={20} />
                        Sign In to MessHub
                      </div>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <Shield size={16} className="text-green-500" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Secured with 256-bit encryption
                    </span>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-muted-foreground">
                      {"Don't have an account? "}
                      <Button
                        variant="ghost"
                        onClick={() => onNavigate("register")}
                        className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold"
                      >
                        Create Account
                      </Button>
                    </p>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-background via-neutral-gray/5 to-background">
        {/* Desktop Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-primary-blue/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-secondary-blue/8 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        </div>

        {/* Desktop Left Panel - Branding */}
        <div className="flex-1 flex items-center justify-center p-16 relative z-10">
          <div className="max-w-2xl space-y-12 animate-fade-in">
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <ChefHat size={48} className="text-white" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Zap size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-6xl font-black bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Continue your culinary journey</p>
                </div>
              </div>

              {/* Desktop Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 rounded-3xl border border-primary-blue/20">
                  <Users size={32} className="text-primary-blue mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground">25K+</div>
                  <div className="text-lg text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-secondary-blue/10 to-secondary-blue/5 rounded-3xl border border-secondary-blue/20">
                  <Globe size={32} className="text-secondary-blue mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground">500+</div>
                  <div className="text-lg text-muted-foreground">Partner Kitchens</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-3xl border border-yellow-500/20">
                  <Award size={32} className="text-yellow-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground">4.9</div>
                  <div className="text-lg text-muted-foreground">User Rating</div>
                </div>
              </div>
            </div>

            {/* Desktop Features */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">Why Choose MessHub?</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Shield size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Enterprise Security</h3>
                    <p className="text-muted-foreground">Bank-level encryption and security protocols</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card/50 rounded-2xl border border-border/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Lightning Fast</h3>
                    <p className="text-muted-foreground">Optimized for speed and performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Panel - Login Form */}
        <div className="w-[600px] flex items-center justify-center p-16 relative z-10">
          <div className="absolute top-8 right-8">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-lg bg-card/95 backdrop-blur-lg rounded-4xl p-12 shadow-2xl border-0 animate-slide-up">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-foreground">Sign In</h2>
                <p className="text-xl text-muted-foreground">Access your MessHub account</p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="text-base font-medium text-green-700 dark:text-green-400">
                    {successMessage}
                  </span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6" encType="application/x-www-form-urlencoded">
                {/* Login Method Toggle */}
                <div className="flex items-center justify-center gap-3 p-2 bg-neutral-gray/20 rounded-2xl">
                  <Button
                    type="button"
                    variant={loginMethod === "email" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLoginMethod("email")}
                    className={`rounded-xl transition-all duration-300 ${
                      loginMethod === "email" 
                        ? "gradient-primary text-white shadow-lg" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Mail size={18} className="mr-2" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={loginMethod === "phone" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setLoginMethod("phone")}
                    className={`rounded-xl transition-all duration-300 ${
                      loginMethod === "phone" 
                        ? "gradient-primary text-white shadow-lg" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Phone size={18} className="mr-2" />
                    Phone
                  </Button>
                </div>

                {loginMethod === "email" ? (
                  <div className="space-y-3">
                    <Label
                      htmlFor="desktop-login-email"
                      className="text-lg font-semibold text-foreground flex items-center gap-3"
                    >
                      <Mail size={20} className="text-primary-blue" />
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="desktop-login-email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        autoComplete="email"
                        className={`bg-background border-2 rounded-2xl py-4 px-6 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                          errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                        }`}
                        autoFocus={false}
                      />
                      {errors.email && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <AlertCircle size={20} className="text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-base flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Label
                      htmlFor="desktop-login-phone"
                      className="text-lg font-semibold text-foreground flex items-center gap-3"
                    >
                      <Phone size={20} className="text-primary-blue" />
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Input
                        id="desktop-login-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        autoComplete="tel"
                        className={`bg-background border-2 rounded-2xl py-4 px-6 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                          errors.phone ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
                        }`}
                        autoFocus={false}
                      />
                      {errors.phone && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <AlertCircle size={20} className="text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-base flex items-center gap-2">
                        <AlertCircle size={16} />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <Label
                    htmlFor="desktop-login-password"
                    className="text-lg font-semibold text-foreground flex items-center gap-3"
                  >
                    <Lock size={20} className="text-primary-blue" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="desktop-login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      autoComplete="current-password"
                      className={`bg-background border-2 rounded-2xl py-4 px-6 pr-16 text-lg text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                        errors.password ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary-blue"
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
                  {errors.password && (
                    <p className="text-red-500 text-base flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onNavigate("forgot-password")}
                    className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-base"
                  >
                    Forgot Password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap size={24} />
                      Sign In to MessHub
                    </div>
                  )}
                </Button>

                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <div className="flex items-center justify-center gap-3">
                    <Shield size={20} className="text-green-500" />
                    <span className="text-base font-medium text-green-700 dark:text-green-400">
                      Secured with 256-bit encryption
                    </span>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-lg text-muted-foreground">
                    {"Don't have an account? "}
                    <Button
                      variant="ghost"
                      onClick={() => onNavigate("register")}
                      className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold text-lg"
                    >
                      Create Account
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