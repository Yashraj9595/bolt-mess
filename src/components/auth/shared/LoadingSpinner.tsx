import { Loader2 } from "lucide-react";
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
 