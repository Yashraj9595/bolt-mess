"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { WifiOff, Home, RefreshCw, Database } from "lucide-react"
import { useRouter } from "next/navigation"

export function OfflineContent() {
  const router = useRouter()
  const [cachedPages, setCachedPages] = useState<string[]>([])
  const [isCheckingCache, setIsCheckingCache] = useState(false)

  // Check for available cached pages
  useEffect(() => {
    const checkCachedPages = async () => {
      if ('caches' in window) {
        setIsCheckingCache(true)
        try {
          const cache = await caches.open('messhub-v1')
          const keys = await cache.keys()
          const urls = keys
            .filter(request => request.url.includes(window.location.origin))
            .map(request => {
              const url = new URL(request.url)
              return url.pathname
            })
            .filter(url => url !== '/offline' && url !== '/' && url.length > 1)
            
          setCachedPages(Array.from(new Set(urls)))
        } catch (error) {
          console.error('Error checking cache:', error)
        } finally {
          setIsCheckingCache(false)
        }
      }
    }
    
    checkCachedPages()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-6 text-center space-y-6 dark:border-muted">
        <div className="flex justify-center">
          <WifiOff className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">You're Offline</h1>
          <p className="text-muted-foreground mt-2">
            Please check your internet connection and try again.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:hover:bg-primary/80"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/')}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" /> Go to Homepage
          </Button>
        </div>

        {isCheckingCache ? (
          <p className="text-sm text-muted-foreground">Checking for available offline content...</p>
        ) : cachedPages.length > 0 ? (
          <div className="space-y-2 border-t pt-4">
            <h2 className="text-sm font-medium flex items-center justify-center">
              <Database className="mr-2 h-4 w-4" /> Available Offline Content
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {cachedPages.slice(0, 5).map((url) => (
                <Button 
                  key={url} 
                  variant="secondary" 
                  size="sm"
                  onClick={() => router.push(url)}
                >
                  {url.split('/').filter(Boolean).join(' / ')}
                </Button>
              ))}
            </div>
          </div>
        ) : null}
        
        <p className="text-xs text-muted-foreground">
          Some features may be limited while you're offline.
          <br />
          Your data will sync automatically when you're back online.
        </p>
      </Card>
    </div>
  )
} 