"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyPhonePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const formatPhoneDisplay = (value: string) => {
    if (value.length === 0) return '';
    if (value.length <= 5) return value;
    return `${value.slice(0, 5)} ${value.slice(5)}`;
  };

  const sendCode = async () => {
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const fullPhone = `+91${phone}`;
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Verification code sent!', {
          description: `Check your messages at +91 ${formatPhoneDisplay(phone)}`,
        });
        setStep('code');
        setCountdown(60);
      } else {
        toast.error(result.error?.message || 'Failed to send code');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (code.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    const fullPhone = `+91${phone}`;
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, code }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Phone verified!', {
          description: 'Welcome to Soul Rift',
        });
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        toast.error(result.error?.message || 'Invalid code');
        setCode('');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    
    if (value.length === 6) {
      setTimeout(() => {
        verifyCode();
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'phone' ? 'Verify your phone' : 'Enter code'}
          </h1>
          <p className="text-zinc-400">
            {step === 'phone' 
              ? 'We\'ll send you a 6-digit verification code'
              : `Code sent to +91 ${formatPhoneDisplay(phone)}`
            }
          </p>
        </div>

        {step === 'phone' && (
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <span className="text-white font-medium">🇮🇳</span>
                    <span className="text-zinc-400 font-medium">+91</span>
                    <div className="w-px h-6 bg-zinc-700 ml-1" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneInput}
                    placeholder="98765 43210"
                    className="w-full pl-24 pr-4 py-3.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-lg placeholder:text-zinc-500 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Enter your 10-digit mobile number
                </p>
              </div>

              <button
                onClick={sendCode}
                disabled={loading || phone.length !== 10}
                className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Code
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'code' && (
          <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800">
            <div className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={handleCodeInput}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-center text-3xl font-bold tracking-[0.5em] placeholder:text-zinc-600 placeholder:tracking-normal focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                  autoFocus
                />
                <p className="text-xs text-zinc-500 mt-2 text-center">
                  Enter the 6-digit code sent to your phone
                </p>
              </div>

              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className="w-full bg-white text-black py-3.5 rounded-xl font-semibold hover:bg-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Verify Code
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <button
                  onClick={() => sendCode()}
                  disabled={countdown > 0 || loading}
                  className="text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>

                <button
                  onClick={() => {
                    setStep('phone');
                    setCode('');
                    setCountdown(0);
                  }}
                  className="text-sm text-zinc-400 hover:text-white transition-colors font-medium"
                >
                  Change Number
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
