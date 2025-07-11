import { ReactNode } from "react";
import { AuthError } from "../utils/error";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingOverlay } from "./LoadingSpinner";

interface FormWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  error: AuthError | null;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export function FormWrapper({
  children,
  isLoading,
  error,
  onSubmit,
  className = "",
}: FormWrapperProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
      className={`relative ${className}`}
    >
      <LoadingOverlay show={isLoading} />
      {error && <ErrorMessage error={error} />}
      {children}
    </form>
  );
} 