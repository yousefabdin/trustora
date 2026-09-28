export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
export const getPasswordRequirements = (
  password: string,
): PasswordRequirements => {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };
};
export const getPasswordStrength = (
  password: string,
): "weak" | "medium" | "strong" | "Very Strong" => {
  const requirements = getPasswordRequirements(password);
  const passedRules = Object.values(requirements).filter(Boolean).length;
  if (passedRules <= 2) {
    return "weak";
  }
  if (passedRules <= 3) {
    return "medium";
  }
  if (passedRules <= 4) {
    return "strong";
  }
  return "Very Strong";
};
