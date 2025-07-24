import { Alert } from 'react-native';

export interface ErrorDetails {
  code?: string;
  message: string;
  userMessage: string;
  shouldReport: boolean;
}

export class ErrorHandler {
  // Firebase Auth error mappings
  private static authErrorMap: Record<string, ErrorDetails> = {
    // Authentication errors
    'auth/user-not-found': {
      code: 'auth/user-not-found',
      message: 'No user record found',
      userMessage: 'No account found with this email address. Please check your email or create a new account.',
      shouldReport: false,
    },
    'auth/wrong-password': {
      code: 'auth/wrong-password',
      message: 'Incorrect password',
      userMessage: 'Incorrect password. Please try again or reset your password.',
      shouldReport: false,
    },
    'auth/invalid-email': {
      code: 'auth/invalid-email',
      message: 'Invalid email address',
      userMessage: 'Please enter a valid email address.',
      shouldReport: false,
    },
    'auth/user-disabled': {
      code: 'auth/user-disabled',
      message: 'User account disabled',
      userMessage: 'This account has been disabled. Please contact support for assistance.',
      shouldReport: true,
    },
    'auth/too-many-requests': {
      code: 'auth/too-many-requests',
      message: 'Too many failed attempts',
      userMessage: 'Too many failed attempts. Please wait a few minutes before trying again.',
      shouldReport: false,
    },
    'auth/email-already-in-use': {
      code: 'auth/email-already-in-use',
      message: 'Email already in use',
      userMessage: 'An account with this email already exists. Please try logging in instead.',
      shouldReport: false,
    },
    'auth/weak-password': {
      code: 'auth/weak-password',
      message: 'Password is too weak',
      userMessage: 'Please choose a stronger password with at least 6 characters.',
      shouldReport: false,
    },
    'auth/network-request-failed': {
      code: 'auth/network-request-failed',
      message: 'Network request failed',
      userMessage: 'Network error. Please check your internet connection and try again.',
      shouldReport: false,
    },
    'auth/invalid-credential': {
      code: 'auth/invalid-credential',
      message: 'Invalid credentials',
      userMessage: 'Invalid credentials. Please check your email and password.',
      shouldReport: false,
    },
    'auth/requires-recent-login': {
      code: 'auth/requires-recent-login',
      message: 'Recent login required',
      userMessage: 'For security reasons, please log in again to continue.',
      shouldReport: false,
    },
    'auth/operation-not-allowed': {
      code: 'auth/operation-not-allowed',
      message: 'Operation not allowed',
      userMessage: 'This operation is not allowed. Please contact support.',
      shouldReport: true,
    },
  };

  // Firestore error mappings
  private static firestoreErrorMap: Record<string, ErrorDetails> = {
    'permission-denied': {
      code: 'permission-denied',
      message: 'Permission denied',
      userMessage: 'You do not have permission to perform this action.',
      shouldReport: true,
    },
    'not-found': {
      code: 'not-found',
      message: 'Document not found',
      userMessage: 'The requested information could not be found.',
      shouldReport: false,
    },
    'already-exists': {
      code: 'already-exists',
      message: 'Document already exists',
      userMessage: 'This information already exists in our system.',
      shouldReport: false,
    },
    'resource-exhausted': {
      code: 'resource-exhausted',
      message: 'Resource exhausted',
      userMessage: 'Service is temporarily unavailable. Please try again later.',
      shouldReport: true,
    },
    'failed-precondition': {
      code: 'failed-precondition',
      message: 'Failed precondition',
      userMessage: 'Unable to complete this action. Please try again.',
      shouldReport: false,
    },
    'aborted': {
      code: 'aborted',
      message: 'Operation aborted',
      userMessage: 'Operation was interrupted. Please try again.',
      shouldReport: false,
    },
    'out-of-range': {
      code: 'out-of-range',
      message: 'Out of range',
      userMessage: 'Invalid input provided. Please check your data.',
      shouldReport: false,
    },
    'unimplemented': {
      code: 'unimplemented',
      message: 'Unimplemented',
      userMessage: 'This feature is not available yet.',
      shouldReport: true,
    },
    'internal': {
      code: 'internal',
      message: 'Internal server error',
      userMessage: 'An unexpected error occurred. Please try again later.',
      shouldReport: true,
    },
    'unavailable': {
      code: 'unavailable',
      message: 'Service unavailable',
      userMessage: 'Service is temporarily unavailable. Please try again later.',
      shouldReport: true,
    },
    'data-loss': {
      code: 'data-loss',
      message: 'Data loss',
      userMessage: 'A data error occurred. Please contact support immediately.',
      shouldReport: true,
    },
    'unauthenticated': {
      code: 'unauthenticated',
      message: 'Unauthenticated',
      userMessage: 'Please log in to continue.',
      shouldReport: false,
    },
  };

  // Network error mappings
  private static networkErrorMap: Record<string, ErrorDetails> = {
    'NETWORK_ERROR': {
      code: 'NETWORK_ERROR',
      message: 'Network connection error',
      userMessage: 'Please check your internet connection and try again.',
      shouldReport: false,
    },
    'TIMEOUT_ERROR': {
      code: 'TIMEOUT_ERROR',
      message: 'Request timeout',
      userMessage: 'The request timed out. Please try again.',
      shouldReport: false,
    },
    'CONNECTION_ERROR': {
      code: 'CONNECTION_ERROR',
      message: 'Connection error',
      userMessage: 'Unable to connect to the server. Please try again.',
      shouldReport: false,
    },
  };

  // Process different types of errors
  static processError(error: any): ErrorDetails {
    console.error('Processing error:', error);

    // Handle Firebase Auth errors
    if (error?.code && error.code.startsWith('auth/')) {
      const mappedError = this.authErrorMap[error.code];
      if (mappedError) {
        return mappedError;
      }
    }

    // Handle Firestore errors
    if (error?.code && this.firestoreErrorMap[error.code]) {
      return this.firestoreErrorMap[error.code];
    }

    // Handle network errors
    if (error?.message) {
      const message = error.message.toLowerCase();
      if (message.includes('network') || message.includes('connection')) {
        return this.networkErrorMap.NETWORK_ERROR;
      }
      if (message.includes('timeout')) {
        return this.networkErrorMap.TIMEOUT_ERROR;
      }
    }

    // Handle specific error types
    if (error instanceof TypeError) {
      return {
        code: 'TYPE_ERROR',
        message: error.message,
        userMessage: 'An unexpected error occurred. Please try again.',
        shouldReport: true,
      };
    }

    if (error instanceof ReferenceError) {
      return {
        code: 'REFERENCE_ERROR',
        message: error.message,
        userMessage: 'An unexpected error occurred. Please try again.',
        shouldReport: true,
      };
    }

    // Default error for unknown types
    return {
      code: 'UNKNOWN_ERROR',
      message: error?.message || 'Unknown error occurred',
      userMessage: 'An unexpected error occurred. Please try again later.',
      shouldReport: true,
    };
  }

  // Show user-friendly error alert
  static showErrorAlert(error: any, title: string = 'Error'): void {
    const errorDetails = this.processError(error);
    
    Alert.alert(
      title,
      errorDetails.userMessage,
      [
        {
          text: 'OK',
          style: 'default',
        },
      ],
      { cancelable: true }
    );

    // Report error if needed (you can integrate with crash reporting service)
    if (errorDetails.shouldReport) {
      this.reportError(error, errorDetails);
    }
  }

  // Show error with retry option
  static showErrorWithRetry(
    error: any,
    onRetry: () => void,
    title: string = 'Error'
  ): void {
    const errorDetails = this.processError(error);
    
    Alert.alert(
      title,
      errorDetails.userMessage,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Retry',
          style: 'default',
          onPress: onRetry,
        },
      ],
      { cancelable: true }
    );

    if (errorDetails.shouldReport) {
      this.reportError(error, errorDetails);
    }
  }

  // Report error to logging service (placeholder)
  private static reportError(originalError: any, errorDetails: ErrorDetails): void {
    // Here you can integrate with services like:
    // - Sentry
    // - Crashlytics
    // - Bugsnag
    // - Custom logging service
    
    console.error('Reporting error:', {
      code: errorDetails.code,
      message: errorDetails.message,
      userMessage: errorDetails.userMessage,
      originalError,
      timestamp: new Date().toISOString(),
      // Add more context as needed (user ID, app version, etc.)
    });
  }

  // Check if error is retryable
  static isRetryableError(error: any): boolean {
    const errorDetails = this.processError(error);
    
    const retryableCodes = [
      'auth/network-request-failed',
      'auth/too-many-requests',
      'unavailable',
      'aborted',
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'CONNECTION_ERROR',
    ];

    return retryableCodes.includes(errorDetails.code || '');
  }

  // Get user-friendly message without showing alert
  static getUserMessage(error: any): string {
    const errorDetails = this.processError(error);
    return errorDetails.userMessage;
  }

  // Validate and handle async operations with error handling
  static async handleAsyncOperation<T>(
    operation: () => Promise<T>,
    errorTitle: string = 'Error',
    showAlert: boolean = true
  ): Promise<{ success: boolean; data?: T; error?: ErrorDetails }> {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      const errorDetails = this.processError(error);
      
      if (showAlert) {
        this.showErrorAlert(error, errorTitle);
      }

      return { success: false, error: errorDetails };
    }
  }
}

// Utility function for form validation errors
export const showValidationErrors = (errors: string[], title: string = 'Validation Error'): void => {
  if (errors.length === 0) return;
  
  const message = errors.length === 1 
    ? errors[0] 
    : `Please fix the following issues:\n\n• ${errors.join('\n• ')}`;
  
  Alert.alert(title, message, [{ text: 'OK' }]);
};

// Utility function for success messages
export const showSuccessAlert = (
  message: string,
  title: string = 'Success',
  onPress?: () => void
): void => {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress,
      },
    ]
  );
};
