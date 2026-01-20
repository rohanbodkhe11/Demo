import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUsers } from '@/lib/data';
import { getRealtimeDb, getFirebaseAuthAdmin } from '@/lib/firebase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Preferred flow: client signs in using Firebase client SDK and sends idToken here
    if (body?.idToken) {
      const adminAuth = getFirebaseAuthAdmin();
      if (!adminAuth) {
        console.error('[AUTH] Admin auth not configured');
        return NextResponse.json({ error: 'Server not configured for token verification' }, { status: 500 });
      }

      try {
        const decoded = await adminAuth.verifyIdToken(body.idToken as string);
        const uid = decoded.uid;
        console.log('[AUTH] Verified idToken for uid:', uid);

        // Try Realtime DB for profile
        const db = getRealtimeDb();
        if (db) {
          try {
            const snapshot = await db.ref(`users/${uid}`).get();
            if (snapshot.exists()) {
              const profile = snapshot.val();
              return NextResponse.json(profile);
            }
          } catch (err) {
            console.error('[AUTH] Realtime DB lookup failed:', err);
          }
        }

        // Fallback to in-memory/file data
        const users = getUsers();
        const found = users.find(u => u.id === uid);
        if (found) return NextResponse.json(found);

        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      } catch (err) {
        console.error('[AUTH] Token verification failed:', err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    }

    // Deprecated/direct-password login is no longer supported — do not compare raw passwords server-side
    console.log('[AUTH] /api/auth/login called without idToken — reject');
    return NextResponse.json({ error: 'Use Firebase client SDK to sign in and send idToken' }, { status: 400 });
  } catch (err) {
    console.error('[AUTH] Error:', err);
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}
