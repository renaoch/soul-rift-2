"use client";

import { ArrowRight, Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const designs = [
  { 
    id: 1, 
    name: 'Urban Chaos', 
    artist: 'Alex Rivera', 
    price: 89, 
    image: '/design1.png',
    likes: 234,
    views: 1240,
    color: '#ff6b35'
  },
  { 
    id: 2, 
    name: 'Digital Dreams', 
    artist: 'Maya Chen', 
    price: 92, 
    image: '/design2.png',
    likes: 456,
    views: 2100,
    color: '#00d9ff'
  },
  { 
    id: 3, 
    name: 'Fire Soul', 
    artist: 'Jordan Blake', 
    price: 95, 
    image: '/BrockDesign.png',
    likes: 189,
    views: 980,
    color: '#ff3131'
  },
];

export default function TrendingDesigns() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 bg-black">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-[0.3em] font-bold mb-4">
              Hot Right Now
            </p>
            <h2 className="text-6xl font-black text-white">
              Trending Designs
            </h2>
          </div>
          <button className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold hover:bg-white/20 transition">
            View All
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {designs.map((design, index) => (
            <div
              key={design.id}
              className="group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:scale-[1.02] transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Design Image */}
              <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500"
                  style={{ 
                    backgroundColor: design.color,
                    opacity: hoveredIndex === index ? 0.4 : 0.2
                  }}
                />
                <div className="relative w-full h-full flex items-center justify-center p-12">
                  <Image
                    src={design.image}
                    alt={design.name}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Overlay Actions */}
                <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-4 transition-opacity duration-300 ${
                  hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition">
                    <Heart className="w-6 h-6" />
                  </button>
                  <button className="px-8 py-4 rounded-2xl font-bold text-white transition-all" style={{ backgroundColor: design.color }}>
                    Quick View
                  </button>
                </div>

                {/* Stats Badge */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">{design.likes}</span>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">{design.views}</span>
                  </div>
                </div>
              </div>

              {/* Design Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{design.name}</h3>
                    <p className="text-sm text-gray-400">by {design.artist}</p>
                  </div>
                  <p className="text-2xl font-black text-white">${design.price}</p>
                </div>
                
                <button 
                  className="w-full py-3 rounded-xl font-bold text-white backdrop-blur-xl border border-white/20 hover:bg-white/10 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

