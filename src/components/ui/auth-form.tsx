"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "../../hooks/use-auth";
import {
  Github,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Truck,
  Shield
} from "lucide-react";
import Image from "next/image";
import MemoizedHyperspeed from "@/components/MemorizedHyperspeed";
import { Route } from "next";
import { toast } from 'sonner';

import type {HyperspeedOptions}  from '../Hyperspeed';

export default function AuthForm() {
  const router = useRouter();
  const { login, register, resetPassword, isLoading, error, clearError } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const hyperspeedOptions: Partial<HyperspeedOptions> = useMemo(() => ({
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5] as [number, number],
    lightStickHeight: [1.3, 1.7] as [number, number],
    movingAwaySpeed: [60, 80] as [number, number],
    movingCloserSpeed: [-120, -160] as [number, number],
    carLightsLength: [400 * 0.03, 400 * 0.2] as [number, number],
    carLightsRadius: [0.05, 0.14] as [number, number],
    carWidthPercentage: [0.3, 0.5] as [number, number],
    carShiftX: [-0.8, 0.8] as [number, number],
    carFloorSeparation: [0, 5] as [number, number],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0xFFFFFF,
      brokenLines: 0xFFFFFF,
      leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
      rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
      sticks: 0x03B3C3,
    }
  }), []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (showResetPassword) {
      const success = await resetPassword(formData.email);
      if (success) {
        toast.success('Password reset email sent!', {
          description: 'Check your inbox for the reset link.',
        });
        setShowResetPassword(false);
      }
      return;
    }

    let success = false;

    if (isSignUp) {
      const loadingToast = toast.loading('Creating your account...');
      
      success = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success('Registration successful!', {
          description: 'Please check your email to verify your account.',
          duration: 5000,
        });
        setIsSignUp(false);
        setFormData({ firstName: '', lastName: '', email: '', password: '' });
      }
    } else {
      const loadingToast = toast.loading('Signing you in...');
      
      success = await login(formData.email, formData.password);
      
      toast.dismiss(loadingToast);
      
      if (success) {
        toast.success('Welcome back!', {
          description: 'Redirecting to your dashboard...',
        });
        
        setTimeout(() => {
          router.push('/dashboard' as Route);
        }, 500);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setShowPassword(false);
    setShowResetPassword(false);
    setFormData({ firstName: '', lastName: '', email: '', password: '' });
    if (error) clearError();
  };

  const handleResetPassword = () => {
    setShowResetPassword(true);
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#191970' }}>
      {/* Left side - Hero Section */}
      <div className="relative hidden lg:flex lg:flex-1 overflow-hidden" style={{ backgroundColor: '#0F1419' }}>
        <div id="lights" className="absolute z-10 w-[25vw] h-[50vh]">
          <MemoizedHyperspeed effectOptions={hyperspeedOptions} />
        </div>

        <div className="flex flex-col justify-center items-center p-12 text-center relative z-10">
          <div className="mb-8 flex flex-col items-center">
            <Image className="rounded-full mb-6" src="/logo-no.png" alt="" height={120} width={120}/>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
              Soul Rift
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-md leading-relaxed">
              {showResetPassword
                ? "Reset your spectral key and regain access to the ethereal realm."
                : isSignUp
                ? "Enter the ethereal realm of premium designs. Create your account to unlock exclusive spectral collections."
                : "Return to your spiritual journey. Access your ghostly wardrobe and transcendent style discoveries."
              }
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-center text-white/90 group">
              <Sparkles className="w-5 h-5 mr-4 group-hover:text-white transition-colors" />
              <span>{isSignUp ? "Ethereal Quality Materials" : "Access Spectral Designs"}</span>
            </div>
            <div className="flex items-center text-white/90 group">
              <Truck className="w-5 h-5 mr-4 group-hover:text-white transition-colors" />
              <span>{isSignUp ? "Phantom-Fast Shipping" : "Track Your Soul Journey"}</span>
            </div>
            <div className="flex items-center text-white/90 group">
              <Shield className="w-5 h-5 mr-4 group-hover:text-white transition-colors" />
              <span>{isSignUp ? "30-Day Spirit Guarantee" : "Protected Realm Shopping"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12" style={{ backgroundColor: '#F8F8FF' }}>
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#191970' }}>
              {showResetPassword 
                ? "Reset Your Key" 
                : isSignUp 
                ? "Join the Rift" 
                : "Enter the Realm"
              }
            </h2>
            <p className="text-gray-600">
              {showResetPassword
                ? "Enter your email to receive a password reset link."
                : isSignUp
                ? "Transcend into our spectral marketplace and discover otherworldly designs."
                : "Welcome back, wanderer. Step through the veil and continue your journey."
              }
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && !showResetPassword && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="firstName" className="text-gray-700">First name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName"
                    placeholder="Spirit" 
                    type="text" 
                    required 
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastName" className="text-gray-700">Last name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName"
                    placeholder="Walker" 
                    type="text" 
                    required 
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </LabelInputContainer>
              </div>
            )}

            <LabelInputContainer>
              <Label htmlFor="email" className="text-gray-700 flex items-center">
                <Mail className="w-4 h-4 mr-2" style={{ color: '#191970' }} />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="spirit@soulrift.com"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </LabelInputContainer>

            {!showResetPassword && (
              <LabelInputContainer>
                <Label htmlFor="password" className="text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" style={{ color: '#191970' }} />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </LabelInputContainer>
            )}

            {!isSignUp && !showResetPassword && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#191970] focus:ring-[#191970] focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="text-sm font-medium hover:underline transition-colors"
                  style={{ color: '#191970' }}
                >
                  Lost your way?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-lg font-medium text-white transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#191970',
                opacity: isLoading ? 0.5 : 1 
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {showResetPassword ? "Sending..." : isSignUp ? "Creating Account..." : "Signing In..."}
                </div>
              ) : (
                showResetPassword ? "Send Reset Email" : isSignUp ? "Create Account" : "Sign In"
              )}
            </button>

            {!showResetPassword && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-500" style={{ backgroundColor: '#F8F8FF' }}>
                      Or {isSignUp ? 'transcend' : 'enter'} with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="group/btn relative flex h-12 items-center justify-center space-x-2 rounded-lg border-2 border-gray-200 px-4 font-medium text-gray-700 transition-all duration-300 hover:shadow-lg hover:border-[#191970]/30 hover:bg-white"
                    style={{ backgroundColor: '#FFFFFF' }}
                    type="button"
                    onClick={() => toast.info('Google login coming soon!')}
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-sm">Google</span>
                  </button>
                  <button
                    className="group/btn relative flex h-12 items-center justify-center space-x-2 rounded-lg border-2 border-gray-200 px-4 font-medium text-gray-700 transition-all duration-300 hover:shadow-lg hover:border-[#191970]/30 hover:bg-white"
                    style={{ backgroundColor: '#FFFFFF' }}
                    type="button"
                    onClick={() => toast.info('GitHub login coming soon!')}
                  >
                    <Github className="h-4 w-4" />
                    <span className="text-sm">GitHub</span>
                  </button>
                </div>
              </>
            )}

            <div className="text-center text-sm text-gray-600">
              {showResetPassword ? (
                <>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="font-medium hover:underline transition-colors"
                    style={{ color: '#191970' }}
                  >
                    Sign in here
                  </button>
                </>
              ) : (
                <>
                  {isSignUp ? "Already part of the realm?" : "New to the spectral plane?"}{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="font-medium hover:underline transition-colors"
                    style={{ color: '#191970' }}
                  >
                    {isSignUp ? "Enter here" : "Begin your transcendence"}
                  </button>
                </>
              )}
            </div>

            {!isSignUp && !showResetPassword && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Guest mode activated!');
                    router.push('/browse' as Route);
                  }}
                  className="w-full h-12 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 font-medium transition-all duration-300 hover:border-[#191970]/50 hover:bg-gray-50/50 hover:text-[#191970] group"
                >
                  <span className="flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    Browse as Phantom
                  </span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
