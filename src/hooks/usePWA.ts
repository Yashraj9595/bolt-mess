"use client"

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface UsePWAResult {
  isInstallable: boolean
  isInstalled: boolean
  isStandalone: boolean
  isIOS: boolean
  installPrompt: BeforeInstallPromptEvent | null
  promptInstall: () => Promise<void>
}

export function usePWA(): UsePWAResult {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Check if already running in standalone mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://')
    
    setIsStandalone(isRunningStandalone)
    if (isRunningStandalone) {
      setIsInstalled(true)
    }

    // Store the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Listen for installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    })
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Function to prompt the user to install the app
  const promptInstall = async () => {
    if (!installPrompt) return
    
    await installPrompt.prompt()
    
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  return {
    isInstallable: !!installPrompt || (isIOS && !isStandalone),
    isInstalled,
    isStandalone,
    isIOS,
    installPrompt,
    promptInstall
  }
}