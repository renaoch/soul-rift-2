"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  Sparkles,
  Award,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  Palette,
  Upload,
  BarChart3,
  Mail,
  Instagram,
  Twitter,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

export default function BecomeArtistPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    portfolio_url: '',
    instagram_handle: '',
    twitter_handle: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.display_name.trim()) {
      toast.error('Display name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/artist/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Welcome to Soul Rift Artists!', {
          description: 'Your artist profile has been created successfully.',
        });
        
        setTimeout(() => {
          router.push('/artist/dashboard');
        }, 1000);
      } else {
        toast.error(result.error?.message || 'Failed to create artist profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Artist profile creation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ProductsNav />
      
      <main className="relative w-full bg-black min-h-screen pt-24 pb-20">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Glows */}
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#ff6b35]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#00d9ff]" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div 
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl backdrop-blur-3xl border shadow-2xl mb-8 group hover:scale-105 transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #ff6b3515, #ff313110)',
                borderColor: '#ff6b3530',
                boxShadow: '0 20px 60px #ff6b3520'
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#ff6b35]" />
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                Join Our Community
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.85] tracking-tighter relative mb-8">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="absolute inset-0"
                  style={{
                    color: '#ff6b35',
                    opacity: 0.15 - (i * 0.02),
                    transform: `translate(${i * 3}px, ${i * 3}px)`,
                    zIndex: -i
                  }}
                >
                  Become an Artist
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Become an Artist
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
              Share your creativity with thousands of customers and earn <span className="text-[#ff6b35] font-bold">30% commission</span> on every sale
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl hover:scale-[1.02] transition-all text-center"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <div 
                className="w-20 h-20 rounded-2xl backdrop-blur-xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #ff6b3530, #ff313120)',
                  boxShadow: '0 10px 40px #ff6b3530'
                }}
              >
                <DollarSign className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Earn 30%</h3>
              <p className="text-gray-400 leading-relaxed">
                Get 30% commission on every product sold with your design. No upfront costs.
              </p>
            </div>

            <div 
              className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl hover:scale-[1.02] transition-all text-center"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <div 
                className="w-20 h-20 rounded-2xl backdrop-blur-xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff30, #39ff1420)',
                  boxShadow: '0 10px 40px #00d9ff30'
                }}
              >
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Global Reach</h3>
              <p className="text-gray-400 leading-relaxed">
                Your designs reach thousands of customers across India and beyond.
              </p>
            </div>

            <div 
              className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl hover:scale-[1.02] transition-all text-center"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <div 
                className="w-20 h-20 rounded-2xl backdrop-blur-xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'linear-gradient(135deg, #39ff1430, #00d9ff20)',
                  boxShadow: '0 10px 40px #39ff1430'
                }}
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-3">Grow Your Brand</h3>
              <p className="text-gray-400 leading-relaxed">
                Build your following, showcase your portfolio, and grow as an artist.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left - Benefits & Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-black text-white mb-8 flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#ff6b35]" />
                  Why Join Soul Rift?
                </h2>

                <div className="space-y-4">
                  {[
                    { icon: Palette, title: 'Creative Freedom', desc: 'Upload unlimited designs and express your unique style' },
                    { icon: Upload, title: 'Easy Upload', desc: 'Simple design upload process with instant preview' },
                    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track views, likes, and earnings in your dashboard' },
                    { icon: CheckCircle2, title: 'Quality Support', desc: 'Dedicated artist support team to help you succeed' },
                  ].map((feature, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #ff6b3520, #ff313110)',
                        }}
                      >
                        <feature.icon className="w-6 h-6 text-[#ff6b35]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                        <p className="text-gray-400 text-sm">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                {[
                  { value: '500+', label: 'Active Artists' },
                  { value: '₹50L+', label: 'Paid Out' },
                  { value: '10K+', label: 'Designs' },
                ].map((stat, idx) => (
                  <div 
                    key={idx}
                    className="text-center p-5 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                      border: '1px solid rgba(255,107,53,0.2)',
                    }}
                  >
                    <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Application Form */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <h2 className="text-3xl font-black text-white mb-2">Start Your Journey</h2>
              <p className="text-gray-400 mb-8">Fill out the form below to create your artist profile</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    placeholder="Your artist name"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all resize-none"
                    placeholder="Tell us about your art and style..."
                  />
                </div>

                {/* Portfolio URL */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#ff6b35]" />
                    Portfolio Website
                  </label>
                  <input
                    type="url"
                    name="portfolio_url"
                    value={formData.portfolio_url}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    placeholder="https://yourportfolio.com"
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-[#ff6b35]" />
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="instagram_handle"
                      value={formData.instagram_handle}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-[#ff6b35]" />
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter_handle"
                      value={formData.twitter_handle}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                      placeholder="@username"
                    />
                  </div>
                </div>

                {/* Terms */}
                <div 
                  className="p-5 rounded-2xl bg-black/40 border border-white/10"
                >
                  <p className="text-sm text-gray-400 leading-relaxed">
                    By creating an artist profile, you agree to our{' '}
                    <a href="/terms" className="text-[#ff6b35] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-[#ff6b35] hover:underline">Privacy Policy</a>.
                    You'll earn 30% commission on all sales.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative overflow-hidden w-full py-5 rounded-2xl font-bold text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                    boxShadow: '0 20px 60px #ff6b3550'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Artist Profile
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
