"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Eye,
  FileImage,
  Truck,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  revenue: {
    total: number;
    platform: number;
    artistCommissions: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
  };
  users: {
    total: number;
    artists: number;
    activeArtists: number;
  };
  designs: {
    total: number;
    pending: number;
    approved: number;
  };
  products: {
    total: number;
    active: number;
  };
}

interface RecentOrder {
  id: string;
  order_number: string;
  total_order_value: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  users: {
    username: string;
    email: string;
  };
}

interface PendingDesign {
  id: string;
  title: string;
  design_url: string;
  created_at: string;
  artist_profiles: {
    display_name: string;
  };
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
  platformRevenue: number;
  orders: number;
}

interface TopArtist {
  id: string;
  display_name: string;
  total_earnings: number;
  total_sales: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [pendingDesigns, setPendingDesigns] = useState<PendingDesign[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [topArtists, setTopArtists] = useState<TopArtist[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
        setRecentOrders(result.recentOrders);
        setPendingDesigns(result.pendingDesigns);
        setMonthlyRevenue(result.monthlyRevenue);
        setTopArtists(result.topArtists);
      } else {
        if (result.error?.message.includes('Unauthorized')) {
          toast.error('Access denied - Admin only');
          router.push('/');
        } else {
          toast.error('Failed to load dashboard');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
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
            <p className="text-white text-xl">Loading admin dashboard...</p>
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
                Admin Control Center
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
              Monitor platform performance, manage content, and oversee operations
            </p>
          </div>

          {/* Quick Stats - Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #00d9ff30, #39ff1420)',
                    boxShadow: '0 10px 40px #00d9ff30'
                  }}
                >
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Total Revenue</p>
              <p className="text-5xl font-black text-white mb-1">₹{stats?.revenue.total || 0}</p>
              <p className="text-xs text-gray-500">Platform: ₹{stats?.revenue.platform || 0}</p>
            </div>

            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b3530, #ff313120)',
                    boxShadow: '0 10px 40px #ff6b3530'
                  }}
                >
                  <ShoppingCart className="w-7 h-7 text-white" />
                </div>
                <Package className="w-6 h-6 text-[#ff6b35]" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Total Orders</p>
              <p className="text-5xl font-black text-white mb-1">{stats?.orders.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.orders.pending || 0} pending · {stats?.orders.processing || 0} processing
              </p>
            </div>

            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.02] transition-all"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-14 h-14 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #39ff1430, #00d9ff20)',
                    boxShadow: '0 10px 40px #39ff1430'
                  }}
                >
                  <Users className="w-7 h-7 text-white" />
                </div>
                <Activity className="w-6 h-6 text-[#39ff14]" />
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Total Users</p>
              <p className="text-5xl font-black text-white mb-1">{stats?.users.total || 0}</p>
              <p className="text-xs text-gray-500">{stats?.users.artists || 0} artists</p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div 
              className="rounded-2xl backdrop-blur-3xl border p-5 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff313108, transparent)',
                borderColor: '#ff313120',
              }}
            >
              <FileImage className="w-8 h-8 text-[#ff3131] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.designs.total || 0}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Designs</p>
              <p className="text-xs text-yellow-400 mt-1">{stats?.designs.pending || 0} pending</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-5 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <Package className="w-8 h-8 text-[#00d9ff] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.products.total || 0}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Products</p>
              <p className="text-xs text-green-400 mt-1">{stats?.products.active || 0} active</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-5 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <CheckCircle2 className="w-8 h-8 text-[#39ff14] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.orders.completed || 0}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Completed</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-5 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <Truck className="w-8 h-8 text-[#ff6b35] mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stats?.orders.processing || 0}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider">In Transit</p>
            </div>
          </div>

          {/* Revenue Chart */}
          <div 
            className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl mb-12"
            style={{
              background: 'linear-gradient(135deg, #ff6b3508, transparent)',
              borderColor: '#ff6b3520',
            }}
          >
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#ff6b35]" />
              Revenue Overview (Last 6 Months)
            </h2>

            <div className="flex items-end gap-4 h-64">
              {monthlyRevenue.map((data, idx) => {
                const maxRevenue = Math.max(...monthlyRevenue.map(d => d.revenue), 1);
                const height = (data.revenue / maxRevenue) * 100;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-full">
                      <div className="text-center mb-2">
                        <span className="text-xs text-white font-bold block">₹{data.revenue}</span>
                        <span className="text-xs text-gray-500">{data.orders} orders</span>
                      </div>
                      <div 
                        className="w-full rounded-t-xl transition-all duration-500 relative group"
                        style={{ 
                          height: `${height}%`,
                          background: 'linear-gradient(180deg, #ff6b35, #ff3131)',
                          minHeight: data.revenue > 0 ? '20px' : '0'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-5 gap-4 mb-12">
            <Link href="/admin/designs">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <FileImage className="w-5 h-5" />
                Designs
                {stats?.designs.pending ? (
                  <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">{stats.designs.pending}</span>
                ) : null}
              </button>
            </Link>

            <Link href="/admin/orders">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Orders
              </button>
            </Link>

            <Link href="/admin/products">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Products
              </button>
            </Link>

            <Link href="/admin/users">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Users className="w-5 h-5" />
                Users
              </button>
            </Link>

            <Link href="/admin/analytics">
              <button className="w-full py-4 rounded-2xl font-bold text-white backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Activity className="w-5 h-5" />
                Analytics
              </button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
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
                    <ShoppingCart className="w-6 h-6 text-[#ff6b35]" />
                    Recent Orders
                  </h2>
                  <Link href="/admin/orders" className="text-[#ff6b35] font-bold text-sm hover:underline flex items-center gap-1">
                    View All
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 hover:bg-white/5 transition-all"
                      >
                        <div>
                          <p className="text-white font-bold mb-1">{order.order_number}</p>
                          <p className="text-xs text-gray-500">{order.users?.username || 'Guest'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white mb-1">₹{order.total_order_value}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.payment_status === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No orders yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pending Designs & Top Artists */}
            <div className="space-y-8">
              {/* Pending Designs */}
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#00d9ff]" />
                    Pending Designs
                  </h2>
                  <Link href="/admin/designs" className="text-[#00d9ff] font-bold text-sm hover:underline">
                    Review
                  </Link>
                </div>

                <div className="space-y-3">
                  {pendingDesigns.length > 0 ? (
                    pendingDesigns.map((design) => (
                      <div
                        key={design.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10"
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                          <Image
                            src={design.design_url}
                            alt={design.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm line-clamp-1">{design.title}</p>
                          <p className="text-xs text-gray-500">{design.artist_profiles?.display_name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">All caught up!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Artists */}
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #39ff1408, transparent)',
                  borderColor: '#39ff1420',
                }}
              >
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#39ff14]" />
                  Top Artists
                </h2>

                <div className="space-y-3">
                  {topArtists.map((artist, idx) => (
                    <div
                      key={artist.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-white/10"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39ff14] to-[#00d9ff] flex items-center justify-center font-black text-black text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{artist.display_name}</p>
                        <p className="text-xs text-gray-500">{artist.total_sales} sales</p>
                      </div>
                      <p className="text-white font-bold">₹{artist.total_earnings}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
