"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface PWAStatusProps {
  isOnline: boolean
}

export function PWAStatus({ isOnline }: PWAStatusProps) {
  const [visible, setVisible] = useState(false)
  const [hiding, setHiding] = useState(false)
  
  useEffect(() => {
    // Show the status indicator when online status changes
    setVisible(true)
    setHiding(false)
    
    // Hide after 3 seconds
    const hideTimer = setTimeout(() => {
      setHiding(true)
      
      // Remove from DOM after animation completes
      const removeTimer = setTimeout(() => {
        setVisible(false)
      }, 300) // match transition duration
      
      return () => clearTimeout(removeTimer)
    }, 3000)
    
    return () => clearTimeout(hideTimer)
  }, [isOnline])
  
  if (!visible) return null
  
  return (
    <div 
      className={cn(
        "fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-all duration-300",
        isOnline 
          ? "bg-green-500/90 text-white" 
          : "bg-red-500/90 text-white",
        hiding ? "translate-y-[-20px] opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
} 