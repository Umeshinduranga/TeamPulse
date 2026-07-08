// frontend/lib/auth-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from './apiClient';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'member' | 'manager';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient<User>('/auth/me', { method: 'GET' });
        if (res.success && res.data) setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (data: any) => {
    await apiClient('/auth/login', { method: 'POST', data });
    const me = await apiClient<User>('/auth/me', { method: 'GET' });
    setUser(me.data!);
    router.push(me.data!.role === 'manager' ? '/dashboard' : '/reports');
  };

  const register = async (data: any) => {
    await apiClient('/auth/register', { method: 'POST', data });
    const me = await apiClient<User>('/auth/me', { method: 'GET' });
    setUser(me.data!);
    router.push(me.data!.role === 'manager' ? '/dashboard' : '/reports');
  };

  const logout = async () => {
    await apiClient('/auth/logout', { method: 'GET' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};