"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  Package, 
  Clock,
  Truck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  payment_status: string;
  order_status: string;
  total_order_value: number;
  created_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    products: {
      name: string;
      image_url: string;
    };
    designs: {
      title: string;
      design_url: string;
    };
  }>;
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/list');
      const result = await response.json();

      if (result.success) {
        setOrders(result.orders);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return <Clock className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return '#ff6b35';
      case 'shipped':
        return '#00d9ff';
      case 'delivered':
        return '#39ff14';
      default:
        return '#gray';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.order_status === filter;
  });

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading orders...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductsNav />
      
      <main className="relative w-full bg-black min-h-screen pt-24 pb-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="absolute top-40 left-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#ff6b35]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#00d9ff]" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="mb-16">
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
                Order History
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
                  My Orders
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                My Orders
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Track and manage your purchases
            </p>
          </div>

          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {[
              { value: 'all', label: 'All Orders', icon: ShoppingBag },
              { value: 'processing', label: 'Processing', icon: Clock },
              { value: 'shipped', label: 'Shipped', icon: Truck },
              { value: 'delivered', label: 'Delivered', icon: CheckCircle2 },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-3xl border font-bold whitespace-nowrap transition-all ${
                  filter === tab.value
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#ff3131] border-[#ff6b35] text-white shadow-2xl scale-105'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-16 shadow-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">No Orders Yet</h3>
              <p className="text-gray-400 mb-8">Start shopping to see your orders here</p>
              <Link href="/products">
                <button 
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl inline-flex items-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                    boxShadow: '0 20px 60px #ff6b3550'
                  }}
                >
                  Browse Products
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Link key={order.id} href={`/order-confirmation/${order.id}`}>
                  <div 
                    className="rounded-3xl backdrop-blur-3xl border p-6 shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                      borderColor: '#ff6b3520',
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-black text-white">
                            {order.order_number}
                          </h3>
                          <div 
                            className="px-3 py-1.5 rounded-full backdrop-blur-xl border flex items-center gap-2"
                            style={{
                              background: `${getStatusColor(order.order_status)}20`,
                              borderColor: `${getStatusColor(order.order_status)}40`,
                            }}
                          >
                            {getStatusIcon(order.order_status)}
                            <span 
                              className="text-xs font-bold uppercase"
                              style={{ color: getStatusColor(order.order_status) }}
                            >
                              {order.order_status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">Total</p>
                        <p className="text-3xl font-black text-white">₹{order.total_order_value}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                      {order.order_items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent border border-white/10"
                        >
                          <Image
                            src={item.designs?.design_url || item.products?.image_url || '/placeholder.png'}
                            alt={item.designs?.title || item.products?.name || 'Product'}
                            fill
                            sizes="80px"
                            className="object-contain p-2"
                          />
                        </div>
                      ))}
                      {order.order_items.length > 4 && (
                        <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-400">
                            +{order.order_items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <p className="text-sm text-gray-500">
                        {order.order_items.length} {order.order_items.length === 1 ? 'item' : 'items'}
                      </p>
                      <div className="flex items-center gap-2 text-[#ff6b35] font-bold group-hover:gap-3 transition-all">
                        View Details
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
