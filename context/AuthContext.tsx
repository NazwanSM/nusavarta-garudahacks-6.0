import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { AuthResponse, authService, LoginCredentials, RegisterCredentials, UserData } from '../services/authService';

// Tipe data untuk user dan fungsi yang akan kita sediakan
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  loginWithGoogle: (idToken: string) => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  getSavedCredentials: () => Promise<{ email: string; rememberMe: boolean }>;
}

// Membuat Context dengan nilai awal
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isLoading: true,
  login: async () => ({ success: false, error: 'Context not initialized' }),
  register: async () => ({ success: false, error: 'Context not initialized' }),
  loginWithGoogle: async () => ({ success: false, error: 'Context not initialized' }),
  logout: async () => ({ success: false, error: 'Context not initialized' }),
  resetPassword: async () => ({ success: false, error: 'Context not initialized' }),
  getSavedCredentials: async () => ({ email: '', rememberMe: false }),
});

// Membuat "Provider" yang akan membungkus aplikasi kita
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged adalah pendengar real-time dari Firebase.
    // Fungsi ini akan otomatis terpanggil setiap kali status login berubah (login/logout).
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Ambil data user dari Firestore jika user login
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          } else {
            // Jika tidak ada data di Firestore, buat dari data Firebase Auth
            const nameParts = firebaseUser.displayName?.split(' ') || ['', ''];
            const basicUserData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || undefined,
              createdAt: new Date(),
              lastLoginAt: new Date(),
              isEmailVerified: firebaseUser.emailVerified
            };
            setUserData(basicUserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      
      setIsLoading(false);
    });

    // Membersihkan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.loginWithEmail(credentials);
      if (result.success && result.user) {
        setUserData(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.registerWithEmail(credentials);
      if (result.success && result.user) {
        setUserData(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.loginWithGoogle(idToken);
      if (result.success && result.user) {
        setUserData(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const result = await authService.logout();
      if (result.success) {
        setUserData(null);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return authService.resetPassword(email);
  };

  const getSavedCredentials = async () => {
    return authService.getSavedCredentials();
  };

  const value: AuthContextType = {
    user,
    userData,
    isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    getSavedCredentials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Membuat custom hook agar lebih mudah digunakan di komponen lain
export const useAuth = () => {
  return useContext(AuthContext);
};
