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

// Log config presence (without exposing keys if possible, but identifying issues)
console.log('Firebase Config loaded:', {
  projectId: firebaseConfig.projectId,
  hasDbUrl: !!firebaseConfig.databaseURL,
  dbUrlRegion: firebaseConfig.databaseURL?.includes('asia') ? 'Asia' : 'Other'
});

// Lazy initialization - only initialize if config values are provided
let app: any = null;
let database: any = null;

try {
  if (firebaseConfig.projectId && firebaseConfig.projectId.trim()) {
    console.log('Initializing Firebase with projectId:', firebaseConfig.projectId);
    console.log('Database URL:', firebaseConfig.databaseURL ? firebaseConfig.databaseURL : 'MISSING');

    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase config incomplete - projectId missing or empty');
  }
} catch (e) {
  console.error('Firebase initialization failed:', e);
}

export { app, database };

