import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUsers } from '@/lib/data';
import { getRealtimeDb } from '@/lib/firebase-server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();
    console.log('[AUTH] Login attempt:', email, 'as', role);
    
    // First try Firebase Realtime Database
    const db = getRealtimeDb();
    if (db) {
      try {
        console.log('[AUTH] Querying Firebase for user...');
        const snapshot = await db.ref('users').get();
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          let users: any[] = [];
          if (typeof usersData === 'object' && !Array.isArray(usersData)) {
            users = Object.values(usersData);
          } else if (Array.isArray(usersData)) {
            users = usersData;
          }
          
          const found = users.find(
            (u: any) => u.email === email && u.password === password && u.role === role
          );
          if (found) {
            console.log('[AUTH] ✓ User authenticated from Firebase:', email);
            const { password: _p, ...safe } = found;
            return NextResponse.json(safe);
          }
        }
      } catch (err) {
        console.error('[AUTH] Firebase error:', err);
        // fall back to file-based
      }
    }

    // Fallback to file-based users
    console.log('[AUTH] Using fallback authentication');
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password && u.role === role);
    if (!found) {
      console.log('[AUTH] Login failed - invalid credentials:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    console.log('[AUTH] ✓ User authenticated (fallback):', email);
    const { password: _p, ...safe } = found as any;
    return NextResponse.json(safe);
  } catch (err) {
    console.error('[AUTH] Error:', err);
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}
