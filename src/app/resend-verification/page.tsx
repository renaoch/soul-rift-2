"use client";

import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Verification email sent!');
        setSent(true);
      } else {
        toast.error(result.error?.message || 'Failed to send email');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Email Sent!</h1>
          <p className="text-zinc-400 mb-6">Check your inbox for the verification link</p>
          <a
            href="/login"
            className="inline-block bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-zinc-100 transition-colors"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Resend Verification</h1>
          <p className="text-zinc-400">Enter your email to receive a new verification link</p>
        </div>

        <form onSubmit={handleResend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Sending...' : 'Send Verification Email'}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
