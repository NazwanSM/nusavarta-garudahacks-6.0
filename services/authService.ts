import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthError,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export interface UserData {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  photoURL?: string;
  createdAt: any;
  lastLoginAt: any;
  lastUpdatedAt?: any;
  isEmailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  user?: UserData;
  error?: string;
}

class AuthService {
  // Login dengan email dan password
  async loginWithEmail({ email, password, rememberMe }: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validasi input
      if (!email.trim()) {
        return { success: false, error: 'Email is required' };
      }
      
      if (!password.trim()) {
        return { success: false, error: 'Password is required' };
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Login ke Firebase
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Simpan kredensial jika remember me aktif
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
        await AsyncStorage.setItem('savedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberMe');
        await AsyncStorage.removeItem('savedEmail');
      }

      // Ambil data user dari Firestore
      const userData = await this.getUserData(firebaseUser.uid);
      
      if (userData) {
        // Update last login time for existing user
        await this.updateUserLastLogin(firebaseUser.uid);
        return { success: true, user: userData };
      } else {
        // If no user data in Firestore, create a basic user document
        const fallbackUser: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: '',
          lastName: '',
          displayName: firebaseUser.displayName || '',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isEmailVerified: firebaseUser.emailVerified
        };

        // Only add photoURL if it exists
        if (firebaseUser.photoURL) {
          fallbackUser.photoURL = firebaseUser.photoURL;
        }

        // Create the user document in Firestore for future use
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), fallbackUser);
        } catch (error) {
          console.error('Error creating user document:', error);
        }

        return { success: true, user: fallbackUser };
      }

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: this.getErrorMessage(error as AuthError) };
    }
  }

  // Register dengan email dan password
  async registerWithEmail({ email, password, firstName, lastName }: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Validasi input
      if (!firstName.trim()) {
        return { success: false, error: 'First name is required' };
      }
      
      if (!lastName.trim()) {
        return { success: false, error: 'Last name is required' };
      }
      
      if (!email.trim()) {
        return { success: false, error: 'Email is required' };
      }
      
      if (!password.trim()) {
        return { success: false, error: 'Password is required' };
      }

      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      // Validasi password
      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await this.checkEmailExists(email);
      if (existingUser) {
        return { success: false, error: 'Email already exists. Please use a different email or try logging in.' };
      }

      // Buat akun Firebase
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update profile di Firebase Auth
      const displayName = `${firstName} ${lastName}`;
      await updateProfile(firebaseUser, { displayName });

      // Simpan data user ke Firestore
      const userData: UserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isEmailVerified: firebaseUser.emailVerified
      };

      // Only add photoURL if it exists
      if (firebaseUser.photoURL) {
        userData.photoURL = firebaseUser.photoURL;
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);

      return { success: true, user: userData };

    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: this.getErrorMessage(error as AuthError) };
    }
  }

  // Login dengan Google
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const firebaseUser = userCredential.user;

      // Cek apakah user sudah ada di Firestore
      let userData = await this.getUserData(firebaseUser.uid);
      
      if (!userData) {
        // Jika user baru, simpan ke Firestore
        const nameParts = firebaseUser.displayName?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName,
          lastName,
          displayName: firebaseUser.displayName || '',
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          isEmailVerified: firebaseUser.emailVerified
        };

        // Only add photoURL if it exists
        if (firebaseUser.photoURL) {
          userData.photoURL = firebaseUser.photoURL;
        }

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      } else {
        // Update last login time
        await this.updateUserLastLogin(firebaseUser.uid);
      }

      return { success: true, user: userData };

    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: this.getErrorMessage(error as AuthError) };
    }
  }

  // Logout
  async logout(): Promise<AuthResponse> {
    try {
      await signOut(auth);
      // Hapus data remember me
      await AsyncStorage.removeItem('rememberMe');
      await AsyncStorage.removeItem('savedEmail');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      if (!email.trim()) {
        return { success: false, error: 'Email is required' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: this.getErrorMessage(error as AuthError) };
    }
  }

  // Helper methods
  private async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  private async updateUserLastLogin(uid: string): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp()
        });
      } else {
        console.warn('User document not found for uid:', uid);
        // Optionally, you could create a basic user document here
        // or handle this case differently based on your needs
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  private async checkEmailExists(_email: string): Promise<boolean> {
    // Ini adalah pendekatan yang lebih aman, tapi memerlukan Cloud Function
    // Untuk sekarang, kita biarkan Firebase Auth yang handle
    return false;
  }

  private getErrorMessage(error: AuthError): string {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/email-already-in-use':
        return 'Email already exists. Please use a different email or try logging in';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password';
      default:
        return error.message || 'An error occurred. Please try again';
    }
  }

  // Utility methods
  async getSavedCredentials(): Promise<{ email: string; rememberMe: boolean }> {
    try {
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      const savedEmail = await AsyncStorage.getItem('savedEmail');
      
      return {
        email: rememberMe === 'true' && savedEmail ? savedEmail : '',
        rememberMe: rememberMe === 'true'
      };
    } catch {
      return { email: '', rememberMe: false };
    }
  }
}

export const authService = new AuthService();
