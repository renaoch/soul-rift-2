"use client";
import { useCart } from '@/app/context/CartContext';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsNav() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Top Left - Logo */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          href="/"
          className="flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-3xl border border-white/10 shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
          style={{
            background: '#0a0a0a80',
          }}
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xl relative">
            <Image 
              src="/logo-no.png" 
              alt="Soul Rift Logo"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-black text-white tracking-tight whitespace-nowrap">Soul Rift</h1>
            <p className="text-[9px] tracking-[0.25em] text-gray-500 uppercase font-bold">Marketplace</p>
          </div>
        </Link>
      </div>

      {/* Top Right - Actions */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
        {/* Navigation Menu - Desktop */}
        <div 
          className="hidden md:flex items-center gap-2 px-4 py-3 rounded-2xl backdrop-blur-3xl border shadow-2xl"
          style={{
            background: '#0a0a0a80',
            borderColor: '#ff6b3530',
          }}
        >
          <Link href="/products" className="px-4 py-2 text-sm font-bold text-white transition rounded-xl hover:bg-white/10">
            All Designs
          </Link>
          <Link href="/artists" className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition rounded-xl hover:bg-white/10">
            Artists
          </Link>
          <Link href="/collections" className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition rounded-xl hover:bg-white/10">
            Collections
          </Link>
        </div>

        {/* Action Icons */}
        <div 
          className="flex items-center gap-2 px-3 py-3 rounded-2xl backdrop-blur-3xl border shadow-2xl"
          style={{
            background: '#0a0a0a80',
            borderColor: '#ff6b3530',
          }}
        >
          <button className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition">
            <Search className="w-4 h-4" />
          </button>
          <Link 
            href="/login"
            className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition"
          >
            <User className="w-4 h-4" />
          </Link>
          
          {/* Cart Button - Updated to Link */}
          <Link 
            href="/cart"
            className="px-4 py-2 rounded-xl bg-white text-black font-bold flex items-center gap-2 hover:bg-zinc-100 transition relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:block">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-[10px] font-black flex items-center justify-center text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-12 h-12 rounded-2xl backdrop-blur-3xl border shadow-2xl flex items-center justify-center text-white"
          style={{
            background: '#0a0a0a80',
            borderColor: '#ff6b3530',
          }}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <Link 
              href="/products" 
              className="text-3xl font-bold text-white hover:text-gray-300 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              All Designs
            </Link>
            <Link 
              href="/artists" 
              className="text-3xl font-bold text-white hover:text-gray-300 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link 
              href="/collections" 
              className="text-3xl font-bold text-white hover:text-gray-300 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link 
              href="/cart" 
              className="text-3xl font-bold text-white hover:text-gray-300 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart ({itemCount})
            </Link>
            <Link 
              href="/login" 
              className="text-3xl font-bold text-white hover:text-gray-300 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
