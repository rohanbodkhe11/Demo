
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User, Role } from '@/lib/types';
import { getFirebaseAuth } from '@/lib/firebase-client';
import { enqueuePending, processAllQueues } from '@/lib/offline-queue';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: Role; class?: string; department?: string }) => Promise<{ success: boolean; error?: string; queued?: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      console.warn('[Auth] Firebase auth not available on client');
      setIsLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      try {
        if (fbUser) {
          console.log('[Auth] onAuthStateChanged - signed in:', fbUser.uid, fbUser.email);
          // Fetch profile from our API (Realtime DB / fallback) by UID
          try {
            const res = await fetch('/api/users');
            if (res.ok) {
              const allUsers: User[] = await res.json();
              const profile = allUsers.find(u => u.id === fbUser.uid) || null;
              if (profile) {
                setUser(profile);
                if (typeof window !== 'undefined') localStorage.setItem('uid', fbUser.uid);
              } else {
                // Profile missing — create a minimal one locally until user completes profile
                const minimal: User = {
                  id: fbUser.uid,
                  name: fbUser.displayName || '',
                  email: fbUser.email || '',
                  role: 'student',
                  avatarUrl: fbUser.photoURL || 'https://placehold.co/100x100.png',
                } as User;
                setUser(minimal);
                if (typeof window !== 'undefined') localStorage.setItem('uid', fbUser.uid);
              }
            } else {
              console.warn('[Auth] Failed to fetch profiles after sign-in');
              setUser(null);
            }
          } catch (err) {
            console.error('[Auth] Error fetching user profile:', err);
            setUser(null);
          }
        } else {
          console.log('[Auth] onAuthStateChanged - signed out');
          setUser(null);
          if (typeof window !== 'undefined') localStorage.removeItem('uid');
        }
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // Try to process any pending offline queues when client becomes online
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tryFlush = () => {
      if (navigator.onLine) {
        void processAllQueues();
      }
    };
    tryFlush();
    window.addEventListener('online', tryFlush);
    return () => window.removeEventListener('online', tryFlush);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const auth = getFirebaseAuth();
    if (!auth) return { success: false, error: 'Auth not available' };
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log('[Auth] signInWithEmailAndPassword success:', cred.user.uid);
      // after sign-in, onAuthStateChanged will fetch the profile and set user
      if (typeof window !== 'undefined') localStorage.setItem('uid', cred.user.uid);
      return { success: true };
    } catch (err: any) {
      console.error('[Auth] Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (data: { name: string; email: string; password: string; role: Role; class?: string; department?: string }): Promise<{ success: boolean; error?: string; queued?: boolean }> => {
    const auth = getFirebaseAuth();
    if (!auth) return { success: false, error: 'Auth not available' };

    try {
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const uid = cred.user.uid;
      console.log('[Auth] createUserWithEmailAndPassword success:', uid);

      // Build profile WITHOUT password
      const profile = {
        id: uid,
        name: data.name,
        email: data.email,
        role: data.role,
        class: data.class,
        department: data.department,
        avatarUrl: 'https://placehold.co/100x100.png',
      };

      // Save profile to our API (server will write to Realtime DB or fallback)
      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile),
        });

        if (!res.ok) {
          // Queue profile locally for later sync and still treat registration as succeeded
          if (typeof window !== 'undefined') enqueuePending('pendingUsers', profile);
          console.warn('[Auth] Failed to save profile to API, queued for later sync');
          setUser(profile as User);
          if (typeof window !== 'undefined') localStorage.setItem('uid', uid);
          return { success: true, queued: true };
        }

        // onAuthStateChanged will handle loading the profile; but set immediately for responsiveness
        setUser(profile as User);
        if (typeof window !== 'undefined') localStorage.setItem('uid', uid);
        return { success: true };
      } catch (err) {
        // Network error: enqueue and return success with queued flag
        if (typeof window !== 'undefined') enqueuePending('pendingUsers', profile);
        console.warn('[Auth] Network error saving profile, queued for later sync', err);
        setUser(profile as User);
        if (typeof window !== 'undefined') localStorage.setItem('uid', uid);
        return { success: true, queued: true };
      }
    } catch (err: any) {
      console.error('[Auth] Registration error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error('[Auth] Sign-out error:', err);
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem('uid');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
