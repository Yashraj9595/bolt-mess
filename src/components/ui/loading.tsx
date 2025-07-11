"use client";

import { ChefHat, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 16 }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin", className)}
      size={size}
    />
  );
}

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
  className?: string;
}

export function LoadingScreen({ message = "Loading your experience...", showLogo = true, className }: LoadingScreenProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-neutral-gray/10 to-background flex flex-col items-center justify-center",
      className
    )}>
      {showLogo && (
        <div className="relative w-24 h-24 gradient-primary rounded-3xl flex items-center justify-center shadow-2xl animate-pulse-glow mb-8">
          <ChefHat size={48} className="text-white animate-bounce" />
          <div className="absolute inset-0 border-4 border-primary-blue/30 rounded-3xl animate-ping"></div>
        </div>
      )}
      
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-blue to-dark-blue bg-clip-text text-transparent mb-4">
        MessHub
      </h1>
      
      <div className="relative w-48 h-2 bg-neutral-gray/20 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-primary-blue animate-loading-progress rounded-full"></div>
      </div>
      
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  );
}

interface LoadingOverlayProps {
  show: boolean;
  blur?: boolean;
  className?: string;
}

export function LoadingOverlay({ show, blur = true, className }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-background/80 z-50",
        blur && "backdrop-blur-sm",
        className
      )}
    >
      <LoadingSpinner size={24} className="text-primary" />
    </div>
  );
} 