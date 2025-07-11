"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Users, Zap, Shield, Phone } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

interface RegisterFormProps {
  formData: RegisterFormData
  errors: Record<string, string>
  isLoading: boolean
  onBack: () => void
  onSubmit: (e?: React.FormEvent) => void
  onNavigateToLogin: () => void
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  onPhoneChange: (value: string) => void
  setErrors: (errors: Record<string, string>) => void
}

export function RegisterForm({
  formData,
  errors,
  isLoading,
  onBack,
  onSubmit,
  onNavigateToLogin,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onPhoneChange,
  setErrors
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { isMobileDevice } = useTheme()

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

  const handleEmailChange = (value: string) => {
    const error = validateEmail(value);
    if (error) {
      setErrors({ ...errors, email: error });
    } else {
      const newErrors = { ...errors };
      delete newErrors.email;
      setErrors(newErrors);
    }
    onEmailChange(value);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-4" encType="application/x-www-form-urlencoded">
        <div className="space-y-2">
          <Label htmlFor="register-name" className="text-foreground font-semibold flex items-center gap-2">
            <Users size={16} className="text-primary-blue" />
            Full Name
          </Label>
          <div className="relative">
            <Input
              id="mobile-register-name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => onNameChange(e.target.value)}
              autoComplete="name"
              className={`bg-background border-2 rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-border focus:border-primary-blue"
              }`}
              autoFocus={false}
            />
            {errors.name && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <AlertCircle size={16} className="text-red-500" />
              </div>
            )}
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email" className="text-foreground font-semibold flex items-center gap-2">
            <Mail size={16} className="text-primary-blue" />
            Email Address
          </Label>
          <div className="relative">
            <Input
              id="mobile-register-email"
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

        <div className="space-y-2">
          <Label htmlFor="register-phone" className="text-foreground font-semibold flex items-center gap-2">
            <Phone size={16} className="text-primary-blue" />
            Phone Number
          </Label>
          <div className="relative">
            <Input
              id="mobile-register-phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => onPhoneChange(e.target.value)}
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

        <div className="space-y-2">
          <Label htmlFor="register-password" className="text-foreground font-semibold flex items-center gap-2">
            <Lock size={16} className="text-primary-blue" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="mobile-register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoComplete="new-password"
              className={`bg-background border-2 rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
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
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
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

        <div className="space-y-2">
          <Label htmlFor="register-confirm-password" className="text-foreground font-semibold flex items-center gap-2">
            <Lock size={16} className="text-primary-blue" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="mobile-register-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              autoComplete="new-password"
              className={`bg-background border-2 rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground transition-all duration-300 focus:shadow-lg ${
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
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary-blue transition-colors duration-300 p-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-primary hover:shadow-xl text-white rounded-xl py-4 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating Account...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap size={20} />
              Create Account
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
            {"Already have an account? "}
            <Button
              type="button"
              variant="ghost"
              onClick={onNavigateToLogin}
              className="text-primary-blue hover:text-dark-blue hover:bg-transparent p-0 h-auto font-semibold"
            >
              Sign In
            </Button>
          </p>
        </div>
      </form>
    </div>
  )
} 