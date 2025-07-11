"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { ChefHat, Users, ArrowLeft, Zap, Shield, Globe, Award, Star } from "lucide-react"
import { useAuth, RegisterData } from "@/contexts/auth-context"
import { useTheme } from "@/components/theme/theme-provider"
import { RegisterRoleSelection } from "@/components/auth/screens/register/register-role-selection"
import { RegisterForm } from "@/components/auth/screens/register/register-form"
import { toast } from "sonner"
import { AuthScreen } from "../../types/auth.types"

interface RegisterScreenProps {
  onNavigate: (screen: AuthScreen, state?: any) => void
}

export function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "user" as "user" | "mess-owner"
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState<"role" | "details">("role")
  const [isLoading, setIsLoading] = useState(false)
  
  const { register } = useAuth()
  const { isMobileDevice } = useTheme()
  
  // Use stable callbacks for form updates to prevent cursor jumping
  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, name: value }))
  }, [])
  
  const handleEmailChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, email: value }))
  }, [])
  
  const handlePasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, password: value }))
  }, [])
  
  const handleConfirmPasswordChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, confirmPassword: value }))
  }, [])
  
  const handlePhoneChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, phone: value }))
  }, [])
  
  const handleRoleSelect = useCallback((role: "user" | "mess-owner") => {
    setFormData(prev => ({ ...prev, role }))
    setCurrentStep("details")
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = "Full name is required"
    } else if (formData.name.length < 2 || formData.name.length > 50) {
      newErrors.name = "Name must be between 2 and 50 characters"
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters and spaces"
    }

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address (e.g., name@example.com)"
    }

    if (formData.phone && !/^\+?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleRegister function to properly handle errors
  const handleRegister = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      })
      
      if (success) {
        // Store role information for redirection after verification
        localStorage.setItem("auth_role", formData.role)
        sessionStorage.setItem("auth_role", formData.role)
        
        // Navigate to OTP verification with registration data
        onNavigate("otp-verification", {
          email: formData.email,
          password: formData.password, // Pass password for auto-login after verification
          name: formData.name,
          role: formData.role
        })
      } else {
        setErrors({ email: "Registration failed. Please try again." })
      }
    } catch (error: any) {
      if (error.message.includes("already registered")) {
        setErrors({ email: "This email is already registered. Please sign in or use a different email." })
      } else {
        setErrors({ email: error.message || "Registration failed. Please try again." })
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
                onClick={() => currentStep === "role" ? onNavigate("welcome") : setCurrentStep("role")}
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
              <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">Join MessHub</h1>
              <p className="text-white/90 text-lg font-medium">Create your account to get started</p>
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

                {/* Mobile Form Content */}
                <div className="space-y-6">
                  {currentStep === "role" ? (
                    <RegisterRoleSelection 
                      onRoleSelect={handleRoleSelect}
                      selectedRole={formData.role}
                    />
                  ) : (
                    <RegisterForm
                      formData={{
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        confirmPassword: formData.confirmPassword,
                        phone: formData.phone
                      }}
                      errors={errors}
                      isLoading={isLoading}
                      onBack={() => setCurrentStep("role")}
                      onSubmit={handleRegister}
                      onNavigateToLogin={() => onNavigate("login")}
                      onNameChange={handleNameChange}
                      onEmailChange={handleEmailChange}
                      onPasswordChange={handlePasswordChange}
                      onConfirmPasswordChange={handleConfirmPasswordChange}
                      onPhoneChange={handlePhoneChange}
                      setErrors={setErrors}
                    />
                  )}
                </div>
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
                    Join MessHub
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium mt-2">Start your culinary journey</p>
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

        {/* Desktop Right Panel - Form */}
        <div className="w-[600px] flex items-center justify-center p-16 relative z-10">
          <div className="absolute top-8 right-8">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-lg bg-card/95 backdrop-blur-lg rounded-4xl p-12 shadow-2xl border-0 animate-slide-up">
            <div className="space-y-8">
              {currentStep === "role" ? (
                <div>
                  <div className="flex items-center mb-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto mr-4"
                      onClick={() => onNavigate("welcome")}
                    >
                      <ArrowLeft size={24} className="text-muted-foreground" />
                    </Button>
                    <div className="flex-1 text-center">
                      <h2 className="text-4xl font-bold text-foreground">Create Account</h2>
                      <p className="text-xl text-muted-foreground">Choose your role to get started</p>
                    </div>
                  </div>
                  <RegisterRoleSelection 
                    onRoleSelect={handleRoleSelect}
                    selectedRole={formData.role}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-8">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto mr-4"
                      onClick={() => setCurrentStep("role")}
                    >
                      <ArrowLeft size={24} className="text-muted-foreground" />
                    </Button>
                    <div className="flex-1 text-center">
                      <h2 className="text-4xl font-bold text-foreground">Create Your Account</h2>
                      <p className="text-xl text-muted-foreground">Fill in your details to get started</p>
                    </div>
                  </div>
                  <RegisterForm
                    formData={{
                      name: formData.name,
                      email: formData.email,
                      password: formData.password,
                      confirmPassword: formData.confirmPassword,
                      phone: formData.phone
                    }}
                    errors={errors}
                    isLoading={isLoading}
                    onBack={() => setCurrentStep("role")}
                    onSubmit={handleRegister}
                    onNavigateToLogin={() => onNavigate("login")}
                    onNameChange={handleNameChange}
                    onEmailChange={handleEmailChange}
                    onPasswordChange={handlePasswordChange}
                    onConfirmPasswordChange={handleConfirmPasswordChange}
                    onPhoneChange={handlePhoneChange}
                    setErrors={setErrors}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 