import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const readEnv = (key: string): string => {
  try {
    const fromVite = (import.meta as any)?.env?.[key];
    if (typeof fromVite === 'string' && fromVite.trim()) return fromVite.trim();
  } catch {
    // ignore
  }

  try {
    const fromWindow = (window as any)?.__ENV__?.[key];
    if (typeof fromWindow === 'string' && fromWindow.trim()) return fromWindow.trim();
  } catch {
    // ignore
  }

  return '';
};

// IMPORTANT: Use VITE_ keys because this file runs in the browser bundle.
const firebaseConfig = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID'),
  databaseURL: readEnv('VITE_FIREBASE_DATABASE_URL')
};

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
  console.error('Firebase initialization failed. Check your .env file and ensure all keys start with VITE_. Error details:', e);
}

export { app, database };
