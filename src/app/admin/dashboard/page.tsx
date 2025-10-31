"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  FileImage,
  Truck,
  Activity,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  revenue: { total: number; platform: number; artistCommissions: number };
  orders: { total: number; pending: number; processing: number; completed: number };
  users: { total: number; artists: number; activeArtists: number };
  designs: { total: number; pending: number; approved: number };
  products: { total: number; active: number };
}

interface RecentOrder {
  id: string;
  order_number: string;
  total_order_value: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  users: { username: string; email: string };
}

interface PendingDesign {
  id: string;
  title: string;
  design_url: string;
  created_at: string;
  artist_profiles: { display_name: string };
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
      const res = await fetch('/api/admin/dashboard');
      const result = await res.json();

      if (result.success) {
        setStats(result.stats);
        setRecentOrders(result.recentOrders);
        setPendingDesigns(result.pendingDesigns);
        setMonthlyRevenue(result.monthlyRevenue);
        setTopArtists(result.topArtists);
      } else {
        if (result.error?.message?.includes('Unauthorized')) {
          toast.error('Access denied - Admin only');
          router.push('/');
        } else {
          toast.error('Failed to load dashboard');
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full bg-black min-h-screen p-8">
      {/* Subtle background grid + glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-24 left-24 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#ff6b35]" />
        <div className="absolute bottom-24 right-24 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#00d9ff]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-2xl border shadow-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #ff6b3515, #ff313110)', borderColor: '#ff6b3530' }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse bg-[#ff6b35]" />
            <span className="text-xs font-bold tracking-wider text-white uppercase">Admin Control Center</span>
            <Sparkles className="w-3 h-3 text-white opacity-60" />
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Dashboard</h1>
              <p className="text-sm md:text-base text-gray-400 mt-2">
                Monitor performance, manage workflows, and take action
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { href: '/admin/designs', label: 'Designs', icon: FileImage },
                { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
                { href: '/admin/products', label: 'Products', icon: Package },
                { href: '/admin/users', label: 'Users', icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} className="group">
                    <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4 text-white/80 group-hover:text-white" />
                      <span className="text-xs font-bold text-white/80 group-hover:text-white">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <CardKPI
            title="Total Revenue"
            value={`₹${stats?.revenue.total || 0}`}
            sub={`Platform: ₹${stats?.revenue.platform || 0}`}
            icon={DollarSign}
            color="#00d9ff"
            badgeIcon={TrendingUp}
          />
          <CardKPI
            title="Total Orders"
            value={String(stats?.orders.total || 0)}
            sub={`${stats?.orders.pending || 0} pending · ${stats?.orders.processing || 0} processing`}
            icon={ShoppingCart}
            color="#ff6b35"
            badgeIcon={Package}
          />
          <CardKPI
            title="Total Users"
            value={String(stats?.users.total || 0)}
            sub={`${stats?.users.artists || 0} artists`}
            icon={Users}
            color="#39ff14"
            badgeIcon={Activity}
          />
        </div>

        {/* Secondary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <CardMini title="Designs" value={stats?.designs.total || 0} sub={`${stats?.designs.pending || 0} pending`} icon={FileImage} color="#ff3131" />
          <CardMini title="Products" value={stats?.products.total || 0} sub={`${stats?.products.active || 0} active`} icon={Package} color="#00d9ff" />
          <CardMini title="Completed" value={stats?.orders.completed || 0} sub="Delivered" icon={CheckCircle2} color="#39ff14" />
          <CardMini title="In Transit" value={stats?.orders.processing || 0} sub="Processing/Shipping" icon={Truck} color="#ff6b35" />
        </div>

        {/* Revenue + Lists */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Revenue chart */}
          <div
            className="lg:col-span-2 rounded-2xl border p-6 backdrop-blur-2xl"
            style={{ background: 'linear-gradient(135deg, #ff6b3508, transparent)', borderColor: '#ff6b3520' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#ff6b35]" />
                Revenue (Last 6 Months)
              </h2>
              <div className="text-xs text-gray-500">Platform + Artist split</div>
            </div>

            <div className="flex items-end gap-3 md:gap-4 h-56">
              {monthlyRevenue.map((d, idx) => {
                const max = Math.max(...monthlyRevenue.map((x: any) => x.revenue), 1);
                const height = (d.revenue / max) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-full">
                      <div className="text-center mb-2">
                        <span className="text-[11px] text-white font-bold block">₹{d.revenue}</span>
                        <span className="text-[10px] text-gray-500">{d.orders} orders</span>
                      </div>
                      <div
                        className="w-full rounded-t-lg relative group"
                        style={{
                          height: `${height}%`,
                          background: 'linear-gradient(180deg, #ff6b35, #ff3131)',
                          minHeight: d.revenue > 0 ? '18px' : '0',
                        }}
                      >
                        <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-500 font-bold mt-2">{d.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Designs */}
          <div
            className="rounded-2xl border p-6 backdrop-blur-2xl"
            style={{ background: 'linear-gradient(135deg, #00d9ff08, transparent)', borderColor: '#00d9ff20' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00d9ff]" />
                Pending Designs
              </h2>
              <Link href="/admin/designs" className="text-[#00d9ff] font-bold text-xs hover:underline flex items-center gap-1">
                Review
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {pendingDesigns.length > 0 ? (
                pendingDesigns.map((d) => (
                  <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                      <Image src={d.design_url} alt={d.title} fill className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate">{d.title}</p>
                      <p className="text-[11px] text-gray-500 truncate">{d.artist_profiles?.display_name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders + Top Artists */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div
            className="lg:col-span-2 rounded-2xl border p-6 backdrop-blur-2xl"
            style={{ background: 'linear-gradient(135deg, #ff6b3508, transparent)', borderColor: '#ff6b3520' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#ff6b35]" />
                Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-[#ff6b35] font-bold text-xs hover:underline flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentOrders.length ? (
                recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-bold text-sm">{o.order_number}</p>
                      <p className="text-[11px] text-gray-500">{o.users?.username || 'Guest'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹{o.total_order_value}</p>
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full ${
                          o.payment_status === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {o.order_status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Artists */}
          <div
            className="rounded-2xl border p-6 backdrop-blur-2xl"
            style={{ background: 'linear-gradient(135deg, #39ff1408, transparent)', borderColor: '#39ff1420' }}
          >
            <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#39ff14]" />
              Top Artists
            </h2>

            <div className="space-y-3">
              {topArtists.length ? (
                topArtists.map((a, idx) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#39ff14] to-[#00d9ff] flex items-center justify-center font-black text-black text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{a.display_name}</p>
                      <p className="text-[11px] text-gray-500">{a.total_sales} sales</p>
                    </div>
                    <p className="text-white font-bold text-sm">₹{a.total_earnings}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No artist stats yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* UI subcomponents */

function CardKPI({
  title,
  value,
  sub,
  icon: Icon,
  color,
  badgeIcon: Badge,
}: {
  title: string;
  value: string;
  sub: string;
  icon: any;
  color: string;
  badgeIcon: any;
}) {
  return (
    <div
      className="rounded-2xl backdrop-blur-2xl border p-5 shadow-xl hover:scale-[1.01] transition-all"
      style={{ background: `linear-gradient(135deg, ${color}10, transparent)`, borderColor: `${color}30` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}30` }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <Badge className="w-4 h-4" style={{ color }} />
      </div>
      <p className="text-[11px] text-gray-400 mb-1 uppercase tracking-wider font-bold">{title}</p>
      <p className="text-3xl md:text-4xl font-black text-white">{value}</p>
      <p className="text-[11px] text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

function CardMini({
  title,
  value,
  sub,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  sub: string;
  icon: any;
  color: string;
}) {
  return (
    <div
      className="rounded-xl backdrop-blur-2xl border p-4 shadow-lg"
      style={{ background: `linear-gradient(135deg, ${color}10, transparent)`, borderColor: `${color}30` }}
    >
      <Icon className="w-6 h-6 mb-2" style={{ color }} />
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-[11px] text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-[11px] text-gray-500 mt-1">{sub}</p>
    </div>
  );
}
