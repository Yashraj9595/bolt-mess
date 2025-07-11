"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DesktopNavigation } from "./desktop-navigation"
import { MobileNavigation } from "./mobile-navigation"
import { DashboardOverview } from "./dashboard-overview"
import { MealManagement } from "./meal-management"
import { UserManagement } from "./user-management"
import { BillingPayments } from "./billing-payments"
import { LeaveManagement } from "./leave-management"
import { FeedbackComplaints } from "./feedback-complaints"
import { ReportsAnalytics } from "./reports-analytics"
import { SettingsScreen } from "./settings-screen"
import { useIsMobile } from "@/hooks/use-mobile"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useNavigate, Navigate } from "react-router-dom"
import { 
  Bell, 
  ChefHat,
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Receipt,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export type MessOwnerSection = 
  | "dashboard"
  | "meals"
  | "users"
  | "billing"
  | "leave"
  | "feedback"
  | "reports"
  | "settings"
  | "profile"

export function MessOwnerDashboard() {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState<MessOwnerSection>("dashboard")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }
  
  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />
      case "meals":
        return <MealManagement />
      case "users":
        return <UserManagement />
      case "billing":
        return <BillingPayments />
      case "leave":
        return <LeaveManagement />
      case "feedback":
        return <FeedbackComplaints />
      case "reports":
        return <ReportsAnalytics />
      case "settings":
        return <SettingsScreen />
      default:
        return <DashboardOverview />
    }
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard": return "Dashboard"
      case "meals": return "Meal Management"
      case "users": return "User Management"
      case "billing": return "Billing & Payments"
      case "leave": return "Leave Management"
      case "feedback": return "Feedback & Complaints"
      case "reports": return "Reports & Analytics"
      case "settings": return "Settings"
      default: return "Dashboard"
    }
  }

  const getSectionDescription = () => {
    switch (activeSection) {
      case "dashboard": return "Overview of your mess business"
      case "meals": return "Manage meal plans and menus"
      case "users": return "Manage your mess members"
      case "billing": return "Track payments and finances"
      case "leave": return "Manage leave requests"
      case "feedback": return "View and respond to feedback"
      case "reports": return "Business insights and analytics"
      case "settings": return "Configure your mess settings"
      default: return "Overview of your mess business"
    }
  }

  const mobileNavItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "meals", icon: UtensilsCrossed, label: "Meal" },
    { id: "users", icon: Users, label: "User" },
    { id: "billing", icon: Receipt, label: "Billing" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
      <div className="min-h-screen bg-gradient-to-br from-background via-neutral-gray/5 to-background">
        {/* Mobile Header */}
        {isMobile && activeSection === "dashboard" && (
          <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-full flex items-center justify-center">
                  <ChefHat size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">MessHub</h1>
                  <p className="text-sm text-muted-foreground">Mess Owner</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="relative">
                  <Bell size={20} className="text-muted-foreground" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </Button>
                <ThemeToggle />
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-red-500"
                >
                  {isLoggingOut ? (
                    <div className="h-4 w-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                  ) : (
                    <LogOut size={20} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className={`${isMobile ? "" : "flex min-h-screen"}`}>
          {/* Desktop Sidebar */}
          {!isMobile && <DesktopNavigation activeSection={activeSection} onSectionChange={setActiveSection} />}

          {/* Main Content */}
          <div className={`${isMobile ? "" : "ml-80 flex-1 flex flex-col"}`}>
            {/* Desktop Header */}
            {!isMobile && (
              <div className="sticky top-0 z-30 bg-card/95 backdrop-blur-lg border-b border-border">
                <div className="flex items-center justify-between p-8">
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">{getSectionTitle()}</h2>
                    <p className="text-lg text-muted-foreground">{getSectionDescription()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button size="lg" variant="ghost" className="relative">
                      <Bell size={24} className="text-muted-foreground" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        3
                      </div>
                    </Button>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className={`${isMobile ? "p-4 pb-24" : "flex-1 p-8 overflow-y-auto"}`}>
              {renderSection()}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border">
            <div className="grid grid-cols-5 gap-1 p-2">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveSection(item.id as MessOwnerSection)}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-primary-blue/10 text-primary-blue min-w-[100px]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={20} />
                    {activeSection === item.id && (
                      <span className="text-xs font-medium mt-1">{item.label}</span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
  )
}