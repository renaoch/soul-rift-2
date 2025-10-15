"use client";

import { ArrowRight, Tag, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export default function CartSummary() {
  const router = useRouter();
  const { total, itemCount } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);

  const shipping = 0; // Free shipping
  const discount = appliedPromo ? Math.floor(total * 0.1) : 0; // 10% off
  const finalTotal = total + shipping - discount;

  const applyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo(true);
    }
  };

  const proceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="sticky top-32">
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff6b35]" />
            Order Summary
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Promo Code */}
          <div>
            <label className="text-sm font-bold text-white mb-3 block flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={appliedPromo}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition disabled:opacity-50"
              />
              <button
                onClick={applyPromo}
                disabled={appliedPromo}
                className="px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Promo code applied! 10% off
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-4 py-6 border-y border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Subtotal ({itemCount} items)</span>
              <span className="text-lg font-bold text-white">₹{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Shipping</span>
              <span className="text-lg font-bold text-green-400">FREE</span>
            </div>
            {appliedPromo && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Discount</span>
                <span className="text-lg font-bold text-green-400">-₹{discount}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-4 px-6 rounded-xl bg-gradient-to-r from-white/10 to-transparent border border-white/10">
            <span className="text-lg font-bold text-white">Total</span>
            <span className="text-3xl font-black text-white">₹{finalTotal}</span>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={proceedToCheckout}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3131] text-white font-bold hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Trust Badges */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Secure checkout with SSL encryption
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Free returns within 30 days
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Support artists with every purchase
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
