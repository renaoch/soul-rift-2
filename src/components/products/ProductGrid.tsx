"use client";

import { Heart, Eye, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCart } from '@/app/context/CartContext';

interface Product {
  id: string;
  name: string;
  artist: string;
  artist_id: string;
  price: number;
  image: string;
  likes: number;
  views: number;
  color: string;
  badge: string | null;
  size: string;
  style: string;
  sku: string;
}

export default function ProductGrid() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?page=${page}&limit=12`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.products);
        setTotalPages(result.pagination.pages);
      } else {
        toast.error('Failed to load products');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    
    setLikedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    
    try {
      await fetch(`/api/products/${id}/like`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const addToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigation
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
      productColor: '#ff6b35',
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Sort Bar */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-gray-400">
          <span className="text-white font-bold">{products.length}</span> products found
        </p>
        <select className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 text-white text-sm focus:outline-none focus:border-white/30">
          <option>Sort by: Popular</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Link 
            href={`/products/${product.id}`} 
            key={product.id}
          >
            <div
              className="group relative rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden hover:scale-[1.02] transition-all duration-500 cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-square bg-gradient-to-br from-white/10 to-transparent overflow-hidden">
                {/* Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500"
                  style={{ 
                    backgroundColor: product.color,
                    opacity: hoveredIndex === index ? 0.4 : 0.2
                  }}
                />

                {/* Product Image */}
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                  <Image
                    src={product.image || '/placeholder.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                  />
                </div>

                {/* Badge */}
                {product.badge && (
                  <div 
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-black text-white backdrop-blur-xl border"
                    style={{ 
                      backgroundColor: `${product.color}50`,
                      borderColor: `${product.color}80`
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
                  hoveredIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                }`}>
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
                  <button className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Stats */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    <Heart className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">{product.likes}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-2">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">{product.views}</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-white mb-1 group-hover:text-[#ff6b35] transition-colors">{product.name}</h3>
                  <p className="text-sm text-gray-500">by {product.artist}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-2xl font-black text-white">₹{product.price}</p>
                  <button 
                    onClick={(e) => addToCart(e, product)}
                    className="px-5 py-2.5 rounded-xl border border-white/20 bg-white/10 text-white font-bold hover:bg-white/20 transition-all flex items-center gap-2"
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

      {/* Load More */}
      {page < totalPages && (
        <div className="mt-12 text-center">
          <button 
            onClick={() => setPage(page + 1)}
            className="px-10 py-4 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold hover:bg-white/20 transition-all"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
}
