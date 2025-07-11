"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  rightIcon?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function PageLayout({
  title,
  children,
  rightIcon,
  showBackButton = true,
  onBack,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={onBack}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightIcon && (
          <div className="flex items-center space-x-2">{rightIcon}</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 space-y-6">{children}</div>
      </div>
    </div>
  );
}
