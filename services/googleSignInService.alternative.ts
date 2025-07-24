// Alternative Google Sign-In implementation using Expo's auth proxy
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, UserCredential } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

// Alternative hook that uses Expo's auth proxy
export function useGoogleAuthWithProxy() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '234527295517-fn85qkkar6scrst4nt21q0lq9lp3i0l1.apps.googleusercontent.com',
    iosClientId: '234527295517-tgd9bodbetesinesdbb6jh7dmbnug8lv.apps.googleusercontent.com',
    androidClientId: '234527295517-fkotqep83u0fhliklcuj729q8304t6g1.apps.googleusercontent.com',
    webClientId: '234527295517-fn85qkkar6scrst4nt21q0lq9lp3i0l1.apps.googleusercontent.com',
  });

  return { request, response, promptAsync };
}

// Process Google sign-in with proxy
export async function processGoogleSignInWithProxy(response: any): Promise<{ success: boolean; user?: UserCredential['user']; error?: string }> {
  try {
    if (response?.type !== 'success' || !response.authentication) {
      return {
        success: false,
        error: 'Google Sign-In was cancelled or failed'
      };
    }

    const { idToken, accessToken } = response.authentication;
    
    if (!idToken) {
      return {
        success: false,
        error: 'Failed to get Google ID token'
      };
    }

    // Create Firebase credential
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    
    // Sign in to Firebase
    const userCredential = await signInWithCredential(auth, credential);
    
    // Create user profile (same as before)
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        firstName: userCredential.user.displayName?.split(' ')[0] || '',
        lastName: userCredential.user.displayName?.split(' ').slice(1).join(' ') || '',
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        provider: 'google',
        createdAt: serverTimestamp(),
        lastUpdatedAt: serverTimestamp(),
        isEmailVerified: userCredential.user.emailVerified || false
      };
      
      const cleanUserData = Object.fromEntries(
        Object.entries(userData).filter(([_, value]) => value !== undefined)
      );
      
      await setDoc(userDocRef, cleanUserData);
    }
    
    return {
      success: true,
      user: userCredential.user
    };

  } catch (error) {
    console.error('Error processing Google Sign-In:', error);
    return {
      success: false,
      error: 'Failed to complete Google Sign-In'
    };
  }
}
