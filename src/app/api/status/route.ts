import { NextResponse } from 'next/server';
import { getRealtimeDb, getFirebaseAuthAdmin } from '@/lib/firebase-server';

export async function GET() {
  const dbStatus: any = {
    database: 'disconnected',
    auth: 'disconnected',
    config: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not-set',
      databaseUrl: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'not-set',
      hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    },
  };

  // Check database
  try {
    const db = getRealtimeDb();
    if (db) {
      const snapshot = await db.ref('.info/connected').get();
      if (snapshot.val() === true) {
        dbStatus.database = 'connected';
      }
    }
  } catch (err) {
    console.error('Database check error:', err);
  }

  // Check auth
  try {
    const auth = getFirebaseAuthAdmin();
    if (auth) {
      dbStatus.auth = 'connected';
    }
  } catch (err) {
    console.error('Auth check error:', err);
  }

  return NextResponse.json({
    status: dbStatus,
    message: 'Database: ' + dbStatus.database + ', Auth: ' + dbStatus.auth,
  });
}
