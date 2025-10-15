"use client";

import { Product } from '@/app/lib/product';
import { Eye, Palette, Star, TrendingUp, Heart, Share2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="col-span-4 space-y-6 flex flex-col justify-center">
      {/* Collection Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 w-fit">
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: product.theme.primary }}
        />
        <span className="text-sm text-gray-400 font-medium">{product.collection}</span>
      </div>

      {/* Product Name */}
      <div>
        <h1 className="text-6xl font-black text-white leading-none tracking-tight">
          {product.name}
        </h1>
        <p className="text-xl text-gray-400 mt-3 font-medium">{product.color}</p>
      </div>

      {/* Rating & Sales */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-white font-bold">{product.rating}</span>
          <span className="text-gray-500 text-sm">(2.3k reviews)</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: product.theme.primary }} />
          <span className="text-gray-400 text-sm font-medium">{product.sales} sold</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-base text-gray-400 leading-relaxed">
        {product.description}
      </p>

      {/* Price Section */}
      <div className="p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-1 tracking-wider">STARTING AT</p>
            <p className="text-5xl font-black text-white">${product.price}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`w-11 h-11 rounded-xl backdrop-blur-xl border flex items-center justify-center transition ${
                isLiked 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-400' : ''}`} />
            </button>
            <button className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CTA Buttons - Landing Page Style */}
        <div className="space-y-3">
          <button 
            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] group"
            style={{ 
              background: `linear-gradient(135deg, ${product.theme.primary}, ${product.theme.accent})`,
              boxShadow: `0 20px 60px ${product.theme.primary}40`
            }}
          >
            <Eye className="w-5 h-5" />
            <span>View Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 hover:bg-white/10 border border-white/20 backdrop-blur-xl"
          >
            <Palette className="w-5 h-5" />
            <span>Customize Design</span>
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <p className="text-2xl font-black text-white">100%</p>
          <p className="text-xs text-gray-500">Cotton</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <p className="text-2xl font-black text-white">Free</p>
          <p className="text-xs text-gray-500">Shipping</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10">
          <p className="text-2xl font-black text-white">24h</p>
          <p className="text-xs text-gray-500">Delivery</p>
        </div>
      </div>
    </div>
  );
}
