'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePWAInstall } from "@/hooks/use-pwa-install";
import { Download, X, Smartphone } from "lucide-react";
import { InstallButton } from "./install-button";

export function InstallPrompt() {
  const { 
    canInstall, 
    isIOS, 
    isSafari,
    showPrompt, 
    dismissPrompt, 
    showIOSInstructions 
  } = usePWAInstall();

  // Don't render anything if we can't install or shouldn't show the prompt
  if ((!canInstall && !isIOS) || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe-area-inset-bottom animate-slide-up">
      <Card className="relative p-4 shadow-lg border-primary/20 bg-card/95 backdrop-blur-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2" 
          onClick={dismissPrompt}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            {isIOS ? (
              <Smartphone className="h-6 w-6 text-primary" />
            ) : (
              <Download className="h-6 w-6 text-primary" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Install MessHub App</h3>
            <p className="text-sm text-muted-foreground">
              {isIOS && isSafari 
                ? "Add to your home screen for the best experience" 
                : "Install our app for faster access and offline features"}
            </p>
          </div>
          
          <InstallButton variant="default" />
        </div>
      </Card>
    </div>
  );
} 