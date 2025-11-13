
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User, Role } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: Role) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (data: Omit<User, 'id' | 'avatarUrl'|'attendance'>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client: fetch users from the server API
    async function load() {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const allUsers: User[] = await res.json();
          setUsers(allUsers);
        }
      } catch (err) {
        // ignore; we'll operate with an empty user list
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('user');
        }
      }

      setIsLoading(false);
    }

    load();
  }, []);

  const login = async (email: string, password: string, role: Role): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.error || 'Login failed' };
      }
      const foundUser: User = await res.json();
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An error occurred' };
    }
  };

  const register = async (data: Omit<User, 'id' | 'avatarUrl' | 'attendance' >): Promise<{ success: boolean; error?: string }> => {
    try {
      // Assign ID for new user
      const newUserData = {
        id: `user-${Date.now()}`,
        ...data,
        avatarUrl: 'https://placehold.co/100x100.png'
      };
      
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      
      if (res.status === 409) {
        return { success: false, error: 'Email already exists' };
      }
      if (!res.ok) {
        const error = await res.json();
        return { success: false, error: error.error || 'Registration failed' };
      }
      
      const created: User = await res.json();
      setUsers(prev => [...prev, created]);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An error occurred' };
    }
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
