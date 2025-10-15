"use client";

import { Upload, Palette, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Design',
    description: 'Submit your artwork in high quality. Our team reviews within 24 hours.',
    color: '#ff6b35',
  },
  {
    icon: Palette,
    title: 'We Handle Production',
    description: 'Premium printing on quality apparel. No inventory or upfront costs.',
    color: '#00d9ff',
  },
  {
    icon: DollarSign,
    title: 'Earn on Every Sale',
    description: 'Get 25-40% commission. Weekly payouts directly to your account.',
    color: '#39ff14',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-32 bg-black">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        {/* Section Header - Ultra Minimal */}
        <div className="text-center mb-24">
          <p className="text-xs text-gray-600 uppercase tracking-[0.3em] font-bold mb-6">
            For Artists
          </p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Three simple steps to start earning from your art
          </p>
        </div>

        {/* Steps - Horizontal Flow */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-16 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative text-center"
              >
                {/* Step Number - Minimal */}
                <div className="relative inline-flex items-center justify-center mb-8">
                  {/* Icon Container */}
                  <div 
                    className="relative w-32 h-32 rounded-full flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110"
                    style={{ 
                      borderColor: step.color,
                      backgroundColor: `${step.color}10`
                    }}
                  >
                    <step.icon className="w-12 h-12 text-white" />
                    
                    {/* Glow effect on hover */}
                    <div 
                      className="absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ backgroundColor: step.color }}
                    />
                  </div>

                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-black"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section - Clean */}
        <div className="mt-24 text-center space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              className="group px-10 py-4 rounded-full font-bold  bg-white hover:bg-white/90 text-black transition-all duration-300 hover:scale-105 shadow-2xl shadow-white/20 flex items-center gap-3"
            >
              Start Selling Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/5 transition-all duration-300">
              Learn More
            </button>
          </div>
          <p className="text-xs text-gray-600">
            No credit card required • Join 1,200+ artists
          </p>
        </div>
      </div>
    </section>
  );
}
