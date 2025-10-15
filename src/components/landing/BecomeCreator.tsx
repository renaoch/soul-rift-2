"use client";

import { ArrowRight, Sparkles, TrendingUp, Zap, Shield, DollarSign, Users } from 'lucide-react';

const stats = [
  { icon: DollarSign, value: '25-40%', label: 'Commission', color: '#ff6b35' },
  { icon: Users, value: '1.2K+', label: 'Artists', color: '#00d9ff' },
  { icon: TrendingUp, value: '$2M+', label: 'Paid Out', color: '#39ff14' },
];

const benefits = [
  { icon: Zap, text: 'No upfront costs or inventory', color: '#ff6b35' },
  { icon: DollarSign, text: 'Keep 25-40% of every sale', color: '#00d9ff' },
  { icon: Users, text: 'Access to 50K+ potential customers', color: '#39ff14' },
  { icon: TrendingUp, text: 'Weekly payouts to your account', color: '#ff6b35' },
  { icon: Sparkles, text: 'Full creative control', color: '#00d9ff' },
  { icon: Shield, text: 'Marketing & promotion support', color: '#39ff14' },
];

export default function BecomeCreator() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 bg-gradient-to-r from-[#ff6b35] via-[#00d9ff] to-[#39ff14]" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Main Card */}
        <div className="relative rounded-3xl border border-white/10 overflow-hidden">
          {/* Grid Layout */}
          <div className="grid lg:grid-cols-5 gap-0">
            
            {/* Left Section - 2 columns */}
            <div className="lg:col-span-2 p-12 border-r border-white/10">
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5">
                  <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Join The Community
                  </span>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-5xl font-black text-white leading-tight tracking-tight mb-4">
                    Turn Art Into Income
                  </h2>
                  <p className="text-base text-gray-400 leading-relaxed">
                    Join 1,200+ independent artists building sustainable income from their creativity
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div 
                        className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xl font-black text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="group w-full px-6 py-4 rounded-xl bg-white text-black font-bold hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl">
                    Start Selling Today
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full px-6 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-all">
                    View Artist Guidelines
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  No credit card required • Free forever
                </p>
              </div>
            </div>

            {/* Right Section - 3 columns - Benefits Grid */}
            <div className="lg:col-span-3 p-12 bg-white/[0.02]">
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-2">
                  Everything You Need
                </h3>
                <p className="text-sm text-gray-500">
                  Zero-risk platform with all the tools to succeed
                </p>
              </div>

              {/* Benefits Grid - 2 columns */}
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group relative p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:translate-y-[-4px]"
                  >
                    {/* Glow on hover */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300"
                      style={{ backgroundColor: benefit.color }}
                    />
                    
                    <div className="relative flex items-start gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${benefit.color}15` }}
                      >
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-400 group-hover:text-white transition-colors leading-relaxed pt-2">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom testimonial */}
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400 italic mb-3">
                  "Made $3,500 in my first month. The platform is incredibly easy to use and the support is amazing!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff3131]" />
                  <div>
                    <p className="text-sm font-bold text-white">Sarah Mitchell</p>
                    <p className="text-xs text-gray-600">Digital Artist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
