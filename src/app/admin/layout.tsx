"use client";

import { useAdminGuard } from '@/app/hooks/useAdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const guard = useAdminGuard();
  if (guard === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (guard === 'blocked') return null;
  return <>{children}</>;
}
