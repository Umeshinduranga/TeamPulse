'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ApiClientError } from '@/lib/apiClient';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      router.push(user.role === 'manager' ? '/dashboard' : '/reports');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand + live-feeling preview */}
      <div className="hidden lg:flex flex-1 bg-[#0F1115] text-[#FAFAF9] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <span className="w-2 h-2 rounded-full bg-[#3FBF83] animate-pulse" />
            <span className="font-semibold text-[15px] tracking-tight">TeamPulse</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight mb-3 max-w-sm">
            Know where the week actually went.
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            One report per person, per week. No digging through Slack threads to find out who&apos;s blocked.
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-xs max-w-xs">
          <div className="flex justify-between py-1.5 border-b border-white/10">
            <span className="text-gray-300">Nadun — Client A</span>
            <span className="text-[#3FBF83]">Submitted</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-white/10">
            <span className="text-gray-300">Farzan — R&D</span>
            <span className="text-[#F2B84B]">Pending</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-300">Pradeep — Internal</span>
            <span className="text-[#3FBF83]">Submitted</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-[#FAFAF9] p-8">
        <div className="w-full max-w-[280px]">
          <h2 className="text-[19px] font-semibold text-[#0F1115] tracking-tight mb-1">Log in</h2>
          <p className="text-[13px] text-gray-500 mb-6">Enter your work email to continue.</p>
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <Input
                type="email"
                placeholder="name@sisencodigital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button type="submit" className="w-full !bg-[#0F1115]" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log in'}
            </Button>
          </form>
          <p className="text-xs text-gray-500 text-center mt-4">
            No account?{' '}
            <Link href="/register" className="text-[#0F1115] font-medium underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}