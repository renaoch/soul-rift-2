"use client";

import { Shirt, Wind, Zap, Flame, Heart, Star } from 'lucide-react';

const categories = [
  { icon: Zap, name: 'All Designs', count: '5K+', color: '#ff6b35' },
  { icon: Flame, name: 'Trending', count: '234', color: '#ff3131' },
  { icon: Star, name: 'New Arrivals', count: '156', color: '#00d9ff' },
  { icon: Heart, name: 'Best Sellers', count: '89', color: '#39ff14' },
  { icon: Shirt, name: 'Street Art', count: '1.2K', color: '#ff6b35' },
  { icon: Wind, name: 'Minimal', count: '890', color: '#00d9ff' },
];

export default function ProductCategories() {
  return (
    <section className="relative py-8 bg-black border-y border-white/10">
      <div className="max-w-[1800px] mx-auto px-8">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={index}
              className="group flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">{category.name}</p>
                <p className="text-xs text-gray-500">{category.count} items</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
