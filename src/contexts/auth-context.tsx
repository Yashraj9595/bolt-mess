import { createContext, useContext, useState, useCallback, useEffect } from "react"

export type AuthScreen = 
  | "welcome"
  | "login" 
  | "register"
  | "register-role"
  | "forgot-password"
  | "otp-verification"
  | "reset-password"
  | "success"

export interface AuthState {
  email?: string
  resetFlow?: boolean
  otp?: string
  name?: string
  role?: string
  password?: string
  message?: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  role: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
  login: (identifier: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  verifyOTP: (email: string, otp: string) => Promise<boolean>
  resendOTP: (email: string) => Promise<boolean>
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<boolean>
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<boolean>
  resendPasswordResetOTP: (email: string) => Promise<boolean>
  loginAfterRegistration: (email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Add API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

// Development mode flag - set to true to enable development helpers
const DEV_MODE = import.meta.env.DEV || true

// Check if device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768)
}

// Add this validation function after the imports
const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  // Basic format validation
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Check for common typos
  const commonTypos = {
    'gamil.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com'
  };

  const domain = email.split('@')[1];
  const suggestedDomain = commonTypos[domain];
  
  if (suggestedDomain) {
    return { 
      isValid: false, 
      error: `Did you mean ${email.split('@')[0]}@${suggestedDomain}?` 
    };
  }

  return { isValid: true };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    const storedToken = localStorage.getItem("auth_token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const handleApiError = (error: any) => {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || "An error occurred"
      throw new Error(message)
    } else if (error.request) {
      // Request made but no response
      throw new Error("Network error. Please check your connection.")
    } else {
      // Other errors
      throw new Error(error.message || "An error occurred")
    }
  }

  // Development helper function to handle API calls when backend is not available
  const handleDevFallback = (operation: string, data: any) => {
    console.log(`[DEV MODE] ${operation} called with:`, data)
    
    // Store data in localStorage for development testing
    if (operation === 'forgotPassword') {
      // Store a mock OTP for testing
      const mockOTP = '123456'
      localStorage.setItem(`dev_otp_${data.email}`, mockOTP)
      console.log(`[DEV MODE] Generated mock OTP for ${data.email}: ${mockOTP}`)
      return true
    } else if (operation === 'verifyOTP' || operation === 'verifyPasswordResetOTP') {
      const storedOTP = localStorage.getItem(`dev_otp_${data.email}`)
      console.log(`[DEV MODE] Verifying OTP: ${data.otp} against stored: ${storedOTP}`)
      return data.otp === storedOTP
    }
    
    return true
  }

  const login = useCallback(async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Trim inputs
      const trimmedIdentifier = identifier.trim()
      const trimmedPassword = password.trim()

      console.log('Attempting login with:', { 
        email: trimmedIdentifier,
        passwordLength: trimmedPassword.length 
      })

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: trimmedIdentifier, 
          password: trimmedPassword 
        }),
        credentials: "include" // Changed back to "include" for proper cookie handling
      })

      // First get the response text
      const responseText = await response.text()
      console.log('Login response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      })
      
      // Try to parse as JSON if possible
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        // If response is not JSON, create an error object
        data = {
          error: {
            message: responseText || "An unexpected error occurred"
          }
        }
      }
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          if (data.error?.code === "AUTH_001") {
            throw new Error("Invalid password. Please check and try again.")
          } else {
            throw new Error("Invalid email or password. Please try again.")
          }
        } else if (response.status === 404 || data.error?.code === "USER_001") {
          throw new Error("Email not registered. Please create an account first.")
        } else if (response.status === 403 && data.error?.code === "AUTH_002") {
          throw new Error("Account not verified. Please check your email for verification code.")
        } else if (response.status === 403 && data.error?.code === "AUTH_005") {
          throw new Error("Your account has been deactivated. Please contact support.")
        } else if (response.status === 400 && data.error?.code === "VALIDATION_001") {
          const fieldErrors = data.error.details.map((err: any) => `${err.field}: ${err.message}`).join(", ")
          throw new Error(`Please fix the following: ${fieldErrors}`)
        } else if (response.status === 429) {
          throw new Error("Too many login attempts. Please wait a few minutes before trying again.")
        } else {
          throw new Error(data.error?.message || "Login failed. Please try again.")
        }
      }

      setUser(data.data.user)
      setIsAuthenticated(true)
      localStorage.setItem("auth_user", JSON.stringify(data.data.user))
      localStorage.setItem("auth_token", data.data.token)
      return true
    } catch (error) {
      console.error('Login error details:', error)
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log('Attempting registration:', { 
        ...userData,
        passwordLength: userData.password.length 
      })

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name: userData.name.trim(),
          email: userData.email.trim(),
          password: userData.password,
          phone: userData.phone?.trim(),
          role: userData.role
        })
      })

      // First get the response text
      const responseText = await response.text()
      console.log('Registration response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      })
      
      // Try to parse as JSON if possible
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        data = {
          error: {
            message: responseText || "An unexpected error occurred"
          }
        }
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409 || data.error?.code === "DUPLICATE_001") {
          throw new Error("This email is already registered. Please sign in or use a different email.")
        } else if (response.status === 400 && data.error?.code === "VALIDATION_001") {
          const fieldErrors = data.error.details.map((err: any) => `${err.field}: ${err.message}`).join(", ")
          throw new Error(`Please fix the following: ${fieldErrors}`)
        } else if (response.status === 429) {
          throw new Error("Too many registration attempts. Please wait a few minutes before trying again.")
        } else {
          throw new Error(data.error?.message || "Registration failed. Please try again.")
        }
      }

      return true
    } catch (error: any) {
      console.error('Registration error details:', error)
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log('Verifying OTP:', { email, otp })
      
      // Trim inputs
      const trimmedEmail = email.trim()
      const trimmedOTP = otp.trim()

      // Validate input
      if (!trimmedEmail || !trimmedOTP) {
        throw new Error("Email and verification code are required")
      }

      if (trimmedOTP.length !== 6 || !/^\d{6}$/.test(trimmedOTP)) {
        throw new Error("Verification code must be 6 digits")
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          otp: trimmedOTP 
        }),
        credentials: "include"
      })

      // First get the response text
      const responseText = await response.text()
      console.log('Verify OTP response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      })
      
      // Try to parse as JSON if possible
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        data = { error: { message: responseText || "An unexpected error occurred" } }
      }

      if (!response.ok) {
        if (response.status === 400 && data.error?.code === "AUTH_003") {
          if (data.error.message.includes("expired")) {
            throw new Error("Verification code has expired. Please request a new one.")
          } else {
            throw new Error("Invalid verification code. Please check and try again.")
          }
        } else if (response.status === 404 || data.error?.code === "USER_001") {
          throw new Error("Email not found. Please check your email address.")
        } else if (response.status === 400 && data.error?.code === "VERIFICATION_001") {
          throw new Error("This email is already verified. Please proceed to login.")
        } else if (response.status === 429) {
          throw new Error("Too many attempts. Please wait a few minutes before trying again.")
        } else if (response.status === 400 && data.error?.code === "VALIDATION_001") {
          throw new Error(data.error.message || "Please provide both email and verification code.")
        } else {
          throw new Error(data.error?.message || "Verification failed. Please try again.")
        }
      }

      return true
    } catch (error) {
      console.error('Verify OTP error:', error)
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resendOTP = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validate email format
      const validation = validateEmail(email);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      console.log('Resending OTP for:', email);

      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email: email.trim() }),
        credentials: "include"
      });

      // First get the response text
      const responseText = await response.text();
      console.log('Resend OTP response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseText
      });
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { error: { message: responseText || "An unexpected error occurred" } };
      }

      if (!response.ok) {
        if (response.status === 404 || data.error?.code === "USER_001") {
          throw new Error("Email not found. Please check your email address.");
        } else if (response.status === 400 && data.error?.code === "VERIFICATION_001") {
          throw new Error("This email is already verified.");
        } else if (response.status === 429) {
          throw new Error("Please wait a few minutes before requesting another code.");
        } else if (response.status === 500 && data.error?.code === "EMAIL_003") {
          throw new Error("Failed to send verification code. Please check your email address and try again.");
        } else {
          throw new Error(data.error?.message || "Failed to send verification code. Please try again.");
        }
      }

      return true;
    } catch (error) {
      console.error('Resend OTP error:', error);
      handleApiError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check if this is a mobile device
      const isMobile = isMobileDevice()
      console.log(`Device detected as: ${isMobile ? 'mobile' : 'desktop'}`)
      
      // Try to connect to the backend
      try {
        // Set headers with device info
        const headers = { 
          "Content-Type": "application/json",
          "X-Device-Type": isMobile ? "mobile" : "desktop",
          "X-App-Version": "1.0.0"
        }

        console.log(`Sending forgot password request to ${API_BASE_URL}/api/auth/forgot-password`)
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ email }),
          // Add credentials to include cookies
          credentials: "include"
        })

        const data = await response.json()
        console.log("Forgot password response:", data)

        if (!response.ok) {
          if (response.status === 404 || data.error?.code === "USER_001") {
            throw new Error("Email not found. Please check your email address.")
          } else if (response.status === 400 && data.error?.code === "AUTH_002") {
            throw new Error("Account not verified. Please verify your account first.")
          } else if (response.status === 400 && data.error?.code === "VALIDATION_001") {
            const fieldErrors = data.error.details.map((err: any) => `${err.field}: ${err.message}`).join(", ")
            throw new Error(`Please fix the following: ${fieldErrors}`)
          } else if (response.status === 429 || data.error?.code?.startsWith("RATE_LIMIT")) {
            throw new Error("Too many requests. Please wait a few minutes before trying again.")
          } else if (response.status === 500 && data.error?.code?.startsWith("EMAIL_")) {
            throw new Error("Could not send reset email. Please try again later.")
          } else {
            throw new Error(data.error?.message || "Failed to send reset code. Please try again.")
          }
        }

        // For mobile devices, store the email in localStorage to help with OTP verification
        if (isMobile) {
          localStorage.setItem("reset_email", email)
        }

        return true
      } catch (error: any) {
        console.error("Error in forgotPassword:", error)
        
        // If we can't connect to the backend and we're in dev mode, use fallback
        if (DEV_MODE && (error.message.includes("Network error") || error.message.includes("Failed to fetch"))) {
          console.warn("[DEV MODE] Backend connection failed, using development fallback")
          
          // For mobile devices, store the email in localStorage
          if (isMobile) {
            localStorage.setItem("reset_email", email)
          }
          
          return handleDevFallback('forgotPassword', { email })
        }
        throw error
      }
    } catch (error) {
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Update the verifyPasswordResetOTP function to use the correct API endpoint
  const verifyPasswordResetOTP = useCallback(async (email: string, otp: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check if this is a mobile device
      const isMobile = isMobileDevice()
      
      try {
        // Get stored email for mobile if needed
        const emailToUse = isMobile && !email ? localStorage.getItem("reset_email") || email : email
        
        console.log(`Verifying password reset OTP for ${emailToUse}`)
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-password-reset-otp`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "X-Device-Type": isMobile ? "mobile" : "desktop"
          },
          body: JSON.stringify({ email: emailToUse, otp }),
          credentials: "include"
        })

        const data = await response.json()
        console.log("OTP verification response:", data)

        if (!response.ok) {
          if (response.status === 400 && data.error?.code === "AUTH_003") {
            throw new Error("Invalid or expired verification code. Please request a new code.")
          } else if (response.status === 404 || data.error?.code === "USER_001") {
            throw new Error("Account not found. Please check your email address.")
          } else {
            throw new Error(data.error?.message || "Verification failed. Please try again.")
          }
        }

        // Store verified email and OTP for the reset password screen
        if (isMobile) {
          localStorage.setItem("reset_email", emailToUse)
          localStorage.setItem("reset_otp", otp)
        }

        return true
      } catch (error: any) {
        console.error("Error in verifyPasswordResetOTP:", error)
        
        // If we can't connect to the backend and we're in dev mode, use fallback
        if (DEV_MODE && (error.message.includes("Network error") || error.message.includes("Failed to fetch"))) {
          console.warn("[DEV MODE] Backend connection failed, using development fallback")
          
          // Get stored email for mobile if needed
          const emailToUse = isMobile && !email ? localStorage.getItem("reset_email") || email : email
          
          const result = handleDevFallback('verifyPasswordResetOTP', { email: emailToUse, otp })
          
          // Store verified email and OTP for the reset password screen in dev mode
          if (result && isMobile) {
            localStorage.setItem("reset_email", emailToUse)
            localStorage.setItem("reset_otp", otp)
          }
          
          return result
        }
        throw error
      }
    } catch (error) {
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resendPasswordResetOTP = useCallback(async (email: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404 || data.error?.code === "USER_001") {
          throw new Error("Email not registered in our system. Please check your email address.")
        } else if (response.status === 400 && data.error?.code === "VALIDATION_001") {
          // Handle validation errors
          const fieldErrors = data.error.details.map((err: any) => `${err.field}: ${err.message}`).join(", ")
          throw new Error(`Please fix the following: ${fieldErrors}`)
        } else if (response.status === 429 || data.error?.code?.startsWith("RATE_LIMIT")) {
          throw new Error("Too many requests. Please wait a few minutes before trying again.")
        } else if (response.status === 500 && data.error?.code?.startsWith("EMAIL_")) {
          throw new Error("Could not send reset code. Please try again later.")
        } else {
          throw new Error(data.error?.message || "Failed to resend reset code. Please try again.")
        }
      }

      return true
    } catch (error) {
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.error?.code === "AUTH_003") {
          throw new Error("Invalid or expired reset code. Please request a new code.")
        } else if (response.status === 404 || data.error?.code === "USER_001") {
          throw new Error("Account not found. Please check your email address.")
        } else if (response.status === 400 && data.error?.code === "VALIDATION_001") {
          // Handle validation errors
          const fieldErrors = data.error.details.map((err: any) => `${err.field}: ${err.message}`).join(", ")
          throw new Error(`Please fix the following: ${fieldErrors}`)
        } else {
          throw new Error(data.error?.message || "Password reset failed. Please try again.")
        }
      }

      return true
    } catch (error) {
      handleApiError(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loginAfterRegistration = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      return await login(email, password)
    } catch (error) {
      handleApiError(error)
      return false
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
    // Clear any stored tokens/session
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    }).catch(console.error)
  }, [])

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    verifyPasswordResetOTP,
    resendPasswordResetOTP,
    loginAfterRegistration
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
