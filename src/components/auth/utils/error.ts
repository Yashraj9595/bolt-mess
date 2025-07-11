// Error codes for different types of auth errors
export enum AuthErrorCode {
  INVALID_CREDENTIALS = "AUTH_001",
  UNVERIFIED_ACCOUNT = "AUTH_002",
  INVALID_OTP = "AUTH_003",
  EXPIRED_OTP = "AUTH_004",
  ACCOUNT_DEACTIVATED = "AUTH_005",
  USER_NOT_FOUND = "USER_001",
  VALIDATION_ERROR = "VALIDATION_001",
}

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  field?: string;
  details?: Record<string, string>;
}

export class AuthenticationError extends Error {
  code: AuthErrorCode;
  field?: string;
  details?: Record<string, string>;

  constructor(error: AuthError) {
    super(error.message);
    this.code = error.code;
    this.field = error.field;
    this.details = error.details;
    this.name = 'AuthenticationError';
  }
}

export const handleApiError = (error: any): AuthError => {
  if (error instanceof AuthenticationError) {
    return {
      code: error.code,
      message: error.message,
      field: error.field,
      details: error.details,
    };
  }

  if (error.response) {
    const { data, status } = error.response;
    
    // Handle specific HTTP status codes
    switch (status) {
      case 401:
        return {
          code: AuthErrorCode.INVALID_CREDENTIALS,
          message: "Invalid email or password. Please try again.",
        };
      case 403:
        if (data?.error?.code === AuthErrorCode.UNVERIFIED_ACCOUNT) {
          return {
            code: AuthErrorCode.UNVERIFIED_ACCOUNT,
            message: "Please verify your email address to continue.",
          };
        }
        if (data?.error?.code === AuthErrorCode.ACCOUNT_DEACTIVATED) {
          return {
            code: AuthErrorCode.ACCOUNT_DEACTIVATED,
            message: "Your account has been deactivated. Please contact support.",
          };
        }
        break;
      case 404:
        return {
          code: AuthErrorCode.USER_NOT_FOUND,
          message: "Account not found. Please check your credentials.",
        };
      case 400:
        if (data?.error?.code === AuthErrorCode.VALIDATION_ERROR) {
          const details: Record<string, string> = {};
          data.error.details?.forEach((err: any) => {
            details[err.field] = err.message;
          });
          return {
            code: AuthErrorCode.VALIDATION_ERROR,
            message: "Please fix the following errors:",
            details,
          };
        }
        break;
    }

    // Handle any other error response
    return {
      code: data?.error?.code || AuthErrorCode.INVALID_CREDENTIALS,
      message: data?.error?.message || "An unexpected error occurred. Please try again.",
    };
  }

  // Handle network errors
  if (error.request) {
    return {
      code: AuthErrorCode.INVALID_CREDENTIALS,
      message: "Network error. Please check your connection and try again.",
    };
  }

  // Handle all other errors
  return {
    code: AuthErrorCode.INVALID_CREDENTIALS,
    message: error.message || "An unexpected error occurred. Please try again.",
  };
};

export const getFieldError = (errors: Record<string, string> | undefined, field: string): string | undefined => {
  return errors?.[field];
};

export const hasErrors = (errors: Record<string, string> | undefined): boolean => {
  return !!errors && Object.keys(errors).length > 0;
}; 