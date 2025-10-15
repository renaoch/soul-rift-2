"use client";

import { Instagram, ExternalLink, Heart, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const artists = [
  {
    name: 'Alex Rivera',
    role: 'Street Artist',
    designs: 43,
    sales: '2.3K',
    followers: '12.5K',
    avatar: '/avatar/artist1.jpg',
    coverDesign: '/design1.png',
    color: '#ff6b35',
    badge: 'Top Seller',
  },
  {
    name: 'Maya Chen',
    role: 'Digital Creator',
    designs: 67,
    sales: '3.8K',
    followers: '18.2K',
    avatar: '/avatar/artist2.jpg',
    coverDesign: '/design2.png',
    color: '#00d9ff',
    badge: 'Featured',
  },
  {
    name: 'Jordan Blake',
    role: 'Illustrator',
    designs: 29,
    sales: '1.5K',
    followers: '9.8K',
    avatar: '/avatar/artist3.jpg',
    coverDesign: '/BrockDesign.png',
    color: '#39ff14',
    badge: 'Rising Star',
  },
];

export default function FeaturedArtists() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-[#ff6b35]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-[#00d9ff]" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
            <Award className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Community</span>
          </div>
          <h2 className="text-6xl font-black text-white mb-6">
            Featured Artists
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Meet the creators behind your favorite designs. Support independent artists worldwide.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artists.map((artist, index) => (
            <div
              key={index}
              className="group relative rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:scale-[1.02] transition-all duration-500"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Animated Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-3xl transition-all duration-500"
                style={{ 
                  backgroundColor: artist.color,
                  transform: hoveredIndex === index ? 'scale(1.2)' : 'scale(1)'
                }}
              />

              {/* Cover Design Background */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                <div 
                  className="absolute inset-0 opacity-20 blur-2xl"
                  style={{ backgroundColor: artist.color }}
                />
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                  <div className="relative w-32 h-32 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                    <Image
                      src={artist.coverDesign}
                      alt={artist.name}
                      fill
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div 
                  className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-xl border text-xs font-black text-white"
                  style={{ 
                    backgroundColor: `${artist.color}50`,
                    borderColor: `${artist.color}80`
                  }}
                >
                  {artist.badge}
                </div>
              </div>

              {/* Artist Info Card */}
              <div className="relative p-8">
                {/* Avatar positioned to overlap - FIXED */}
                <div className="absolute -top-12 left-8">
                  <div 
                    className="w-24 h-24 rounded-2xl overflow-hidden border-4 shadow-2xl relative"
                    style={{ borderColor: artist.color }}
                  >
                    <Image
                      src={artist.avatar}
                      alt={artist.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Content with top margin for avatar */}
                <div className="mt-16">
                  {/* Name & Role */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" style={{
                      backgroundImage: hoveredIndex === index ? `linear-gradient(135deg, white, ${artist.color})` : 'none',
                      WebkitBackgroundClip: hoveredIndex === index ? 'text' : 'unset',
                      WebkitTextFillColor: hoveredIndex === index ? 'transparent' : 'white',
                    }}>
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">{artist.role}</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xl font-black text-white">{artist.designs}</p>
                      <p className="text-xs text-gray-500 font-medium">Designs</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xl font-black text-white">{artist.sales}</p>
                      <p className="text-xs text-gray-500 font-medium">Sales</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xl font-black text-white">{artist.followers}</p>
                      <p className="text-xs text-gray-500 font-medium">Fans</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 rounded-xl font-bold text-white backdrop-blur-xl border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn">
                      <Heart className="w-4 h-4 group-hover/btn:fill-white transition-all" />
                      Follow
                    </button>
                    <button 
                      className="flex-1 py-3 rounded-xl font-bold text-black transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2" 
                      style={{ 
                        backgroundColor: artist.color,
                        boxShadow: `0 10px 40px ${artist.color}40`
                      }}
                    >
                      View Work
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Artists CTA */}
        <div className="text-center mt-16">
          <button className="group px-10 py-5 rounded-2xl font-bold text-white bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3 mx-auto">
            Discover All Artists
            <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 mt-4">Join 1,200+ creators earning from their art</p>
        </div>
      </div>
    </section>
  );
}
