'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  if (!user) return null;

  const initials = user.fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const linkClass = (path: string) =>
    `relative text-[13px] font-medium tracking-wide transition-all duration-200 pb-[18px] ${
      pathname.startsWith(path)
        ? 'text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#3FBF83] after:rounded-full'
        : 'text-[#8A8F98] hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b border-white/[0.06] backdrop-blur-xl bg-[#0F1115]/80">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-8">
        {/* Brand */}
        <Link href="/reports" className="flex items-center gap-2 group">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FBF83] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3FBF83]" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-white transition-all duration-200 group-hover:text-white/90">
            TeamPulse
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6 ml-2 pt-[18px]">
          <Link href="/reports" className={linkClass('/reports')}>
            My Reports
          </Link>
          {user.role === 'manager' && (
            <Link href="/dashboard" className={linkClass('/dashboard')}>
              Team Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Right: User Info + Logout */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E7D5B]/20 ring-1 ring-[#3FBF83]/20 transition-all duration-200">
          <span className="text-[11px] font-semibold tracking-wider text-[#3FBF83]">
            {initials}
          </span>
        </div>

        {/* Name */}
        <span className="text-[13px] font-medium text-[#8A8F98] transition-all duration-200 hidden sm:inline">
          {user.fullName}
        </span>

        {/* Divider */}
        <div className="h-4 w-px bg-white/[0.08] mx-1" />

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-[13px] font-medium text-[#5B6470] hover:text-white px-2 py-1 h-auto transition-all duration-200"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
