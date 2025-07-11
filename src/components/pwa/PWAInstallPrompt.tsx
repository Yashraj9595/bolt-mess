import { useState, useEffect } from "react"
import { usePWA } from "@/hooks/usePWA"
import { InstallButton } from "@/components/pwa/install-button"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Only show after a delay and if not dismissed previously
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        const hasDismissed = localStorage.getItem("pwa-prompt-dismissed")
        if (!hasDismissed) {
          setShowPrompt(true)
        }
      }, 5000) // 5 second delay
      
      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled, dismissed])

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem("pwa-prompt-dismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="p-4 border-primary-blue/20 bg-card/95 backdrop-blur-sm shadow-lg rounded-xl">
        <div className="flex items-center">
          <div className="flex-1 mr-4">
            <p className="text-sm font-medium">Install MessHub for a better experience!</p>
            <p className="text-xs text-muted-foreground">Access anytime, even offline</p>
          </div>
          <div className="flex items-center gap-2">
            <InstallButton
              variant="default"
              className="text-white text-xs py-1.5 px-3" 
              showLabel={true}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X size={16} />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 