"use client"

import { ChefHat } from "lucide-react"

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export function LoadingScreen({ message = "Loading your experience...", showLogo = true }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-neutral-gray/10 to-background flex flex-col items-center justify-center">
      {showLogo && (
        <>
          <div className="relative w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow mb-8">
            <ChefHat size={48} className="text-white animate-bounce" />
            <div className="absolute inset-0 border-4 border-primary-blue/30 rounded-3xl animate-ping"></div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent mb-4">
            MessHub
          </h1>
        </>
      )}
      
      <div className="relative w-48 h-2 bg-neutral-gray/20 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-primary-blue animate-loading-progress rounded-full"></div>
      </div>
      
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  )
} 