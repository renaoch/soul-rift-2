"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Mail,
  Phone,
  Download,
  ArrowUpRight,
  Sparkles,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface OrderData {
  id: string;
  order_number: string;
  payment_status: string;
  order_status: string;
  total_order_value: number;
  created_at: string;
  live_date: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
    products: {
      name: string;
      image_url: string;
    };
    designs: {
      title: string;
      design_url: string;
    };
  }>;
  shipping_addresses: Array<{
    first_name: string;
    last_name: string;
    address1: string;
    address2: string;
    city: string;
    province: string;
    zip: string;
    phone: string;
    email: string;
    awb: string;
    tracking_link: string;
  }>;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrder(result.order);
      } else {
        toast.error('Order not found');
      }
    } catch (error) {
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number);
      toast.success('Order number copied!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return '#00d9ff';
      case 'processing':
        return '#ff6b35';
      case 'shipped':
        return '#39ff14';
      case 'delivered':
        return '#00ff88';
      default:
        return '#gray';
    }
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-xl">Loading order...</div>
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-black text-white mb-4">Order Not Found</h1>
            <Link href="/products">
              <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3131] text-white font-bold">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const shippingAddress = order.shipping_addresses[0];

  return (
    <>
      <ProductsNav />
      
      <main className="relative w-full bg-black min-h-screen pt-24 pb-20">
        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #00d9ff 1px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating Glows */}
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#00d9ff]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#39ff14]" />

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          {/* Success Header */}
          <div className="mb-16 text-center">
            {/* Success Badge */}
            <div 
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl backdrop-blur-3xl border shadow-2xl mb-8 group hover:scale-105 transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #00d9ff15, #39ff1410)',
                borderColor: '#00d9ff30',
                boxShadow: '0 20px 60px #00d9ff20'
              }}
            >
              <CheckCircle2 className="w-6 h-6 text-[#00d9ff]" />
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                Order Confirmed
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

            {/* Title with 3D Depth */}
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-black leading-[0.85] tracking-tighter relative mb-6">
              {/* Shadow layers */}
              {[...Array(6)].map((_, i) => (
                <span
                  key={i}
                  className="absolute inset-0"
                  style={{
                    color: '#00d9ff',
                    opacity: 0.15 - (i * 0.02),
                    transform: `translate(${i * 2}px, ${i * 2}px)`,
                    zIndex: -i
                  }}
                >
                  Thank You!
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Thank You!
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl mx-auto mb-8">
              Your order has been confirmed and will be shipped soon
            </p>

            {/* Order Number */}
            <div 
              className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl backdrop-blur-3xl border cursor-pointer group hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
              onClick={copyOrderNumber}
            >
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Order Number</p>
                <p className="text-2xl font-black text-white">{order.order_number}</p>
              </div>
              <Copy className="w-5 h-5 text-gray-500 group-hover:text-[#00d9ff] transition-colors" />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items & Tracking */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Status Timeline */}
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #00d9ff30, #39ff1420)',
                      boxShadow: '0 10px 40px #00d9ff30'
                    }}
                  >
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Order Status
                  </h2>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                  {[
                    { status: 'Order Placed', date: order.created_at, active: true, complete: true },
                    { status: 'Payment Confirmed', date: order.live_date, active: order.payment_status === 'paid', complete: order.payment_status === 'paid' },
                    { status: 'Processing', date: null, active: order.order_status === 'processing', complete: false },
                    { status: 'Shipped', date: null, active: order.order_status === 'shipped', complete: false },
                    { status: 'Delivered', date: null, active: order.order_status === 'delivered', complete: false },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                            step.complete 
                              ? 'bg-[#00d9ff] border-[#00d9ff]' 
                              : step.active
                              ? 'bg-[#00d9ff]/20 border-[#00d9ff] animate-pulse'
                              : 'bg-black/40 border-white/10'
                          }`}
                        >
                          {step.complete && <CheckCircle2 className="w-5 h-5 text-black" />}
                        </div>
                        {index < 4 && (
                          <div 
                            className={`w-0.5 h-12 ${
                              step.complete ? 'bg-[#00d9ff]' : 'bg-white/10'
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-white font-bold mb-1">{step.status}</p>
                        {step.date && (
                          <p className="text-sm text-gray-500">
                            {new Date(step.date).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Link */}
                {shippingAddress?.tracking_link && (
                  <a
                    href={shippingAddress.tracking_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #00d9ff, #39ff14)',
                      boxShadow: '0 20px 60px #00d9ff50'
                    }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    Track Package
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, #39ff14, #00d9ff)',
                      }}
                    />
                  </a>
                )}
              </div>

              {/* Order Items */}
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-[#00d9ff]" />
                  <h2 className="text-2xl font-black text-white">
                    Order Items
                  </h2>
                </div>

                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/10"
                    >
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                        <Image
                          src={item.designs?.design_url || item.products?.image_url || '/placeholder.png'}
                          alt={item.designs?.title || item.products?.name || 'Product'}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold mb-1">
                          {item.designs?.title || item.products?.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.size} · {item.color} · Qty: {item.quantity}
                        </p>
                        <p className="text-white font-bold">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Summary & Shipping */}
            <div className="space-y-8">
              {/* Order Summary */}
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00d9ff]" />
                  Summary
                </h3>

                <div className="space-y-4 pb-6 border-b border-white/10">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white font-bold">₹{order.total_order_value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-green-400 font-bold">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6">
                  <span className="text-lg font-bold text-white">Total Paid</span>
                  <span className="text-3xl font-black text-white">₹{order.total_order_value}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div 
                className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                  borderColor: '#00d9ff20',
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-[#00d9ff]" />
                  <h3 className="text-xl font-black text-white">
                    Shipping To
                  </h3>
                </div>

                <div className="space-y-3 text-gray-300">
                  <p className="font-bold text-white">
                    {shippingAddress.first_name} {shippingAddress.last_name}
                  </p>
                  <p>{shippingAddress.address1}</p>
                  {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
                  <p>
                    {shippingAddress.city}, {shippingAddress.province} {shippingAddress.zip}
                  </p>
                  
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-[#00d9ff]" />
                      <span>{shippingAddress.phone}</span>
                    </div>
                    {shippingAddress.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-[#00d9ff]" />
                        <span>{shippingAddress.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <Link href="/products">
                <button 
                  className="group relative overflow-hidden w-full py-4 rounded-2xl font-bold text-white text-base transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                    boxShadow: '0 20px 60px #ff6b3550'
                  }}
                >
                  Continue Shopping
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(135deg, #ff3131, #ff6b35)',
                    }}
                  />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
