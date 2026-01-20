import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRealtimeDb, getFirebaseAuthAdmin } from '@/lib/firebase-server';
import { getUsers } from '@/lib/data';

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  const { uid } = params;
  try {
    // Expect an Authorization header: Bearer <idToken>
    const authHeader = request.headers.get('authorization') || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!idToken) {
      console.error('[API] GET /api/users/[uid] - missing idToken');
      return NextResponse.json({ error: 'Missing authorization token' }, { status: 401 });
    }

    const adminAuth = getFirebaseAuthAdmin();
    if (!adminAuth) {
      console.error('[API] GET /api/users/[uid] - admin auth not configured');
      return NextResponse.json({ error: 'Server not configured for token verification' }, { status: 500 });
    }

    let decoded: any;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch (err) {
      console.error('[API] GET /api/users/[uid] - token verification failed:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Only allow the user to fetch their own profile (or allow admin behavior here later)
    if (decoded.uid !== uid) {
      console.warn('[API] GET /api/users/[uid] - forbidden: requester', decoded.uid, 'requested', uid);
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Try Realtime DB first
    const db = getRealtimeDb();
    if (db) {
      try {
        const snapshot = await db.ref(`users/${uid}`).get();
        if (snapshot.exists()) {
          const profile = snapshot.val();
          // Ensure we never return secrets
          if (profile && profile.password) delete profile.password;
          return NextResponse.json(profile);
        }
      } catch (err) {
        console.error('[API] GET /api/users/[uid] - realtime db lookup failed:', err);
      }
    }

    // Fallback to local in-memory/file users
    const users = getUsers();
    const found = users.find(u => u.id === uid);
    if (found) {
      const { password: _p, ...safe } = found as any;
      return NextResponse.json(safe);
    }

    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  } catch (err) {
    console.error('[API] GET /api/users/[uid] - error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
