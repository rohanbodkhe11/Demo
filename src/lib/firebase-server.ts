import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { getAuth } from 'firebase-admin/auth';

let app: ReturnType<typeof initializeApp> | null = null;
let dbInstance: ReturnType<typeof getDatabase> | null = null;
let authInstance: ReturnType<typeof getAuth> | null = null;

export function getFirebaseApp() {
  if (app || getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  // Check for Firebase service account key (for server-side operations)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const databaseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  
  if (!databaseUrl) {
    console.warn('Firebase Database URL not configured');
    return null;
  }

  if (serviceAccountJson) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      app = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: databaseUrl,
      });
      console.log('✓ Firebase Admin initialized with service account');
      return app;
    } catch (err) {
      console.error('Failed to initialize Firebase with service account:', err);
    }
  } else {
    console.warn('No Firebase service account provided - some features may be limited');
  }

  return null;
}

export function getRealtimeDb() {
  if (dbInstance) return dbInstance;
  
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    console.warn('Firebase app not initialized - database access disabled');
    return null;
  }
  
  try {
    dbInstance = getDatabase(firebaseApp);
    console.log('✓ Firebase Realtime Database connected');
    return dbInstance;
  } catch (err) {
    console.error('Failed to get Firebase database:', err);
    return null;
  }
}

export function getFirebaseAuthAdmin() {
  if (authInstance) return authInstance;
  
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    console.warn('Firebase app not initialized - auth disabled');
    return null;
  }
  
  try {
    authInstance = getAuth(firebaseApp);
    console.log('✓ Firebase Authentication enabled');
    return authInstance;
  } catch (err) {
    console.error('Failed to get Firebase auth:', err);
    return null;
  }
}
