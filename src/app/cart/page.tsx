"use client";

import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import ProductsNav from '@/components/layout/ProductsNav';
import { useCart } from '@/app/context/CartContext';

export default function CartPage() {
  const { items, itemCount } = useCart();
  const hasItems = itemCount > 0;

  return (
    <>
      <ProductsNav />
      
      <main className="w-full bg-black min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-8">
          {hasItems ? (
            <>
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  Your Cart
                </h1>
                <p className="text-lg text-gray-400">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>

              {/* Cart Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <CartItems />
                </div>
                <div className="lg:col-span-1">
                  <CartSummary />
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </div>
      </main>
    </>
  );
}
