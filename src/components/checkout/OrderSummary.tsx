"use client";

import { useCart } from '@/app/context/CartContext';
import { Package, TrendingUp, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function OrderSummary() {
  const { items, total, itemCount } = useCart();

  const shipping = 0;
  const tax = 0;
  const finalTotal = total + shipping + tax;

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden lg:sticky lg:top-32 h-fit">
      {/* Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-[#ff6b35]" />
          Order Summary
        </h3>
      </div>

      <div className="p-6">
        {/* Items List */}
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mb-2">
                  {item.size} · {item.color} · Qty: {item.quantity}
                </p>
                <p className="text-sm font-bold text-white">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 py-6 border-y border-white/10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Subtotal ({itemCount} items)</span>
            <span className="font-bold text-white">₹{total}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="font-bold text-green-400">FREE</span>
          </div>
          {tax > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Tax</span>
              <span className="font-bold text-white">₹{tax}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-6">
          <span className="text-lg font-bold text-white">Total</span>
          <span className="text-3xl font-black text-white">₹{finalTotal}</span>
        </div>

        {/* Trust Badges */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4 text-green-400" />
            </div>
            <span>Secure checkout with SSL encryption</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <span>Support independent artists with every purchase</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <span>Free returns within 30 days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
