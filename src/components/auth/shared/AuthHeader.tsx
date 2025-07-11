import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function AuthHeader({ title, subtitle, onBack, showBack = true }: AuthHeaderProps) {
  return (
    <div className="relative z-10 flex flex-col p-4 sm:p-6 pt-12 sm:pt-16">
      <div className="flex items-center justify-between mb-4">
        {showBack && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full p-2 sm:p-3 transition-all duration-300"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </Button>
        )}
        <ThemeToggle />
      </div>
      
      <div className="px-4 sm:px-6">
        <h1 className="text-white text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{title}</h1>
        {subtitle && <p className="text-white/90 text-base sm:text-lg">{subtitle}</p>}
      </div>
    </div>
  );
}