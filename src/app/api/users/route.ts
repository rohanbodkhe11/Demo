import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUsers, saveUsers } from '@/lib/data';
import { getRealtimeDb } from '@/lib/firebase-server';

export async function GET() {
  const db = getRealtimeDb();
  if (db) {
    try {
      console.log('[API] GET /api/users - Querying Firebase...');
      const snapshot = await db.ref('users').get();
      if (snapshot.exists()) {
        const users = snapshot.val();
        console.log('[API] ✓ Firebase returned data');
        // Convert Firebase object to array if needed
        if (typeof users === 'object' && !Array.isArray(users)) {
          return NextResponse.json(Object.values(users));
        }
        return NextResponse.json(Array.isArray(users) ? users : []);
      } else {
        console.log('[API] Firebase users table is empty, returning fallback');
      }
    } catch (err) {
      console.error('[API] Firebase error:', err);
      // fall through to fallback
    }
  } else {
    console.log('[API] Firebase not configured, using fallback');
  }

  const users = getUsers();
  console.log('[API] Returning', users.length, 'users from fallback');
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if email already exists (prevent duplicates)
    const db = getRealtimeDb();
    if (db) {
      try {
        console.log('[API] POST /api/users - Checking for duplicate email in Firebase...');
        const snapshot = await db.ref('users').get();
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          let existingUsers: any[] = [];
          if (typeof usersData === 'object' && !Array.isArray(usersData)) {
            existingUsers = Object.values(usersData);
          } else if (Array.isArray(usersData)) {
            existingUsers = usersData;
          }
          
          const emailExists = existingUsers.some((u: any) => u.email === body.email);
          if (emailExists) {
            console.log('[API] Email already exists:', body.email);
            return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
          }
        }
        
        // Email doesn't exist, save to Firebase
        console.log('[API] Saving user to Firebase:', body.id);
        await db.ref(`users/${body.id}`).set(body);
        console.log('[API] ✓ User saved to Firebase');
        return NextResponse.json(body, { status: 201 });
      } catch (err) {
        console.error('[API] Firebase write error:', err);
        // fall back to file persistence
      }
    } else {
      console.log('[API] Firebase not available, checking local users for duplicates');
      const users = getUsers();
      if (users.some(u => u.email === body.email)) {
        console.log('[API] Email already exists (local):', body.email);
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
      }
    }

    // Fall back to file-based persistence
    console.log('[API] Using file-based persistence');
    const users = getUsers();
    users.push(body);
    saveUsers(users);
    return NextResponse.json(body, { status: 201 });
  } catch (err) {
    console.error('[API] Error:', err);
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}
