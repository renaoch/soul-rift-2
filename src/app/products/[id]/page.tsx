"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductsNav from '@/components/layout/ProductsNav';
import { useCart } from '@/app/context/CartContext';
import {
  Sparkles,
  Star,
  ArrowUpRight,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  User,
  Eye,
  Award,
  Link2,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductData {
  id: string;
  name: string;
  description: string;
  selling_price: number;
  size: string;
  color: string;
  material: string;
  badge: string;
  image_url: string;
  images: string[];
  style: string;
  like_count: number;
  view_count: number;
  purchase_count: number;
  artist_id: string;
  artist_profiles: {
    id: string;
    display_name: string;
    is_verified: boolean;
    bio: string;
  };
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Green', hex: '#16a34a' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const mainImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProduct();
    incrementViewCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const result = await res.json();
      if (result.success) {
        setProduct(result.product);
        setSelectedColor(result.product.color || 'Black');
        setSelectedSize(result.product.size || 'M');
      } else {
        toast.error('Product not found');
        router.push('/products');
      }
    } catch {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await fetch(`/api/products/${productId}/view`, { method: 'POST' });
    } catch {}
  };

  const images = useMemo(() => {
    if (!product) return [];
    const arr = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image_url];
    return arr.filter(Boolean);
  }, [product]);

  // Keyboard nav for thumbs
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!images.length) return;
      if (e.key === 'ArrowRight') setCurrentImageIndex((i) => Math.min(images.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setCurrentImageIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem({
      productId: product.id,
      designId: undefined,
      artistId: product.artist_id,
      name: product.name,
      artist: product.artist_profiles.display_name,
      price: product.selling_price,
      quantity,
      size: selectedSize,
      color: selectedColor,
      image: product.image_url,
      productColor: '#ff6b35',
    });
    toast.success('Added to cart');
  };

  const toggleLike = async () => {
    setIsLiked((v) => !v);
    try {
      await fetch(`/api/products/${productId}/like`, { method: 'POST' });
    } catch {}
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-bold">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) return null;

  return (
    <>
      <ProductsNav />

      <main className="relative w-full bg-black min-h-screen pt-24 pb-16">
        {/* BG */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute top-28 left-20 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#ff6b35]" />
          <div className="absolute bottom-28 right-20 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#00d9ff]" />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">
          {/* Back */}
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm">Back to Products</span>
          </Link>

          {/* Layout grid */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div
                ref={mainImageRef}
                className="relative aspect-square rounded-2xl border overflow-hidden group"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.03), transparent)', borderColor: 'rgba(255,107,53,0.1)' }}
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-3xl transition-all duration-700"
                  style={{ background: `radial-gradient(circle, #ff6b35, transparent 60%)` }}
                />
                <div className="relative w-full h-full p-8 md:p-10">
                  <Image
                    src={images[currentImageIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={`object-contain transition-transform duration-300 ${zoom ? 'scale-[1.05]' : 'scale-100'}`}
                    priority
                  />
                </div>

                {product.badge && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-xl border text-[11px] font-black text-white uppercase"
                    style={{ background: 'rgba(255,107,53,0.2)', borderColor: 'rgba(255,107,53,0.4)' }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Image actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleLike}
                    className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all ${
                      isLiked ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-black/60 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400' : ''}`} />
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition"
                    title="Copy link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShareOpen((v) => !v)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-white" />
                    <span className="text-[11px] font-bold text-white">{product.like_count}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-1.5">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-[11px] font-bold text-white">{product.view_count}</span>
                  </div>
                </div>
              </div>

              {/* Thumbs */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === index ? 'border-[#ff6b35] scale-105' : 'border-white/10 hover:border-white/30 opacity-70'
                      }`}
                      aria-label={`Show image ${index + 1}`}
                    >
                      <Image src={img} alt={`View ${index + 1}`} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Share popover (simple) */}
              {shareOpen && (
                <div className="w-full rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-white text-sm font-bold mb-2">Share</p>
                  <div className="text-gray-400 text-sm">Copy the link or share on your favourite platforms.</div>
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { icon: Truck, title: 'Free Shipping', desc: 'All orders' },
                  { icon: Shield, title: 'Secure Checkout', desc: 'PCI compliant' },
                  { icon: RefreshCw, title: '30-Day Returns', desc: 'Hassle-free' },
                ].map((f, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <f.icon className="w-5 h-5 text-[#ff6b35] mx-auto mb-2" />
                    <p className="text-white font-bold text-xs">{f.title}</p>
                    <p className="text-gray-500 text-[11px]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Buy box */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 h-fit">
              {/* Artist */}
              <Link href={`/artist/${product.artist_id}`} className="inline-block">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-3xl border group hover:scale-[1.02] transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,49,49,0.05))', borderColor: 'rgba(255,107,53,0.2)' }}
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">{product.artist_profiles.display_name}</span>
                  {product.artist_profiles.is_verified && <Check className="w-3 h-3 text-[#00d9ff]" />}
                </div>
              </Link>

              {/* Title & rating */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold text-sm">4.9</span>
                  <span className="text-gray-500 text-sm">(248)</span>
                </div>
              </div>

              {/* Short description */}
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">{product.description}</p>

              {/* Price card */}
              <div
                className="p-4 rounded-xl backdrop-blur-3xl border"
                style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.05), transparent)', borderColor: 'rgba(255,107,53,0.2)' }}
              >
                <p className="text-[11px] text-gray-500 mb-1 uppercase tracking-wider font-bold">Price</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-black text-white">₹{product.selling_price}</p>
                  <span className="text-gray-500">INR</span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Inclusive of all taxes</p>
              </div>

              {/* Size */}
              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-3 text-sm">
                  <Award className="w-4 h-4 text-[#ff6b35]" />
                  Select Size
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 rounded-lg font-bold text-sm transition-all ${
                        selectedSize === size
                          ? 'bg-gradient-to-r from-[#ff6b35] to-[#ff3131] text-white shadow-xl scale-105'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[#ff6b35]/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-3 text-sm">
                  <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                  Select Color
                </label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full transition-all ${
                        selectedColor === c.name ? 'ring-4 ring-[#ff6b35] scale-110' : 'ring-2 ring-white/20'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Select ${c.name}`}
                    >
                      {selectedColor === c.name && <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-3 text-sm">
                  <Shield className="w-4 h-4 text-[#ff6b35]" />
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold hover:bg-white/10 transition"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-white w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold hover:bg-white/10 transition"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAddToCart}
                className="group relative overflow-hidden w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ff6b35, #ff3131)', boxShadow: '0 20px 60px rgba(255,107,53,0.4)' }}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart · ₹{product.selling_price * quantity}
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              {/* Details */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#ff6b35]" />
                  Product Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material</span>
                    <span className="text-white font-bold">{product.material}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Style</span>
                    <span className="text-white font-bold">{product.style || 'Casual'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock</span>
                    <span className="text-green-400 font-bold">In Stock</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-3">Ships within 24-48 hours. Printed in India.</p>
              </div>
            </div>
          </div>

          {/* More from this artist */}
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-black">More from {product.artist_profiles.display_name}</h3>
              <Link href={`/artist/${product.artist_id}`} className="text-[#ff6b35] text-sm font-bold hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
                    <Loader2 className="w-5 h-5 text-white absolute inset-0 m-auto animate-spin" />
                  </div>
                  <div className="mt-3 h-4 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
