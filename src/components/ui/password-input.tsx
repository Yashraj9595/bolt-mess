import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrength?: boolean;
  onStrengthChange?: (strength: number) => void;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, onStrengthChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState(0);

    const calculateStrength = (password: string) => {
      let score = 0;
      if (password.length >= 8) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      return score;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (showStrength) {
        const newStrength = calculateStrength(value);
        setStrength(newStrength);
        onStrengthChange?.(newStrength);
      }
      props.onChange?.(e);
    };

    const getStrengthColor = () => {
      if (strength <= 1) return 'bg-destructive';
      if (strength <= 2) return 'bg-warning';
      if (strength <= 3) return 'bg-info';
      return 'bg-success';
    };

    const getStrengthText = () => {
      if (strength <= 1) return 'Weak';
      if (strength <= 2) return 'Fair';
      if (strength <= 3) return 'Good';
      return 'Strong';
    };

    return (
      <div className="space-y-2">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-12 w-full rounded-lg border border-input bg-background/50 backdrop-blur-sm px-3 py-2 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              className
            )}
            ref={ref}
            {...props}
            onChange={handlePasswordChange}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        
        {showStrength && props.value && (
          <div className="space-y-2">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full transition-all duration-300 ease-out",
                  getStrengthColor()
                )}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
            <p className={cn(
              "text-xs font-medium",
              strength <= 1 ? 'text-destructive' :
              strength <= 2 ? 'text-warning' :
              strength <= 3 ? 'text-info' : 'text-success'
            )}>
              Password strength: {getStrengthText()}
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";