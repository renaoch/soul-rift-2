"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  ShoppingCart,
  Search,
  DollarSign,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Eye,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  qikink_order_id: number | null;
  qikink_order_number: string | null;
  gateway: string;
  payment_status: string;
  order_status: string;
  total_order_value: number;
  platform_revenue: number;
  total_artist_commission: number;
  created_at: string;
  live_date: string | null;
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
  } | null;
  shipping_address: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address1: string;
    address2: string | null;
    city: string;
    zip: string;
    province: string;
    country_code: string;
    awb: string | null;
    tracking_link: string | null;
  } | null;
}

interface Stats {
  total: number;
  paid: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [awb, setAwb] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/orders?status=${statusFilter}${searchQuery ? `&search=${searchQuery}` : ''}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setOrders(result.orders);
        setStats(result.stats);
      } else {
        if (result.error?.message.includes('Unauthorized')) {
          toast.error('Access denied - Admin only');
          router.push('/');
        } else {
          toast.error('Failed to load orders');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order);
    setUpdateStatus(order.order_status);
    setTrackingLink(order.shipping_address?.tracking_link || '');
    setAwb(order.shipping_address?.awb || '');
    setShowUpdateModal(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          orderStatus: updateStatus,
          trackingLink: trackingLink || undefined,
          awb: awb || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Order updated successfully');
        fetchOrders();
        setShowUpdateModal(false);
        setSelectedOrder(null);
      } else {
        toast.error('Failed to update order');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleSearch = () => {
    fetchOrders();
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: any; color: string; label: string }> = {
      created: { icon: Clock, color: 'yellow', label: 'Pending' },
      pending: { icon: Clock, color: 'yellow', label: 'Pending' },
      processing: { icon: Package, color: 'blue', label: 'Processing' },
      shipped: { icon: Truck, color: 'purple', label: 'Shipped' },
      delivered: { icon: CheckCircle2, color: 'green', label: 'Delivered' },
      cancelled: { icon: XCircle, color: 'red', label: 'Cancelled' },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <div className={`px-3 py-1.5 rounded-full bg-${badge.color}-500/20 backdrop-blur-xl border border-${badge.color}-500/40 flex items-center gap-1`}
        style={{
          background: `rgba(${badge.color === 'yellow' ? '234,179,8' : badge.color === 'blue' ? '59,130,246' : badge.color === 'purple' ? '168,85,247' : badge.color === 'green' ? '34,197,94' : '239,68,68'}, 0.2)`,
          borderColor: `rgba(${badge.color === 'yellow' ? '234,179,8' : badge.color === 'blue' ? '59,130,246' : badge.color === 'purple' ? '168,85,247' : badge.color === 'green' ? '34,197,94' : '239,68,68'}, 0.4)`
        }}>
        <Icon className="w-3 h-3" style={{ color: badge.color === 'yellow' ? '#eab308' : badge.color === 'blue' ? '#3b82f6' : badge.color === 'purple' ? '#a855f7' : badge.color === 'green' ? '#22c55e' : '#ef4444' }} />
        <span className="text-xs font-bold" style={{ color: badge.color === 'yellow' ? '#eab308' : badge.color === 'blue' ? '#3b82f6' : badge.color === 'purple' ? '#a855f7' : badge.color === 'green' ? '#22c55e' : '#ef4444' }}>{badge.label}</span>
      </div>
    );
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          <span className="text-xs font-bold text-green-400">Paid</span>
        </div>
      );
    }
    return (
      <div className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center gap-1">
        <XCircle className="w-3 h-3 text-red-400" />
        <span className="text-xs font-bold text-red-400">Unpaid</span>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Loading orders...</p>
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
                Order Management
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
                  Orders
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Orders
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              View and manage all customer orders
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <ShoppingCart className="w-8 h-8 text-[#ff6b35] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.total || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Total Orders</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <DollarSign className="w-8 h-8 text-[#39ff14] mb-3" />
              <p className="text-4xl font-black text-white mb-1">₹{stats?.totalRevenue || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Revenue</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <Package className="w-8 h-8 text-[#00d9ff] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.processing || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Processing</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #a855f708, transparent)',
                borderColor: '#a855f720',
              }}
            >
              <Truck className="w-8 h-8 text-[#a855f7] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.shipped || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Shipped</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by order number, email, or username..."
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-4 rounded-2xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525] transition"
            >
              Search
            </button>

            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
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

          {/* Orders Table */}
          {orders.length > 0 ? (
            <div 
              className="rounded-3xl backdrop-blur-3xl border overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Order</th>
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Payment</th>
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="text-left p-6 text-sm font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="p-6">
                          <p className="text-white font-bold">{order.order_number}</p>
                          {order.qikink_order_id && (
                            <p className="text-xs text-gray-500">Qikink: {order.qikink_order_id}</p>
                          )}
                        </td>
                        <td className="p-6">
                          <p className="text-white font-medium">{order.user?.username || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email}</p>
                        </td>
                        <td className="p-6">
                          <p className="text-white font-bold">₹{order.total_order_value}</p>
                        </td>
                        <td className="p-6">
                          {getPaymentBadge(order.payment_status)}
                        </td>
                        <td className="p-6">
                          {getStatusBadge(order.order_status)}
                        </td>
                        <td className="p-6">
                          <p className="text-gray-400 text-sm">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => openUpdateModal(order)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <ShoppingCart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">No orders found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try a different search term' : 'No orders yet'}
              </p>
            </div>
          )}
        </div>

        {/* Update Order Modal */}
        {showUpdateModal && selectedOrder && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-8 overflow-y-auto"
            onClick={() => setShowUpdateModal(false)}
          >
            <div 
              className="max-w-4xl w-full rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl my-8"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-black text-white mb-2">Order Details</h2>
                  <p className="text-gray-400">{selectedOrder.order_number}</p>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Customer Info */}
                <div 
                  className="p-6 rounded-2xl bg-black/40 border border-white/10"
                >
                  <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#ff6b35]" />
                    Customer Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.user?.username || 'Guest'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.user?.email}</span>
                    </div>
                    {selectedOrder.user?.phone && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{selectedOrder.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div 
                    className="p-6 rounded-2xl bg-black/40 border border-white/10"
                  >
                    <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#00d9ff]" />
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-300 space-y-1">
                      <p className="font-bold text-white">
                        {selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}
                      </p>
                      <p>{selectedOrder.shipping_address.address1}</p>
                      {selectedOrder.shipping_address.address2 && <p>{selectedOrder.shipping_address.address2}</p>}
                      <p>
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.province} {selectedOrder.shipping_address.zip}
                      </p>
                      <p>{selectedOrder.shipping_address.country_code}</p>
                      <div className="pt-2 space-y-1">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          {selectedOrder.shipping_address.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Details */}
              <div 
                className="p-6 rounded-2xl bg-black/40 border border-white/10 mb-8"
              >
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#39ff14]" />
                  Order Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-white">₹{selectedOrder.total_order_value}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Platform Revenue</p>
                    <p className="text-xl font-bold text-white">₹{selectedOrder.platform_revenue}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Artist Commission</p>
                    <p className="text-xl font-bold text-white">₹{selectedOrder.total_artist_commission}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Gateway</p>
                    <p className="text-lg font-bold text-white capitalize">{selectedOrder.gateway}</p>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div 
                className="p-6 rounded-2xl bg-black/40 border border-white/10 mb-6"
              >
                <h3 className="text-lg font-black text-white mb-4">Update Order</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Order Status
                    </label>
                    <select
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="w-full px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    >
                      <option value="created">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      AWB Number
                    </label>
                    <input
                      type="text"
                      value={awb}
                      onChange={(e) => setAwb(e.target.value)}
                      placeholder="Enter AWB tracking number"
                      className="w-full px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                      Tracking Link
                    </label>
                    <input
                      type="url"
                      value={trackingLink}
                      onChange={(e) => setTrackingLink(e.target.value)}
                      placeholder="Enter tracking URL"
                      className="w-full px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateOrder}
                  className="flex-1 py-4 rounded-2xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525] transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Update Order
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
