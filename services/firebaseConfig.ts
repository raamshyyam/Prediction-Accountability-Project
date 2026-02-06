import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// ⚠️ IMPORTANT: Replace these with your Firebase Config
// Get these values from Firebase Console: https://console.firebase.google.com/
// Project Settings -> General -> Web App Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || process.env.FIREBASE_DATABASE_URL || ""
};

// Debug log
console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  databaseURL: firebaseConfig.databaseURL,
  hasApiKey: !!firebaseConfig.apiKey
});

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);

