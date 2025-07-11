"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ChefHat, User, Shield, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

/**
 * QuickLoginScreen - A development-only component for quick access to different user roles
 * 
 * This component provides buttons to directly log in as:
 * - Regular User
 * - Mess Owner
 * - Admin
 * 
 * Each button automatically logs in with predefined credentials and redirects to the appropriate dashboard.
 */
export function QuickLoginScreen() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const navigate = useNavigate()

  const accounts = [
    {
      id: "user",
      name: "Regular User",
      email: "user@gmail.com",
      password: "123456",
      icon: <User className="h-6 w-6" />,
      redirectTo: "/user/dashboard",
      color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
    },
    {
      id: "mess",
      name: "Mess Owner",
      email: "mess@gmail.com",
      password: "123456",
      icon: <ChefHat className="h-6 w-6" />,
      redirectTo: "/mess-owner/dashboard",
      color: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
    },
    {
      id: "admin",
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456",
      icon: <Shield className="h-6 w-6" />,
      redirectTo: "/admin/dashboard",
      color: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
    }
  ]

  const handleQuickLogin = async (account: typeof accounts[0]) => {
    setIsLoading(account.id)
    try {
      // Use the login method from auth context
      await login(account.email, account.password)
      
      // Redirect to dashboard after successful login
      navigate(account.redirectTo)
    } catch (error) {
      console.error("Quick login failed:", error)
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-neutral-gray/5 to-background p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-3xl font-bold">Developer Mode</CardTitle>
          <CardDescription className="text-lg">
            Quick access to different user roles
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="space-y-4 py-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-sm">
              <p className="font-semibold">Development Only</p>
              <p>This screen is for development purposes only. It allows quick access to different user roles.</p>
            </div>
            
            <div className="space-y-3 mt-6">
              {accounts.map(account => (
                <Button
                  key={account.id}
                  onClick={() => handleQuickLogin(account)}
                  disabled={isLoading !== null}
                  className={`w-full py-6 justify-between text-white bg-gradient-to-r ${account.color} transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]`}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-full p-2">
                      {account.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{account.name}</div>
                      <div className="text-xs opacity-90">{account.email}</div>
                    </div>
                  </div>
                  
                  {isLoading === account.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex-col gap-2">
          <p className="text-xs text-center text-muted-foreground">
            All accounts use the password: <span className="font-mono bg-muted px-1 py-0.5 rounded">123456</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 