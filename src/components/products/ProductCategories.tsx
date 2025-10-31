"use client";

import { Shirt, Wind, Zap, Flame, Heart, Star } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const categories = [
  { key: 'all', icon: Zap, name: 'All Designs', count: '5K+', color: '#ff6b35' },
  { key: 'trending', icon: Flame, name: 'Trending', count: '234', color: '#ff3131' },
  { key: 'new', icon: Star, name: 'New Arrivals', count: '156', color: '#00d9ff' },
  { key: 'best', icon: Heart, name: 'Best Sellers', count: '89', color: '#39ff14' },
  { key: 'street', icon: Shirt, name: 'Street Art', count: '1.2K', color: '#ff6b35' },
  { key: 'minimal', icon: Wind, name: 'Minimal', count: '890', color: '#00d9ff' },
];

export default function ProductCategories() {
  const params = useSearchParams();
  const router = useRouter();
  const active = params.get('cat') || 'all';

  const go = (key: string) => {
    const current = new URLSearchParams(params.toString());
    if (key === 'all') current.delete('cat');
    else current.set('cat', key);
    current.delete('page');
    router.replace(`/products?${current.toString()}`);
  };

  return (
    <section className="relative py-6 bg-black border-y border-white/10">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = active === c.key;
            return (
              <button
                key={c.key}
                onClick={() => go(c.key)}
                className={`group flex-shrink-0 flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-xl border transition-all ${
                  isActive
                    ? 'bg-white/15 border-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${c.color}20` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <p className="text-[11px] text-gray-500">{c.count} items</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
