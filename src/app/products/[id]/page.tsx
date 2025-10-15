"use client";

import { useEffect, useState } from 'react';
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
  Package,
  Award
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

  useEffect(() => {
    fetchProduct();
    incrementViewCount();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();

      if (result.success) {
        setProduct(result.product);
        setSelectedColor(result.product.color);
        setSelectedSize(result.product.size);
      } else {
        toast.error('Product not found');
        router.push('/products');
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async () => {
    await fetch(`/api/products/${productId}/view`, { method: 'POST' });
  };

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
  };

  const toggleLike = async () => {
    setIsLiked(!isLiked);
    await fetch(`/api/products/${productId}/like`, { method: 'POST' });
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

  if (!product) {
    return null;
  }

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image_url];

  return (
    <>
      <ProductsNav />
      
      <main className="relative w-full bg-black min-h-screen pt-24 pb-20">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
          <div className="absolute top-40 left-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#ff6b35]" />
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#00d9ff]" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Back Button */}
          <Link href="/products">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold text-sm">Back to Products</span>
            </button>
          </Link>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative aspect-square rounded-2xl backdrop-blur-3xl border overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.03), transparent)',
                  borderColor: 'rgba(255,107,53,0.1)',
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 blur-3xl transition-all duration-700"
                  style={{ background: `radial-gradient(circle, #ff6b35, transparent 60%)` }}
                />

                <div className="relative w-full h-full p-12">
                  <Image
                    src={images[currentImageIndex]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Badge */}
                {product.badge && (
                  <div 
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-xl border text-xs font-black text-white uppercase"
                    style={{
                      background: 'rgba(255,107,53,0.2)',
                      borderColor: 'rgba(255,107,53,0.4)',
                    }}
                  >
                    {product.badge}
                  </div>
                )}

                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleLike}
                    className={`w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all ${
                      isLiked
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-black/60 border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-400' : ''}`} />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats */}
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">{product.like_count}</span>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center gap-1.5">
                    <Eye className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">{product.view_count}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? 'border-[#ff6b35] scale-105'
                          : 'border-white/10 hover:border-white/30 opacity-60'
                      }`}
                    >
                      <Image src={img} alt={`View ${index + 1}`} fill sizes="80px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 pt-4">
                {[
                  { icon: Truck, title: 'Free Ship', desc: 'All orders' },
                  { icon: Shield, title: 'Secure', desc: 'Protected' },
                  { icon: RefreshCw, title: '30-Day', desc: 'Returns' },
                ].map((feature, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                    <feature.icon className="w-5 h-5 text-[#ff6b35] mx-auto mb-2" />
                    <p className="text-white font-bold text-xs">{feature.title}</p>
                    <p className="text-gray-500 text-xs">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Info */}
            <div className="space-y-6">
              {/* Artist */}
              <Link href={`/artist/${product.artist_id}`}>
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-3xl border group hover:scale-105 transition-all cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,49,49,0.05))',
                    borderColor: 'rgba(255,107,53,0.2)',
                  }}
                >
                  <User className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">{product.artist_profiles.display_name}</span>
                  {product.artist_profiles.is_verified && <Check className="w-3 h-3 text-[#00d9ff]" />}
                </div>
              </Link>

              {/* Title */}
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
                  {product.name}
                </h1>
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

              {/* Description */}
              <p className="text-gray-300 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div 
                className="p-5 rounded-xl backdrop-blur-3xl border"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,53,0.05), transparent)',
                  borderColor: 'rgba(255,107,53,0.2)',
                }}
              >
                <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Price</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-white">₹{product.selling_price}</p>
                  <span className="text-gray-500">INR</span>
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-3 text-sm">
                  <Package className="w-4 h-4 text-[#ff6b35]" />
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
                  <Award className="w-4 h-4 text-[#ff6b35]" />
                  Select Color
                </label>
                <div className="flex gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-12 h-12 rounded-full transition-all ${
                        selectedColor === color.name ? 'ring-4 ring-[#ff6b35] scale-110' : 'ring-2 ring-white/20'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor === color.name && (
                        <Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="flex items-center gap-2 text-white font-bold mb-3 text-sm">
                  <Sparkles className="w-4 h-4 text-[#ff6b35]" />
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold hover:bg-white/10 transition"
                  >
                    -
                  </button>
                  <span className="text-2xl font-black text-white w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold hover:bg-white/10 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="group relative overflow-hidden w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] shadow-2xl flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                  boxShadow: '0 20px 60px rgba(255,107,53,0.4)'
                }}
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
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
