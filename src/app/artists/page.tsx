"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Users, TrendingUp, Heart, ExternalLink, Palette } from 'lucide-react';
import ProductsNav from '@/components/layout/ProductsNav';
import { toast } from 'sonner';

interface Artist {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverDesign: string;
  verified: boolean;
  stats: {
    designs: number;
    sales: string;
    followers: string;
  };
  color: string;
  badge: string | null;
}

export default function ArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchArtists();
  }, [sortBy]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/artist?sort=${sortBy}`);
      const result = await response.json();

      if (result.success) {
        setArtists(result.artists);
      } else {
        toast.error('Failed to load artists');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading artists...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductsNav />
      
      <main className="w-full bg-black min-h-screen">
        {/* Hero Header */}
        <section className="relative py-32 overflow-hidden">
          {/* Background Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-[#ff6b35]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-[150px] opacity-10 bg-[#00d9ff]" />

          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6">
                <Palette className="w-4 h-4 text-[#ff6b35]" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">Community</span>
              </div>
              <h1 className="text-7xl font-black text-white mb-6">
                Featured Artists
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
                Discover talented creators from around the world. Support independent artists and wear their art.
              </p>

              {/* Search & Filter */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-3xl mx-auto">
                <input
                  type="text"
                  placeholder="Search artists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30"
                />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:border-white/30"
                >
                  <option value="popular">Most Popular</option>
                  <option value="followers">Most Followers</option>
                  <option value="designs">Most Designs</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-[#ff6b35]" />
                <p className="text-3xl font-black text-white mb-1">{artists.length}+</p>
                <p className="text-sm text-gray-400">Active Artists</p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 text-[#00d9ff]" />
                <p className="text-3xl font-black text-white mb-1">500K+</p>
                <p className="text-sm text-gray-400">Designs Created</p>
              </div>
              <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-[#ff3131]" />
                <p className="text-3xl font-black text-white mb-1">2M+</p>
                <p className="text-sm text-gray-400">Community Members</p>
              </div>
            </div>
          </div>
        </section>

        {/* Artists Grid */}
        <section className="pb-32">
          <div className="max-w-7xl mx-auto px-8">
            {filteredArtists.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No artists found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArtists.map((artist, index) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
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
                      {artist.badge && (
                        <div 
                          className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-xl border text-xs font-black text-white"
                          style={{ 
                            backgroundColor: `${artist.color}50`,
                            borderColor: `${artist.color}80`
                          }}
                        >
                          {artist.badge}
                        </div>
                      )}
                    </div>

                    {/* Artist Info Card */}
                    <div className="relative p-8">
                      {/* Avatar positioned to overlap */}
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
                        {/* Name & Username */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" 
                              style={{
                                backgroundImage: hoveredIndex === index ? `linear-gradient(135deg, white, ${artist.color})` : 'none',
                                WebkitBackgroundClip: hoveredIndex === index ? 'text' : 'unset',
                                WebkitTextFillColor: hoveredIndex === index ? 'transparent' : 'white',
                              }}
                            >
                              {artist.name}
                            </h3>
                            {artist.verified && (
                              <Award className="w-5 h-5" style={{ color: artist.color }} />
                            )}
                          </div>
                          <p className="text-sm text-gray-400 font-medium">@{artist.username}</p>
                        </div>

                        {/* Bio - Truncated */}
                        {artist.bio && (
                          <p className="text-sm text-gray-400 mb-6 line-clamp-2">
                            {artist.bio}
                          </p>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xl font-black text-white">{artist.stats.designs}</p>
                            <p className="text-xs text-gray-500 font-medium">Designs</p>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xl font-black text-white">{artist.stats.sales}</p>
                            <p className="text-xs text-gray-500 font-medium">Sales</p>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-xl font-black text-white">{artist.stats.followers}</p>
                            <p className="text-xs text-gray-500 font-medium">Fans</p>
                          </div>
                        </div>

                        {/* View Profile Button */}
                        <button 
                          className="w-full py-3 rounded-xl font-bold text-black transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2" 
                          style={{ 
                            backgroundColor: artist.color,
                            boxShadow: `0 10px 40px ${artist.color}40`
                          }}
                        >
                          View Profile
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
