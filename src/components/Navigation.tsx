"use client";

import { Product } from '@/app/lib/product';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationProps {
  products: Product[];
  currentIndex: number;
  currentProduct: Product;
  onNext: () => void;
  onPrev: () => void;
  onSelectProduct: (index: number) => void;
}

export default function Navigation({ 
  currentProduct,
  onNext, 
  onPrev 
}: NavigationProps) {
  return (
    <>
      {/* Left Arrow */}
      <button 
        onClick={onPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full backdrop-blur-xl border transition-all duration-300 flex items-center justify-center hover:scale-110"
        style={{
          backgroundColor: `${currentProduct.theme.primary}20`,
          borderColor: `${currentProduct.theme.primary}40`
        }}
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      {/* Right Arrow */}
      <button 
        onClick={onNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-16 h-16 rounded-full backdrop-blur-xl border transition-all duration-300 flex items-center justify-center hover:scale-110"
        style={{
          backgroundColor: `${currentProduct.theme.primary}20`,
          borderColor: `${currentProduct.theme.primary}40`
        }}
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>
    </>
  );
}
