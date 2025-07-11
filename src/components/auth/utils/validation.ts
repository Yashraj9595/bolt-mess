export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return "Phone number is required";
  if (!/^\+?[\d\s-]+$/.test(phone)) return "Please enter a valid phone number";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

export const validateOTP = (otp: string): string | null => {
  if (!otp) return "Please enter the verification code";
  if (!/^\d{6}$/.test(otp)) return "Please enter a valid 6-digit code";
  return null;
}; 