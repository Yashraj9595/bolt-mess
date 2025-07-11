"use client"

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
  Settings,
  UserCircle
} from "lucide-react"

interface MobileNavigationProps {
  activeSection: MessOwnerSection
  onSectionChange: (section: MessOwnerSection) => void
}

export function MobileNavigation({
  activeSection,
  onSectionChange,
}: MobileNavigationProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  const navItems = [
    {
      id: "dashboard" as MessOwnerSection,
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/mess-owner/dashboard"
    },
    {
      id: "meals" as MessOwnerSection,
      label: "Meal",
      icon: <UtensilsCrossed className="h-5 w-5" />,
      path: "/mess-owner/dashboard"
    },
    {
      id: "users" as MessOwnerSection,
      label: "User",
      icon: <Users className="h-5 w-5" />,
      path: "/mess-owner/dashboard"
    },
    {
      id: "billing" as MessOwnerSection,
      label: "Billing",
      icon: <Receipt className="h-5 w-5" />,
      path: "/mess-owner/dashboard"
    },
    {
      id: "profile" as MessOwnerSection,
      label: "Profile",
      icon: <UserCircle className="h-5 w-5" />,
      path: "/mess-owner/profile"
    },
    {
      id: "settings" as MessOwnerSection,
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/mess-owner/settings"
    },
  ]

  const handleNavigation = (item: typeof navItems[0]) => {
    if (item.id === "profile") {
      navigate("/mess-owner/profile");
    } else if (item.id === "settings") {
      navigate("/mess-owner/settings");
    } else {
      // For dashboard sections, use the section change handler
      onSectionChange(item.id);
      if (window.location.pathname !== "/mess-owner/dashboard") {
        navigate("/mess-owner/dashboard");
      }
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg">
      <div className="grid grid-cols-5 gap-1 p-2">
        {navItems.slice(0, 5).map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => handleNavigation(item)}
            aria-label={item.label}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
              ${activeSection === item.id
                ? "bg-brand-primary/10 text-brand-primary min-w-[100px] font-semibold shadow-md"
                : "text-muted-foreground hover:text-brand-primary"}
            `}
          >
            {item.icon}
            <span className={`text-xs mt-1 ${activeSection === item.id ? "block" : "hidden"}`}>{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
