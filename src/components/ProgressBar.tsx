"use client";

import { Product } from '@/app/lib/product';
import { Pause, Play } from 'lucide-react';

interface ProgressBarProps {
  products: Product[];
  currentIndex: number;
  currentProduct: Product;
  isPaused: boolean;
  onTogglePause: () => void;
}

export default function ProgressBar({ 
  products, 
  currentIndex, 
  currentProduct, 
  isPaused, 
  onTogglePause 
}: ProgressBarProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
      {/* Counter */}
      <div className="px-5 py-3 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black" style={{ color: currentProduct.theme.primary }}>
            0{currentIndex + 1}
          </span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-500 text-sm">0{products.length}</span>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 px-5 py-3 backdrop-blur-xl bg-white/10 rounded-full border border-white/20">
        {products.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === index 
                ? 'w-8 h-2' 
                : 'w-2 h-2 bg-white/30 hover:bg-white/50'
            }`}
            style={{
              backgroundColor: currentIndex === index ? currentProduct.theme.primary : undefined
            }}
          />
        ))}
      </div>

      {/* Pause/Play Button */}
      <button
        onClick={onTogglePause}
        className="w-12 h-12 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition flex items-center justify-center"
      >
        {isPaused ? (
          <Play className="w-5 h-5 text-white fill-white" />
        ) : (
          <Pause className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}
