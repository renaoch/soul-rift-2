"use client";

import { Heart, Share2, Instagram, Twitter, Globe, Award, ShoppingBag, Eye } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductsNav from '@/components/layout/ProductsNav';
import { toast } from 'sonner';

interface ArtistData {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  banner: string;
  instagram: string;
  twitter: string;
  website: string;
  verified: boolean;
  joinDate: string;
  stats: {
    designs: number;
    sales: string;
    followers: string;
    revenue: string;
  };
  isFollowing: boolean;
}

interface Design {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  likes: number;
  views: number;
  price: number;
}

export default function ArtistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const artistId = params.id as string;

  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchArtist();
  }, [artistId]);

  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artist/${artistId}`);
      const result = await response.json();

      if (result.success) {
        setArtist(result.artist);
        setDesigns(result.designs);
        setIsFollowing(result.artist.isFollowing);
      } else {
        toast.error('Artist not found');
        router.push('/products');
      }
    } catch (error) {
      toast.error('Failed to load artist');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/artist/${artistId}/follow`, {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setIsFollowing(result.isFollowing);
        toast.success(result.isFollowing ? 'Following artist!' : 'Unfollowed');
        
        // Update follower count locally
        if (artist) {
          const count = parseInt(artist.stats.followers.replace(/,/g, ''));
          const newCount = result.isFollowing ? count + 1 : count - 1;
          setArtist({
            ...artist,
            stats: {
              ...artist.stats,
              followers: newCount.toLocaleString(),
            },
          });
        }
      } else {
        if (response.status === 401) {
          toast.error('Please login to follow artists');
          router.push('/login');
        } else {
          toast.error('Failed to follow artist');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading artist...</div>
        </div>
      </>
    );
  }

  if (!artist) {
    return null;
  }

  const artistColor = '#ff6b35'; // Default color - you can make this dynamic

  return (
    <>
      <ProductsNav />
      
      <main className="w-full bg-black min-h-screen">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30 blur-3xl"
            style={{ backgroundColor: artistColor }}
          />
          
          {artist.banner && (
            <div className="absolute inset-0 flex items-center justify-center p-20 opacity-20">
              <div className="relative w-full h-full max-w-2xl">
                <Image
                  src={artist.banner}
                  alt="Cover"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </section>

        {/* Artist Info Card */}
        <section className="relative -mt-32 z-10">
          <div className="max-w-7xl mx-auto px-8">
            <div className="rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Avatar */}
                <div 
                  className="w-32 h-32 rounded-2xl overflow-hidden border-4 shadow-2xl flex-shrink-0"
                  style={{ borderColor: artistColor }}
                >
                  <Image
                    src={artist.avatar || '/placeholder-avatar.png'}
                    alt={artist.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-black text-white">{artist.name}</h1>
                        {artist.verified && (
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${artistColor}30` }}
                          >
                            <Award className="w-5 h-5" style={{ color: artistColor }} />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-400 mb-1">@{artist.username}</p>
                      <p className="text-sm text-gray-500">Joined {artist.joinDate}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button 
                        onClick={handleFollow}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          isFollowing 
                            ? 'bg-white/10 text-white border border-white/20' 
                            : 'text-white shadow-2xl'
                        }`}
                        style={!isFollowing ? { 
                          backgroundColor: artistColor,
                          boxShadow: `0 10px 40px ${artistColor}40`
                        } : {}}
                      >
                        <Heart className={`w-4 h-4 inline mr-2 ${isFollowing ? 'fill-white' : ''}`} />
                        {isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  {artist.bio && (
                    <p className="text-gray-300 mb-6 max-w-3xl leading-relaxed">
                      {artist.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {artist.instagram && (
                      <a 
                        href={`https://instagram.com/${artist.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {artist.twitter && (
                      <a 
                        href={`https://twitter.com/${artist.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {artist.website && (
                      <a 
                        href={artist.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-3xl font-black text-white mb-1">{artist.stats.designs}</p>
                  <p className="text-sm text-gray-400 font-medium">Designs</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-3xl font-black text-white mb-1">{artist.stats.sales}</p>
                  <p className="text-sm text-gray-400 font-medium">Sales</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-3xl font-black text-white mb-1">{artist.stats.followers}</p>
                  <p className="text-sm text-gray-400 font-medium">Followers</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-3xl font-black text-white mb-1">{artist.stats.revenue}</p>
                  <p className="text-sm text-gray-400 font-medium">Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Designs Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-white mb-2">All Designs</h2>
                <p className="text-gray-400">Browse {artist.stats.designs} unique creations</p>
              </div>
            </div>

            {designs.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-xl">No designs yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {designs.map((design, index) => (
                  <div
                    key={design.id}
                    className="group relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:scale-[1.02] transition-all duration-500"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent overflow-hidden">
                      <div 
                        className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500"
                        style={{ 
                          backgroundColor: artistColor,
                          opacity: hoveredIndex === index ? 0.4 : 0.2
                        }}
                      />

                      <div className="relative w-full h-full p-8 flex items-center justify-center">
                        <Image
                          src={design.thumbnail || design.image}
                          alt={design.name}
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <button 
                          className="px-6 py-3 rounded-xl font-bold text-white shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
                          style={{ 
                            backgroundColor: artistColor,
                            boxShadow: `0 10px 40px ${artistColor}60`
                          }}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Buy Now
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                          <Heart className="w-3 h-3 text-white" />
                          <span className="text-xs font-bold text-white">{design.likes}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                          <Eye className="w-3 h-3 text-white" />
                          <span className="text-xs font-bold text-white">{design.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-black text-white mb-2">{design.name}</h3>
                      <p className="text-2xl font-black text-white">₹{design.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
