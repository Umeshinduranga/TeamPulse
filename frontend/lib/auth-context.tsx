'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from './apiClient';
import { User } from './types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (fullName: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ user: User }>('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await apiClient.post<{ user: User; token: string }>('/api/auth/login', {
      email,
      password,
    });
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(fullName: string, email: string, password: string) {
    const res = await apiClient.post<{ user: User; token: string }>('/api/auth/register', {
      fullName,
      email,
      password,
    });
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    await apiClient.post('/api/auth/logout', {});
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}