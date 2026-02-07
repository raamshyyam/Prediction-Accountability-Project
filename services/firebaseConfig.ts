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

// Lazy initialization - only initialize if config values are provided
let app: any = null;
let database: any = null;
let initialized = false;

const initializeFirebase = () => {
  if (initialized) return;
  initialized = true;
  
  // Only initialize if we have a projectId
  if (firebaseConfig.projectId && firebaseConfig.projectId.trim()) {
    try {
      app = initializeApp(firebaseConfig);
      database = getDatabase(app);
      console.log('Firebase initialized successfully');
    } catch (e) {
      console.warn('Firebase initialization failed:', e);
      app = null;
      database = null;
    }
  } else {
    console.warn('Firebase config incomplete, skipping initialization');
    app = null;
    database = null;
  }
};

// Initialize on first import, but don't block
setTimeout(initializeFirebase, 0);

export { app, database };

