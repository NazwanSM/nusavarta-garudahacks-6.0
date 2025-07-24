import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET
} from '@env';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import getReactNativePersistence with fallback for TypeScript
let getReactNativePersistence: any;
try {
  getReactNativePersistence = require('firebase/auth').getReactNativePersistence;
} catch (error) {
  console.warn('getReactNativePersistence not available');
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native AsyncStorage persistence
let auth: Auth;
try {
  if (getReactNativePersistence) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  } else {
    throw new Error('getReactNativePersistence not available');
  }
} catch (error) {
  // Fallback to getAuth if initializeAuth fails
  console.log('Using fallback auth initialization');
  auth = getAuth(app);
}

const db = getFirestore(app);

// Ekspor layanan agar bisa digunakan di file lain
export { auth, db };

