"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  Sparkles,
  Upload,
  Eye,
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface Design {
  id: string;
  title: string;
  description: string;
  design_code: string;
  design_url: string;
  thumbnail_url: string;
  is_approved: boolean;
  view_count: number;
  like_count: number;
  use_count: number;
  created_at: string;
  tags: string[];
}

interface DesignStats {
  total: number;
  approved: number;
  pending: number;
  totalViews: number;
  totalLikes: number;
  totalUses: number;
}

export default function ManageDesignsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [stats, setStats] = useState<DesignStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, [statusFilter]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/artist/designs'
        : `/api/artist/designs?status=${statusFilter}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setDesigns(result.designs);
        setStats(result.stats);
      } else {
        toast.error('Failed to load designs');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (designId: string) => {
    if (!confirm('Are you sure you want to delete this design?')) return;

    try {
      const response = await fetch(`/api/artist/designs?id=${designId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Design deleted successfully');
        fetchDesigns();
      } else {
        toast.error('Failed to delete design');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const filteredDesigns = designs.filter(design =>
    design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    design.design_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Loading designs...</p>
          </div>
        </div>
      </>
    );
  }

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

        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          {/* Header */}
          <div className="mb-12">
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
                My Designs
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter relative mb-6">
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
                      Manage Designs
                    </span>
                  ))}
                  
                  <span 
                    className="relative text-white"
                    style={{
                      filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                    }}
                  >
                    Manage Designs
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
                  View, edit, and track performance of your uploaded designs
                </p>
              </div>

              <Link href="/artist/designs/upload">
                <button 
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-white transition-all duration-500 hover:scale-[1.02] shadow-2xl flex items-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                    boxShadow: '0 20px 60px #ff6b3550'
                  }}
                >
                  <Upload className="w-5 h-5" />
                  Upload New
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <Package className="w-8 h-8 text-[#ff6b35] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.total || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Total Designs</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <CheckCircle2 className="w-8 h-8 text-[#39ff14] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.approved || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Approved</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <Eye className="w-8 h-8 text-[#00d9ff] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.totalViews || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Total Views</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff313108, transparent)',
                borderColor: '#ff313120',
              }}
            >
              <Heart className="w-8 h-8 text-[#ff3131] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.totalLikes || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Total Likes</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs..."
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
              />
            </div>

            <div className="flex gap-2">
              {['all', 'approved', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                    statusFilter === status
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-black/40 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Designs Grid */}
          {filteredDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  className="rounded-2xl backdrop-blur-3xl border overflow-hidden shadow-xl hover:scale-[1.02] transition-all group"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                    borderColor: '#ff6b3520',
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-black/40">
                    <Image
                      src={design.design_url}
                      alt={design.title}
                      fill
                      className="object-contain p-4"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {design.is_approved ? (
                        <div className="px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-xl border border-green-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-bold text-green-400">Approved</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-full bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/40 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs font-bold text-yellow-400">Pending</span>
                        </div>
                      )}
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDelete(design.id)}
                        className="w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/40 flex items-center justify-center hover:bg-red-500/30 transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-white font-bold mb-2 line-clamp-1">{design.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 font-mono">{design.design_code}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {design.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {design.like_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        {design.use_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">No designs found</h3>
              <p className="text-gray-400 mb-8">
                {searchQuery ? 'Try a different search term' : 'Start by uploading your first design'}
              </p>
              <Link href="/artist/designs/upload">
                <button className="px-8 py-4 rounded-2xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525] transition">
                  Upload Design
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
