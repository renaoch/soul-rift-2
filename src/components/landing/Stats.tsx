"use client";

import { Users, Palette, ShoppingBag, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Palette, value: '5,000+', label: 'Unique Designs', color: '#ff6b35' },
  { icon: Users, value: '1,200+', label: 'Artists', color: '#00d9ff' },
  { icon: ShoppingBag, value: '50K+', label: 'Happy Customers', color: '#39ff14' },
  { icon: TrendingUp, value: '$2M+', label: 'Artist Earnings', color: '#ff3131' },
];

export default function Stats() {
  return (
    <section className="relative py-24 bg-black border-y border-white/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105"
            >
              <div 
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${stat.color}30, ${stat.color}10)`,
                  boxShadow: `0 10px 40px ${stat.color}30`
                }}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <p className="text-5xl font-black text-white mb-2">{stat.value}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
