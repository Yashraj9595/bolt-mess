"use client"

import { Card } from "@/components/ui/card"
import { ChefHat, User, Check } from "lucide-react"
import { useTheme } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"

type UserRole = "user" | "mess-owner"

interface RoleOption {
  id: UserRole
  title: string
  description: string
  icon: React.ReactNode
  bgColor: string
  iconColor: string
}

interface RegisterRoleSelectionProps {
  onRoleSelect: (role: UserRole) => void
  selectedRole?: UserRole
}

export function RegisterRoleSelection({ onRoleSelect, selectedRole }: RegisterRoleSelectionProps) {
  const { isMobileDevice } = useTheme()
  
  const roleOptions: RoleOption[] = [
    {
      id: "user",
      title: "Food Lover",
      description: "Browse menus and place orders",
      icon: <User size={isMobileDevice ? 24 : 28} className="text-white" />,
      bgColor: "from-blue-500 to-blue-600",
      iconColor: "text-blue-500"
    },
    {
      id: "mess-owner",
      title: "Mess Owner",
      description: "Manage your kitchen and orders",
      icon: <ChefHat size={isMobileDevice ? 24 : 28} className="text-white" />,
      bgColor: "from-green-500 to-green-600",
      iconColor: "text-green-500"
    }
  ]
  
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {roleOptions.map((role) => (
          <Card 
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            className={`p-5 cursor-pointer transition-all duration-300 flex items-center gap-4 hover:shadow-lg ${
              selectedRole === role.id 
                ? "border-2 border-primary-blue bg-primary-blue/5 transform scale-[1.02]" 
                : "hover:border-primary-blue/50"
            }`}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${role.bgColor} rounded-xl flex items-center justify-center shadow-md`}>
              {role.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{role.title}</h3>
              <p className="text-muted-foreground">{role.description}</p>
            </div>
            {selectedRole === role.id ? (
              <div className="w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-muted-foreground/30 rounded-full"></div>
            )}
          </Card>
        ))}
      </div>

      {selectedRole && (
        <Button
          onClick={() => onRoleSelect(selectedRole)}
          className="w-full gradient-primary hover:shadow-xl text-white rounded-xl py-4 text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Continue
        </Button>
      )}
    </div>
  )
} 