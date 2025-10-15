"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Upload,
  Eye,
  Heart,
  ShoppingCart,
  Calendar,
  ArrowUpRight,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalEarnings: number;
  pendingEarnings: number;
  totalSales: number;
  totalDesigns: number;
  approvedDesigns: number;
  pendingDesigns: number;
  rejectedDesigns: number;
  totalViews: number;
  totalLikes: number;
  followerCount: number;
}

interface RecentDesign {
  id: string;
  title: string;
  design_url: string;
  is_approved: boolean;
  view_count: number;
  like_count: number;
  use_count: number;
  created_at: string;
}

interface RecentEarning {
  id: string;
  amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  orders: {
    order_number: string;
  };
}

export default function ArtistDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentDesigns, setRecentDesigns] = useState<RecentDesign[]>([]);
  const [recentEarnings, setRecentEarnings] = useState<RecentEarning[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/artist/dashboard');
      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
        setRecentDesigns(result.recentDesigns || []);
        setRecentEarnings(result.recentEarnings || []);
        setError(null);
      } else {
        const errorMessage = result.error?.message || 'Failed to load dashboard';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state - Artist profile not found
  if (error) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #ff6b3530, #ff313120)',
              }}
            >
              <AlertCircle className="w-10 h-10 text-[#ff6b35]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Artist Profile Required</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link href="/become-artist">
              <button 
                className="px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                  boxShadow: '0 20px 60px #ff6b3550'
                }}
              >
                Become an Artist
              </button>
            </Link>
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
                Artist Studio
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

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
                  Dashboard
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Dashboard
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Track your designs, earnings, and performance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Earnings */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all group"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #00d9ff30, #39ff1420)',
                    boxShadow: '0 10px 40px #00d9ff30'
                  }}
                >
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Total Earnings</p>
              <p className="text-4xl font-black text-white mb-1">₹{stats?.totalEarnings || 0}</p>
              <p className="text-xs text-gray-500">₹{stats?.pendingEarnings || 0} pending</p>
            </div>

            {/* Total Sales */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b3530, #ff313120)',
                    boxShadow: '0 10px 40px #ff6b3530'
                  }}
                >
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <Package className="w-5 h-5 text-[#ff6b35]" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Total Sales</p>
              <p className="text-4xl font-black text-white">{stats?.totalSales || 0}</p>
              <p className="text-xs text-gray-500">Designs sold</p>
            </div>

            {/* Total Designs */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #39ff1430, #00d9ff20)',
                    boxShadow: '0 10px 40px #39ff1430'
                  }}
                >
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <Award className="w-5 h-5 text-[#39ff14]" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Total Designs</p>
              <p className="text-4xl font-black text-white">{stats?.totalDesigns || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.approvedDesigns || 0} approved · {stats?.pendingDesigns || 0} pending
              </p>
            </div>

            {/* Followers */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff313108, transparent)',
                borderColor: '#ff313120',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff313130, #ff6b3520)',
                    boxShadow: '0 10px 40px #ff313130'
                  }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Followers</p>
              <p className="text-4xl font-black text-white">{stats?.followerCount || 0}</p>
              <p className="text-xs text-gray-500">{stats?.totalLikes || 0} total likes</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Link href="/artist/designs/upload">
              <button 
                className="group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-white transition-all duration-500 hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                  boxShadow: '0 20px 60px #ff6b3550'
                }}
              >
                <Upload className="w-5 h-5" />
                Upload New Design
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </Link>

            <Link href="/artist/earnings">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <DollarSign className="w-5 h-5" />
                View Earnings
              </button>
            </Link>

            <Link href="/artist/designs">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Manage Designs
              </button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Designs */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                  borderColor: '#ff6b3520',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ff6b35]" />
                    Recent Designs
                  </h2>
                  <Link href="/artist/designs" className="text-[#ff6b35] font-bold text-sm hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentDesigns.length > 0 ? (
                    recentDesigns.map((design) => (
                      <div
                        key={design.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 hover:bg-white/5 transition-all"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                          <Image
                            src={design.design_url}
                            alt={design.title}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-1">{design.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
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
                        <div>
                          {design.is_approved ? (
                            <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              <span className="text-xs font-bold text-green-400">Approved</span>
                            </div>
                          ) : (
                            <div className="px-3 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-yellow-400" />
                              <span className="text-xs font-bold text-yellow-400">Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No designs yet</p>
                      <Link href="/artist/designs/upload">
                        <button className="px-6 py-3 rounded-xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525] transition">
                          Upload Your First Design
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Earnings */}
            <div>
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#00d9ff]" />
                    Recent Earnings
                  </h2>
                </div>

                <div className="space-y-3">
                  {recentEarnings.length > 0 ? (
                    recentEarnings.map((earning) => (
                      <div
                        key={earning.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-white font-bold">₹{earning.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            earning.status === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {earning.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          Order: {earning.orders.order_number}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(earning.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No earnings yet</p>
                    </div>
                  )}
                </div>

                <Link href="/artist/earnings">
                  <button className="w-full mt-4 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/10 transition">
                    View All Earnings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
