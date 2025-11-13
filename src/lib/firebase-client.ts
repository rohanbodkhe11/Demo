import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

let app: ReturnType<typeof initializeApp> | null = null;

export function getFirebaseApp() {
  if (app) return app;
  if (typeof window === 'undefined') return null; // Server-side guard
  
  try {
    app = initializeApp(firebaseConfig);
    return app;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return null;
  }
}

export function getFirebaseAuth() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  return getAuth(firebaseApp);
}

export function getFirebaseDatabase() {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  return getDatabase(firebaseApp);
}
