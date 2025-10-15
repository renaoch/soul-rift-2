    import { ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmptyCart() {
  return (
    <div className="max-w-2xl mx-auto text-center py-20">
      {/* Icon */}
      <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-gray-600" />
      </div>

      {/* Text */}
      <h2 className="text-4xl font-black text-white mb-4">
        Your Cart is Empty
      </h2>
      <p className="text-lg text-gray-400 mb-12">
        Looks like you haven't added any designs yet. Start shopping to support independent artists!
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/products">
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3131] text-white font-bold hover:scale-105 transition-all shadow-2xl flex items-center gap-2">
            Browse Designs
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <Link href="/">
          <button className="px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
            Back to Home
          </button>
        </Link>
      </div>

      {/* Featured Stats */}
      <div className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-white/10">
        <div>
          <p className="text-3xl font-black text-white mb-1">5K+</p>
          <p className="text-sm text-gray-500">Designs</p>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div>
          <p className="text-3xl font-black text-white mb-1">1.2K+</p>
          <p className="text-sm text-gray-500">Artists</p>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div>
          <p className="text-3xl font-black text-white mb-1">FREE</p>
          <p className="text-sm text-gray-500">Shipping</p>
        </div>
      </div>
    </div>
  );
}
