export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordStrength {
  score: number; // 0-4 (0 = very weak, 4 = very strong)
  feedback: string[];
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  hasMinLength: boolean;
}

export class FormValidator {
  // Email validation
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || !email.trim()) {
      errors.push('Email is required');
      return { isValid: false, errors };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address');
    }

    // Check for common email issues
    const trimmedEmail = email.trim();
    if (trimmedEmail.includes('..')) {
      errors.push('Email cannot contain consecutive dots');
    }

    if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
      errors.push('Email cannot start or end with a dot');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Password validation
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123', 
      'password123', 'admin', 'welcome', 'login', 'guest'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push('Please choose a more secure password');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Password strength checker
  static checkPasswordStrength(password: string): PasswordStrength {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    let score = 0;
    const feedback: string[] = [];

    // Basic requirements
    if (password.length < 6) {
      feedback.push('Password must be at least 6 characters');
      return {
        score: 0,
        feedback,
        hasLowercase,
        hasUppercase,
        hasNumbers,
        hasSpecialChars,
        hasMinLength
      };
    }

    // Score calculation
    if (hasMinLength) score++;
    if (hasLowercase) score++;
    if (hasUppercase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChars) score++;

    // Feedback generation
    if (!hasMinLength) feedback.push('Use at least 8 characters');
    if (!hasLowercase) feedback.push('Add lowercase letters');
    if (!hasUppercase) feedback.push('Add uppercase letters');
    if (!hasNumbers) feedback.push('Add numbers');
    if (!hasSpecialChars) feedback.push('Add special characters');

    // Adjust score based on length and complexity
    if (password.length >= 12) score = Math.min(score + 1, 4);
    if (password.length >= 16) score = Math.min(score + 1, 4);

    // Check for patterns that reduce strength
    if (/(.)\1{2,}/.test(password)) {
      score = Math.max(score - 1, 0);
      feedback.push('Avoid repeating characters');
    }

    if (/123|abc|qwe|asd/i.test(password)) {
      score = Math.max(score - 1, 0);
      feedback.push('Avoid common patterns');
    }

    return {
      score: Math.min(score, 4),
      feedback,
      hasLowercase,
      hasUppercase,
      hasNumbers,
      hasSpecialChars,
      hasMinLength
    };
  }

  // Name validation
  static validateName(name: string, fieldName: string = 'Name'): ValidationResult {
    const errors: string[] = [];
    
    if (!name || !name.trim()) {
      errors.push(`${fieldName} is required`);
      return { isValid: false, errors };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    }

    if (trimmedName.length > 50) {
      errors.push(`${fieldName} must be less than 50 characters`);
    }

    // Check for invalid characters (allow letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-']+$/.test(trimmedName)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }

    // Check for excessive spaces
    if (/\s{2,}/.test(trimmedName)) {
      errors.push(`${fieldName} cannot contain multiple consecutive spaces`);
    }

    return { isValid: errors.length === 0, errors };
  }

  // Password confirmation validation
  static validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
    const errors: string[] = [];
    
    if (!confirmPassword) {
      errors.push('Please confirm your password');
      return { isValid: false, errors };
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Complete form validation
  static validateRegistrationForm(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
  ): ValidationResult {
    const errors: string[] = [];

    // Validate each field
    const firstNameValidation = this.validateName(firstName, 'First name');
    const lastNameValidation = this.validateName(lastName, 'Last name');
    const emailValidation = this.validateEmail(email);
    const passwordValidation = this.validatePassword(password);
    const confirmPasswordValidation = this.validatePasswordConfirmation(password, confirmPassword);

    // Collect all errors
    errors.push(...firstNameValidation.errors);
    errors.push(...lastNameValidation.errors);
    errors.push(...emailValidation.errors);
    errors.push(...passwordValidation.errors);
    errors.push(...confirmPasswordValidation.errors);

    return { isValid: errors.length === 0, errors };
  }

  static validateLoginForm(email: string, password: string): ValidationResult {
    const errors: string[] = [];

    // Validate email
    const emailValidation = this.validateEmail(email);
    errors.push(...emailValidation.errors);

    // Basic password validation for login (just check if it's provided)
    if (!password || !password.trim()) {
      errors.push('Password is required');
    }

    return { isValid: errors.length === 0, errors };
  }
}

// Utility functions for formatting
export const formatErrorMessage = (errors: string[]): string => {
  if (errors.length === 0) return '';
  if (errors.length === 1) return errors[0];
  
  const lastError = errors[errors.length - 1];
  const otherErrors = errors.slice(0, -1).join(', ');
  
  return `${otherErrors}, and ${lastError}`;
};

export const getPasswordStrengthText = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Unknown';
  }
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return '#FF4444'; // Red
    case 2:
      return '#FF8800'; // Orange
    case 3:
      return '#FFBB00'; // Yellow
    case 4:
      return '#00AA00'; // Green
    default:
      return '#CCCCCC'; // Gray
  }
};
