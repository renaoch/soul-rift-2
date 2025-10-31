"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type GuardStatus = 'loading' | 'allowed' | 'blocked';

export function useAdminGuard() {
  const router = useRouter();
  const [status, setStatus] = useState<GuardStatus>('loading');

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        // Call a lightweight endpoint that returns { ok: boolean }
        // Reuse your existing /api/admin/dashboard but only HEAD or a small GET:
        const res = await fetch('/api/admin/dashboard', { method: 'GET' });
        const ok = res.ok;
        if (!active) return;

        if (ok) {
          setStatus('allowed');
        } else {
          setStatus('blocked');
          toast.error('Access denied - Admin only');
          router.replace('/'); // send to home
        }
      } catch {
        if (!active) return;
        setStatus('blocked');
        toast.error('Access denied - Admin only');
        router.replace('/');
      }
    };

    check();
    return () => {
      active = false;
    };
  }, [router]);

  return status;
}
