'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiClientError } from '@/lib/apiClient';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(fullName, email, password);
      router.push('/reports');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 bg-[#0F1115] text-[#FAFAF9] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <span className="w-2 h-2 rounded-full bg-[#3FBF83] animate-pulse" />
            <span className="font-semibold text-[15px] tracking-tight">TeamPulse</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight mb-3 max-w-sm">
            One form. Same seven fields. Every week.
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Structured enough to compare across the team, simple enough to fill out in two minutes.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs max-w-xs">
          <div className="text-gray-300 mb-2">This week&apos;s tasks completed</div>
          <div className="text-gray-500">Built auth system, wired RBAC middleware...</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-[#FAFAF9] p-8">
        <div className="w-full max-w-[280px]">
          <h2 className="text-[19px] font-semibold text-[#0F1115] tracking-tight mb-1">Create your account</h2>
          <p className="text-[13px] text-gray-500 mb-6">You&apos;ll be added as a team member.</p>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Full name</label>
              <Input placeholder="Umesh Induranga" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <Input type="email" placeholder="name@sisencodigital.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Password</label>
              <Input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button type="submit" className="w-full !bg-[#0F1115]" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-[#0F1115] font-medium underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}