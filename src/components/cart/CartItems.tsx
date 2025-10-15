"use client";

import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function CartItems() {
  const { items, updateQuantity, removeItem } = useCart();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
        >
          <div className="flex gap-6 p-6">
            {/* Product Image */}
            <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
              <div 
                className="absolute inset-0 opacity-20 blur-2xl"
                style={{ backgroundColor: item.productColor }}
              />
              <div className="relative w-full h-full p-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-white mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3">by {item.artist}</p>
                
                {/* Size & Color Pills */}
                <div className="flex gap-2 mb-4">
                  <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                    <span className="text-xs font-bold text-white">Size: {item.size}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                    <span className="text-xs font-bold text-white">Color: {item.color}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-white w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Price */}
                <p className="text-2xl font-black text-white">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition">
                <Heart className="w-5 h-5" />
              </button>
              <button 
                onClick={() => removeItem(item.id)}
                className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
