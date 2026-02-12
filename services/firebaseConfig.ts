import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { readPublicEnv } from '../utils/envConfig';

const readEnv = (key: string): string => {
  return readPublicEnv(key);
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

// Log config presence (without exposing keys)
const maskedKey = (key: string | undefined) => key && key.length > 5 ? `${key.substring(0, 5)}...` : (key ? '(present)' : '(MISSING)');

console.log('Firebase Config Debug:', {
  apiKey: maskedKey(firebaseConfig.apiKey),
  authDomain: maskedKey(firebaseConfig.authDomain),
  projectId: maskedKey(firebaseConfig.projectId),
  storageBucket: maskedKey(firebaseConfig.storageBucket),
  messagingSenderId: maskedKey(firebaseConfig.messagingSenderId),
  appId: maskedKey(firebaseConfig.appId),
  databaseURL: maskedKey(firebaseConfig.databaseURL)
});

// Lazy initialization - only initialize if config values are provided
let app: any = null;
let database: any = null;

try {
  const requiredKeys: Array<keyof typeof firebaseConfig> = [
    'apiKey',
    'authDomain',
    'projectId',
    'appId',
    'databaseURL'
  ];
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key] || !firebaseConfig[key].trim());

  if (missingKeys.length === 0) {
    console.log('Initializing Firebase with projectId:', firebaseConfig.projectId);
    console.log('Database URL:', firebaseConfig.databaseURL ? firebaseConfig.databaseURL : 'MISSING');

    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase config incomplete. Missing keys:', missingKeys.join(', '));
  }
} catch (e) {
  console.error('Firebase initialization failed. Check your .env file and ensure all keys start with VITE_. Error details:', e);
}

export { app, database };
