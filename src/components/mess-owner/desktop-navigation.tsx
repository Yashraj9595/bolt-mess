"use client"

import * as React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { MessOwnerSection } from "./mess-owner-dashboard"
import { useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Receipt,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChefHat,
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface DesktopNavigationProps {
  activeSection: MessOwnerSection
  onSectionChange: (section: MessOwnerSection) => void
}

export function DesktopNavigation({
  activeSection,
  onSectionChange,
}: DesktopNavigationProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      // Use React Router's navigate instead of window.location
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoggingOut(false)
    }
  }

  const navItems = [
    {
      id: "profile" as MessOwnerSection,
      label: "Profile",
      icon: <Users className="h-5 w-5" />,
      desc: "Your account"
    },
    {
      id: "dashboard" as MessOwnerSection,
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      desc: "Overview & metrics"
    },
    {
      id: "meals" as MessOwnerSection,
      label: "Meal Management",
      icon: <UtensilsCrossed className="h-5 w-5" />,
      desc: "Plans & menus"
    },
    {
      id: "users" as MessOwnerSection,
      label: "User Management",
      icon: <Users className="h-5 w-5" />,
      desc: "Members & staff"
    },
    {
      id: "billing" as MessOwnerSection,
      label: "Billing & Payments",
      icon: <Receipt className="h-5 w-5" />,
      desc: "Financial tracking"
    },
    {
      id: "leave" as MessOwnerSection,
      label: "Leave Management",
      icon: <CalendarDays className="h-5 w-5" />,
      desc: "Absence requests"
    },
    {
      id: "feedback" as MessOwnerSection,
      label: "Feedback",
      icon: <MessageSquare className="h-5 w-5" />,
      desc: "Reviews & complaints"
    },
    {
      id: "reports" as MessOwnerSection,
      label: "Reports & Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      desc: "Business insights"
    },
    {
      id: "settings" as MessOwnerSection,
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      desc: "System preferences"
    },
  ]

  return (
    <div className="w-80 bg-card/50 backdrop-blur-lg border-r border-border fixed top-0 bottom-0 left-0 z-40 flex flex-col">
      <div className="p-8 border-b border-border">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-2xl flex items-center justify-center shadow-lg">
            <ChefHat size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">MessHub</h1>
            <p className="text-base text-muted-foreground">Mess Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-blue/10 to-primary-blue/5 rounded-2xl border border-primary-blue/20">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-blue to-secondary-blue rounded-xl flex items-center justify-center">
            <Users size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">{user?.name || "Mess Owner"}</h3>
            <p className="text-sm text-muted-foreground">Mess Owner</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start p-4 h-auto rounded-2xl transition-all duration-300 ${
                activeSection === item.id
                  ? "bg-primary-blue/10 text-primary-blue border border-primary-blue/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              onClick={() => {
                if (item.id === "profile") {
                  navigate("/mess-owner/profile");
                } else {
                  onSectionChange(item.id);
                }
              }}
            >
              {item.icon}
              <div className="text-left ml-4">
                <div className="font-semibold text-base">{item.label}</div>
                <div className="text-sm opacity-70">{item.desc}</div>
              </div>
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="p-6 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start p-4 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            {isLoggingOut ? (
              <>
                <div className="h-5 w-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-4"></div>
                <span className="text-base">Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5 mr-4" />
                <span className="text-base">Sign Out</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
