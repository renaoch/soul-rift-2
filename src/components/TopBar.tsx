"use client";

import { Product } from '@/app/lib/product';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

interface TopBarProps {
  product: Product;
}

export default function TopBar({ product }: TopBarProps) {
  return (
    <>
      {/* Top Left - Logo */}
      <div className="fixed top-8 left-8 z-50">
        <div 
        //   className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-3xl border shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
        //   style={{
        //     background: `${product.theme.bg}80`,
        //     borderColor: `${product.theme.primary}30`,
        //   }}
        >
          {/* <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-xl overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${product.theme.primary}, ${product.theme.accent})`,
            }}
          >
            T
          </div> */}
          {/* <div className="overflow-hidden">
            <h1 className="text-lg font-black text-white tracking-tight whitespace-nowrap">TeeStudio</h1>
            <p className="text-[9px] tracking-[0.25em] text-gray-500 uppercase font-bold">Premium</p>
          </div> */}
        </div>
      </div>

      {/* Top Right - Actions */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
        {/* Navigation Menu */}
        <div 
          className="hidden md:flex items-center gap-2 px-4 py-3 rounded-2xl backdrop-blur-3xl border shadow-2xl"
          style={{
            background: `${product.theme.bg}80`,
            borderColor: `${product.theme.primary}30`,
          }}
        >
          <button className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition rounded-xl hover:bg-white/10">
            Collections
          </button>
          <button className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition rounded-xl hover:bg-white/10">
            Customize
          </button>
          <button className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition rounded-xl hover:bg-white/10">
            About
          </button>
        </div>

        {/* Action Icons */}
        <div 
          className="flex items-center gap-2 px-3 py-3 rounded-2xl backdrop-blur-3xl border shadow-2xl"
          style={{
            background: `${product.theme.bg}80`,
            borderColor: `${product.theme.primary}30`,
          }}
        >
          <button className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition">
            <User className="w-4 h-4" />
          </button>
          <button 
            className="px-4 py-2 rounded-xl font-bold text-white flex items-center gap-2 shadow-xl transition-all hover:scale-105"
            style={{ 
              background: `linear-gradient(135deg, ${product.theme.primary}, ${product.theme.accent})`,
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm hidden lg:block">Cart</span>
          </button>
        </div>

        {/* Mobile Menu */}
        <button 
          className="md:hidden w-12 h-12 rounded-2xl backdrop-blur-3xl border shadow-2xl flex items-center justify-center text-white"
          style={{
            background: `${product.theme.bg}80`,
            borderColor: `${product.theme.primary}30`,
          }}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
