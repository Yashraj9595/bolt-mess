"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { InstallButton } from "@/components/pwa/install-button"
import {
  ChefHat,
  Sparkles,
  TrendingUp,
  Store,
  Star,
  Clock,
  Utensils,
  Shield,
  Users,
  Zap,
  Award,
  Globe,
  Heart,
} from "lucide-react"
import { AuthScreen } from "../../types/auth.types"

interface WelcomeScreenProps {
  onNavigate: (screen: AuthScreen) => void
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-neutral-gray/20 to-background">
        {/* Mobile Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-blue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-blue/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary-blue/5 to-transparent rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md bg-card/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-0 relative z-10 animate-fade-in">
          <div className="text-center space-y-6">
            {/* Mobile Logo */}
            <div className="space-y-4">
              <div className="relative mx-auto w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                <ChefHat size={48} className="text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="absolute inset-0 border-4 border-primary-blue/30 rounded-3xl animate-ping"></div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent">
                  MessHub                </h1>
                <p className="text-muted-foreground font-medium text-base">Your Complete Mess Management Solution</p>

                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-primary-blue/10 px-3 py-1 rounded-full">
                    <Star size={14} className="text-primary-blue" />
                    <span className="font-medium text-primary-blue">4.9 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary-blue/10 px-3 py-1 rounded-full">
                    <Users size={14} className="text-secondary-blue" />
                    <span className="font-medium text-secondary-blue">25K+ Users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300 border border-primary-blue/20">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-dark-blue rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Utensils className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold text-foreground">Smart Ordering</p>
                <p className="text-xs text-muted-foreground mt-1">AI-powered recommendations</p>
              </div>

              <div className="bg-gradient-to-br from-secondary-blue/10 to-secondary-blue/5 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300 border border-secondary-blue/20">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary-blue to-primary-blue rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Store className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold text-foreground">Kitchen Management</p>
                <p className="text-xs text-muted-foreground mt-1">Complete control panel</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300 border border-green-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold text-foreground">Analytics</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time insights</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-4 text-center hover:scale-105 transition-all duration-300 border border-purple-500/20">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <Shield className="text-white" size={20} />
                </div>
                <p className="text-sm font-semibold text-foreground">Secure</p>
                <p className="text-xs text-muted-foreground mt-1">Bank-level security</p>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => onNavigate("login")}
                className="w-full gradient-primary hover:shadow-lg text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                <Zap size={20} className="mr-2" />
                Sign In to MessHub              </Button>
              <Button
                onClick={() => onNavigate("register")}
                variant="outline"
                className="w-full border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white rounded-2xl py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Create New Account
              </Button>
            </div>

                          {/* Mobile Footer */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure & Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={12} />
                  <span>GDPR Compliant</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">By continuing, you agree to our Terms & Privacy Policy</p>
              
              {/* Install PWA Button */}
              <div className="pt-2">
                <InstallButton 
                  className="w-full text-sm py-2" 
                  variant="outline"                   showLabel={true}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-background via-neutral-gray/10 to-background">
        {/* Desktop Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-60 -right-60 w-[600px] h-[600px] bg-primary-blue/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-secondary-blue/8 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-blue/3 to-transparent rounded-full blur-3xl animate-pulse animation-delay-500"></div>

          {/* Desktop floating elements */}
          <div className="absolute top-32 left-32 w-4 h-4 bg-primary-blue/20 rounded-full animate-bounce animation-delay-200"></div>
          <div className="absolute top-64 right-48 w-6 h-6 bg-secondary-blue/30 rounded-full animate-bounce animation-delay-500"></div>
          <div className="absolute bottom-48 left-1/3 w-3 h-3 bg-primary-blue/15 rounded-full animate-bounce animation-delay-1000"></div>
        </div>

        {/* Desktop Left Panel - Hero Section */}
        <div className="flex-1 flex items-center justify-center p-12 relative z-10">
          <div className="max-w-2xl space-y-12 animate-fade-in">
            {/* Desktop Logo and Branding */}
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 gradient-primary rounded-4xl flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <ChefHat size={64} className="text-white" />
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div className="absolute inset-0 border-4 border-primary-blue/30 rounded-4xl animate-ping"></div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-7xl font-black bg-gradient-to-r from-primary-blue via-secondary-blue to-dark-blue bg-clip-text text-transparent leading-tight">
                    MessHub                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium">Your Complete Mess Management Solution</p>
                </div>
              </div>

              {/* Desktop Trust Indicators */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 bg-primary-blue/10 px-6 py-3 rounded-2xl border border-primary-blue/20">
                  <Star size={20} className="text-primary-blue" />
                  <div>
                    <div className="text-lg font-bold text-primary-blue">4.9</div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-secondary-blue/10 px-6 py-3 rounded-2xl border border-secondary-blue/20">
                  <Users size={20} className="text-secondary-blue" />
                  <div>
                    <div className="text-lg font-bold text-secondary-blue">25K+</div>
                    <div className="text-sm text-muted-foreground">Users</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-500/10 px-6 py-3 rounded-2xl border border-green-500/20">
                  <Award size={20} className="text-green-500" />
                  <div>
                    <div className="text-lg font-bold text-green-500">500+</div>
                    <div className="text-sm text-muted-foreground">Kitchens</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Features Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-primary-blue/10 to-primary-blue/5 rounded-3xl p-8 hover:scale-105 transition-all duration-300 border border-primary-blue/20 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-dark-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Utensils className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Smart Ordering</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-powered recommendations and intelligent order management system
                </p>
              </div>

              <div className="bg-gradient-to-br from-secondary-blue/10 to-secondary-blue/5 rounded-3xl p-8 hover:scale-105 transition-all duration-300 border border-secondary-blue/20 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-blue to-primary-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Store className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Kitchen Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Complete control panel for managing your kitchen operations
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-3xl p-8 hover:scale-105 transition-all duration-300 border border-green-500/20 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <TrendingUp className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Analytics & Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time analytics and business intelligence dashboard
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-3xl p-8 hover:scale-105 transition-all duration-300 border border-purple-500/20 group cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                  <Shield className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Enterprise Security</h3>
                <p className="text-muted-foreground leading-relaxed">Bank-level security with end-to-end encryption</p>
              </div>
            </div>

            {/* Desktop Additional Features */}
            <div className="flex items-center justify-center gap-12 text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-lg">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={18} />
                <span className="text-lg">Global Coverage</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart size={18} />
                <span className="text-lg">Customer Loved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Right Panel - Auth Card */}
        <div className="w-[600px] flex items-center justify-center p-12 relative z-10">
          <div className="absolute top-8 right-8">
            <ThemeToggle />
          </div>

          <Card className="w-full max-w-lg bg-card/95 backdrop-blur-lg rounded-4xl p-12 shadow-2xl border-0 animate-slide-up">
            <div className="text-center space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-foreground">Get Started Today</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join thousands of satisfied customers and transform your mess management experience
                </p>
              </div>

              {/* Desktop Action Buttons */}
              <div className="space-y-6">
                <Button
                  onClick={() => onNavigate("login")}
                  className="w-full gradient-primary hover:shadow-2xl text-white rounded-2xl py-6 text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 border-0"
                >
                  <Zap size={24} className="mr-3" />
                  Sign In to MessHub                </Button>
                <Button
                  onClick={() => onNavigate("register")}
                  variant="outline"
                  className="w-full border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white rounded-2xl py-6 text-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Create New Account
                </Button>
              </div>

              {/* Desktop Security Features */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="text-center p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <Shield size={24} className="text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-green-700 dark:text-green-400">Secure & Safe</div>
                </div>
                <div className="text-center p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <Clock size={24} className="text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-blue-700 dark:text-blue-400">24/7 Support</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-6 border-t border-border">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
              
              {/* Desktop Install Button */}
              <div className="pt-6">
                <InstallButton 
                  className="w-full py-3" 
                  variant="outline" 
                  showLabel={true}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
