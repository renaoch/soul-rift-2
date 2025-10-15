"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2, Mail, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Supabase sends 'code' parameter for email verification
        const code = searchParams.get('code');
        const type = searchParams.get('type');

        if (code) {
          // Exchange the code for a session by calling Supabase
          const response = await fetch('/api/auth/verify-email-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          const result = await response.json();

          if (result.success && result.user?.email) {
            setUserEmail(result.user.email);
            setStatus('success');
            toast.success('Email verified!');
            
            // Redirect to phone verification after 3 seconds
            setTimeout(() => {
              router.push('/verify-phone');
            }, 3000);
          } else {
            setStatus('error');
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="max-w-md w-full mx-4">
          <div className="bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800">
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-white animate-spin" />
            <h1 className="text-2xl font-bold text-white mb-2">Verifying your email...</h1>
            <p className="text-zinc-400">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="max-w-md w-full mx-4">
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 text-center">Confirmation Failed</h1>
            <p className="text-zinc-400 mb-6 text-center">The confirmation link may have expired or is invalid</p>

            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Possible Solutions
              </h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                  Check if the confirmation link has expired
                </li>
                <li className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                  Ensure you clicked the correct link from your email
                </li>
                <li className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                  Try requesting a new confirmation email
                </li>
                <li className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                  Check your spam/junk folder
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push('/login')}
                className="flex-1 bg-white text-black py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
              >
                Back to Login
              </button>
              <button
                onClick={() => router.push('/resend-verification')}
                className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-medium hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                Resend Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">Email Confirmed!</h1>
          <p className="text-zinc-400 mb-1">Your email has been verified</p>
          {userEmail && (
            <p className="text-sm text-zinc-500 mb-6">{userEmail}</p>
          )}

          <div className="bg-zinc-800 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center justify-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span className="text-white font-medium">{userEmail}</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm">
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-zinc-400">Account is now active</span>
            </div>
          </div>

          <div className="text-sm text-zinc-500">
            Redirecting to phone verification in 3 seconds...
          </div>
        </div>
      </div>
    </div>
  );
}
