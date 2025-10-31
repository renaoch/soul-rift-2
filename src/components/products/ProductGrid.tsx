"use client";

import { Heart, Eye, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/app/context/CartContext';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  artist: string;
  artist_id: string | null;
  price: number;
  image: string;
  thumbnail?: string | null;
  likes: number;
  views: number;
  color: string;
  badge: string | null;
  size: string;
  style: string;
  sku: string;
}

export default function ProductGrid() {
  const params = useSearchParams();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const page = Number(params.get('page') || '1');
  const q = params.get('q') || '';
  const sort = params.get('sort') || 'popular';
  const cat = params.get('cat') || 'all';
  const price = params.get('price') || '';
  const styles = params.get('styles') || '';
  const colors = params.get('colors') || '';
  const sizes = params.get('sizes') || '';

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q, sort, cat, price, styles, colors, sizes]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/products', window.location.origin);
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', '12');
      if (q) url.searchParams.set('q', q);
      if (sort) url.searchParams.set('sort', sort);
      if (cat && cat !== 'all') url.searchParams.set('cat', cat);
      if (price) url.searchParams.set('price', price);
      if (styles) url.searchParams.set('styles', styles);
      if (colors) url.searchParams.set('colors', colors);
      if (sizes) url.searchParams.set('sizes', sizes);

      const response = await fetch(url.toString());
      const result = await response.json();

      if (result.success) {
        setProducts(result.products);
      } else {
        toast.error('Failed to load products');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    try {
      await fetch(`/api/products/${id}/like`, { method: 'POST' });
    } catch {}
  };

  const addToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem({
      productId: product.id,
      name: product.name,
      artist: product.artist,
      price: product.price,
      quantity: 1,
      size: 'M',
      color: 'Black',
      image: product.image,
      productColor: product.color || '#ff6b35',
    });
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 border border-white/10 h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-2xl font-black text-white mb-2">No results</div>
          <p className="text-gray-500">Try changing filters or search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400">
          <span className="text-white font-bold">{products.length}</span> products found
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div
              className="group relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image */}
              <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500"
                  style={{
                    backgroundColor: product.color,
                    opacity: hoveredIndex === index ? 0.4 : 0.2,
                  }}
                />
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {!!product.badge && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-black text-white backdrop-blur-xl border"
                    style={{
                      backgroundColor: `${product.color}50`,
                      borderColor: `${product.color}80`,
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                <div
                  className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                    hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                >
                  <button
                    onClick={(e) => toggleLike(e, product.id)}
                    className={`w-10 h-10 rounded-xl backdrop-blur-xl border flex items-center justify-center transition-all ${
                      likedProducts.includes(product.id)
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-black/60 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedProducts.includes(product.id) ? 'fill-red-400' : ''}`} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white">
                    <Eye className="w-5 h-5" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    <Heart className="w-3 h-3 text-white" />
                    <span className="text-[11px] font-bold text-white">{product.likes}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-[11px] font-bold text-white">{product.views}</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-base font-black text-white mb-0.5 group-hover:text-[#ff6b35] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[12px] text-gray-500">by {product.artist}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-white">₹{product.price}</p>
                  <button
                    onClick={(e) => addToCart(e, product)}
                    className="px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
