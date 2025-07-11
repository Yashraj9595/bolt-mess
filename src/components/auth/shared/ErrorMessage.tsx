import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError } from "../utils/error";

interface ErrorMessageProps {
  error: AuthError | null;
  field?: string;
  className?: string;
}

export function ErrorMessage({ error, field, className = "" }: ErrorMessageProps) {
  if (!error) return null;

  // If a field is specified, only show field-specific error
  if (field) {
    const fieldError = error.details?.[field];
    if (!fieldError) return null;

    return (
      <p className={`text-sm text-destructive mt-1 ${className}`}>
        {fieldError}
      </p>
    );
  }

  // Show general error message
  return (
    <Alert variant="destructive" className={`mb-6 ${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="ml-2">
        {error.message}
        {error.details && (
          <ul className="list-disc list-inside mt-2">
            {Object.entries(error.details).map(([field, message]) => (
              <li key={field} className="text-sm">
                {message}
              </li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  );
} 