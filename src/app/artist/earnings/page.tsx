"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  CreditCard,
  Package,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface EarningStats {
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
  totalTransactions: number;
  commissionRate: number;
}

interface Earning {
  id: string;
  amount: number;
  commission_rate: number;
  status: string;
  created_at: string;
  payout_date: string | null;
  orders: {
    order_number: string;
    total_order_value: number;
    payment_status: string;
    order_status: string;
  };
  order_items: {
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url: string;
    };
    designs: {
      title: string;
      design_url: string;
    };
  };
}

interface MonthlyData {
  month: string;
  earnings: number;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  completed_at: string | null;
}

export default function EarningsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<EarningStats | null>(null);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await fetch('/api/artist/earnings');
      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
        setEarnings(result.earnings);
        setMonthlyData(result.monthlyData);
        setPayouts(result.payouts);
      } else {
        toast.error('Failed to load earnings');
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
            <p className="text-white text-xl">Loading earnings...</p>
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
                Earnings
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
                  Your Earnings
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Your Earnings
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Track your income, view transaction history, and request payouts
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Total Earnings */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
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
              <p className="text-xs text-gray-500">{stats?.commissionRate || 30}% commission rate</p>
            </div>

            {/* Pending */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
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
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Pending</p>
              <p className="text-4xl font-black text-white">₹{stats?.pendingEarnings || 0}</p>
              <p className="text-xs text-gray-500">Awaiting payout</p>
            </div>

            {/* Paid Out */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
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
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Paid Out</p>
              <p className="text-4xl font-black text-white">₹{stats?.paidEarnings || 0}</p>
              <p className="text-xs text-gray-500">Successfully paid</p>
            </div>

            {/* Total Transactions */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
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
                  <Package className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-wider font-bold">Transactions</p>
              <p className="text-4xl font-black text-white">{stats?.totalTransactions || 0}</p>
              <p className="text-xs text-gray-500">Total sales</p>
            </div>
          </div>

          {/* Monthly Chart */}
          <div 
            className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl mb-12"
            style={{
              background: 'linear-gradient(135deg, #ff6b3508, transparent)',
              borderColor: '#ff6b3520',
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#ff6b35]" />
                Monthly Earnings
              </h2>
              <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="flex items-end gap-4 h-64">
              {monthlyData.map((data, idx) => {
                const maxEarnings = Math.max(...monthlyData.map(d => d.earnings), 1);
                const height = (data.earnings / maxEarnings) * 100;
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-full">
                      <span className="text-xs text-white font-bold mb-2">₹{data.earnings}</span>
                      <div 
                        className="w-full rounded-t-xl transition-all duration-500"
                        style={{ 
                          height: `${height}%`,
                          background: 'linear-gradient(180deg, #ff6b35, #ff3131)',
                          minHeight: data.earnings > 0 ? '20px' : '0'
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-bold">{data.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Earnings */}
            <div className="lg:col-span-2">
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                  borderColor: '#ff6b3520',
                }}
              >
                <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-[#ff6b35]" />
                  Recent Transactions
                </h2>

                <div className="space-y-4">
                  {earnings.length > 0 ? (
                    earnings.slice(0, 10).map((earning) => (
                      <div
                        key={earning.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 hover:bg-white/5 transition-all"
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                          <Image
                            src={earning.order_items?.designs?.design_url || '/placeholder.png'}
                            alt={earning.order_items?.designs?.title || 'Design'}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-1">
                            {earning.order_items?.designs?.title || 'Design Sale'}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1">
                            Order: {earning.orders?.order_number}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(earning.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-white mb-1">₹{earning.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            earning.status === 'paid' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {earning.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No earnings yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div>
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#00d9ff]" />
                  Payout History
                </h2>

                <div className="space-y-3 mb-6">
                  {payouts.length > 0 ? (
                    payouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="p-4 rounded-xl bg-black/40 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-white font-bold">₹{payout.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payout.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : payout.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {payout.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {payout.payment_method || 'Bank Transfer'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(payout.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No payouts yet</p>
                    </div>
                  )}
                </div>

                <button 
                  disabled={!stats?.pendingEarnings || stats.pendingEarnings < 1000}
                  className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ 
                    background: stats?.pendingEarnings && stats.pendingEarnings >= 1000 
                      ? 'linear-gradient(135deg, #ff6b35, #ff3131)' 
                      : '#333'
                  }}
                  onClick={() => toast.info('Payout request coming soon!')}
                >
                  Request Payout
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Minimum ₹1,000 required
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
