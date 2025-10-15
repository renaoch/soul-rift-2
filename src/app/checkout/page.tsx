"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import ProductsNav from '@/components/layout/ProductsNav';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { Sparkles } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount } = useCart();

  useEffect(() => {
    if (itemCount === 0) {
      router.push('/cart');
    }
  }, [itemCount, router]);

  if (itemCount === 0) {
    return null;
  }

  return (
    <>
      <ProductsNav />
      
      <main className="relative w-full bg-black min-h-screen pt-24 pb-20">
        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Floating Glows */}
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#ff6b35]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#00d9ff]" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Header */}
          <div className="mb-16">
            {/* Collection Badge */}
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
                Secure Checkout
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

            {/* Title with 3D Depth */}
            <h1 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter relative mb-6">
              {/* Shadow layers for 3D depth */}
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
                  Complete
                </span>
              ))}
              
              {/* Main text */}
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Complete
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Your Order
            </p>
          </div>

          {/* Checkout Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            <CheckoutForm />
            <OrderSummary />
          </div>
        </div>
      </main>
    </>
  );
}
