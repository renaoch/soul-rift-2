"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  base_price: number;
  selling_price: number;
  profit_margin: number;
  sku: string;
  size: string;
  color: string;
  material: string;
  product_type: string;
  is_active: boolean;
  stock_status: string;
  image_url: string;
  images: string[];
  view_count: number;
  like_count: number;
  purchase_count: number;
  style: string;
  is_trending: boolean;
  is_new: boolean;
  badge: string;
  created_at: string;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    selling_price: '',
    sku: '',
    size: '',
    color: '',
    material: '',
    product_type: 't-shirt',
    is_active: true,
    stock_status: 'in_stock',
    image_url: '',
    style: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/products?status=${statusFilter}${searchQuery ? `&search=${searchQuery}` : ''}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setProducts(result.products);
        setStats(result.stats);
      } else {
        if (result.error?.message.includes('Unauthorized')) {
          toast.error('Access denied - Admin only');
          router.push('/');
        } else {
          toast.error('Failed to load products');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('product_type', formData.product_type);

      const response = await fetch('/api/admin/products/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ ...formData, image_url: result.url });
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(result.error?.message || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      base_price: '',
      selling_price: '',
      sku: '',
      size: '',
      color: '',
      material: '',
      product_type: 't-shirt',
      is_active: true,
      stock_status: 'in_stock',
      image_url: '',
      style: '',
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      base_price: product.base_price.toString(),
      selling_price: product.selling_price.toString(),
      sku: product.sku,
      size: product.size,
      color: product.color,
      material: product.material,
      product_type: product.product_type,
      is_active: product.is_active,
      stock_status: product.stock_status,
      image_url: product.image_url,
      style: product.style,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/admin/products';
      const method = editingProduct ? 'PATCH' : 'POST';
      
      const payload = editingProduct
        ? { productId: editingProduct.id, ...formData, base_price: Number(formData.base_price), selling_price: Number(formData.selling_price) }
        : { ...formData, base_price: Number(formData.base_price), selling_price: Number(formData.selling_price) };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!');
        fetchProducts();
        setShowModal(false);
      } else {
        toast.error(result.error?.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

const openDeleteModal = (product: Product) => {
  setProductToDelete(product);
  setShowDeleteModal(true);
};

const handleDelete = async () => {
  if (!productToDelete) return;

  try {
    const response = await fetch(`/api/admin/products?id=${productToDelete.id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      toast.success('Product deleted');
      fetchProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } else {
      toast.error('Failed to delete');
    }
  } catch (error) {
    toast.error('Something went wrong');
  }
};
  const handleSearch = () => {
    fetchProducts();
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProductsNav />
      
      <main className="relative w-full bg-black min-h-screen pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="absolute top-32 left-16 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#ff6b35]" />
        <div className="absolute bottom-32 right-16 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#00d9ff]" />

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-2xl border shadow-xl mb-6 hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff6b3515, #ff313110)',
                borderColor: '#ff6b3530',
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse bg-[#ff6b35]" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">Products</span>
              <Sparkles className="w-3 h-3 text-white opacity-60" />
            </div>

            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-5xl font-black text-white mb-3">Product Catalog</h1>
                <p className="text-base text-gray-400">Manage your product inventory</p>
              </div>

              <button 
                onClick={openCreateModal}
                className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 shadow-xl flex items-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                }}
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Package, label: 'Total', value: stats?.total || 0, color: '#ff6b35' },
              { icon: CheckCircle2, label: 'Active', value: stats?.active || 0, color: '#39ff14' },
              { icon: XCircle, label: 'Inactive', value: stats?.inactive || 0, color: '#ff3131' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="rounded-xl backdrop-blur-2xl border p-4 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}08, transparent)`,
                  borderColor: `${stat.color}20`,
                }}
              >
                <stat.icon className="w-6 h-6 mb-2" style={{ color: stat.color }} />
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50"
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-5 py-3 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#ff5525] transition"
            >
              Search
            </button>

            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition ${
                  statusFilter === status
                    ? 'bg-[#ff6b35] text-white'
                    : 'bg-black/40 text-gray-400 hover:bg-white/5'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-xl border overflow-hidden shadow-lg hover:scale-105 transition-all group"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                    borderColor: '#ff6b3520',
                  }}
                >
                  <div className="relative aspect-square bg-black/40">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-16 h-16 text-gray-600" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      {product.is_active ? (
                        <div className="px-2 py-1 rounded-full bg-green-500/20 border border-green-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-green-400" />
                          <span className="text-[10px] font-bold text-green-400">Active</span>
                        </div>
                      ) : (
                        <div className="px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40 flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5 text-red-400" />
                          <span className="text-[10px] font-bold text-red-400">Inactive</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center hover:bg-blue-500/30"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                    <button
  onClick={() => openDeleteModal(product)}
  className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center hover:bg-red-500/30"
>
  <Trash2 className="w-4 h-4 text-red-400" />
</button>

                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-[10px] text-gray-500 mb-2 font-mono">SKU: {product.sku}</p>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-black text-white">₹{product.selling_price}</span>
                      <span className="text-xs text-gray-500 line-through">₹{product.base_price}</span>
                    </div>

                    <div className="space-y-0.5 text-[10px] text-gray-400">
                      <p>Size: {product.size || 'N/A'}</p>
                      <p>Color: {product.color || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-6">
                {searchQuery ? 'Try different search' : 'Add your first product'}
              </p>
              <button
                onClick={openCreateModal}
                className="px-6 py-3 rounded-xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525]"
              >
                Add Product
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-6 overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="max-w-xl w-full rounded-2xl border p-6 shadow-2xl my-6"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <p className="text-gray-400 text-xs">Fill in the details</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                    Product Image
                  </label>
                  <div className="flex items-center gap-3">
                    {formData.image_url && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                        <Image src={formData.image_url} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 hover:bg-white/5 transition">
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 text-[#ff6b35] animate-spin" />
                            <span className="text-sm text-[#ff6b35] font-bold">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {formData.image_url ? 'Change Image' : 'Upload Image'}
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="T-Shirt"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">SKU *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="TSH-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 resize-none"
                    placeholder="Description..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Base Price *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="299"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Selling Price *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="499"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Size</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="M, L"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="Black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Material</label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                      placeholder="Cotton"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Type</label>
                    <select
                      value={formData.product_type}
                      onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                    >
                      <option value="t-shirt">T-Shirt</option>
                      <option value="hoodie">Hoodie</option>
                      <option value="mug">Mug</option>
                      <option value="poster">Poster</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Stock</label>
                    <select
                      value={formData.stock_status}
                      onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50"
                    >
                      <option value="in_stock">In Stock</option>
                      <option value="low_stock">Low Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <label htmlFor="is_active" className="text-white text-sm font-bold">
                    Active Product
                  </label>
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#ff5525]"
                  >
                    {editingProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
{showDeleteModal && productToDelete && (
  <div 
    className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
    onClick={() => setShowDeleteModal(false)}
  >
    <div 
      className="max-w-md w-full rounded-2xl border p-6 shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #ff313108, transparent)',
        borderColor: '#ff313120',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Delete Product</h3>
            <p className="text-sm text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteModal(false)}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/10">
        <div className="flex items-center gap-3">
          {productToDelete.image_url && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
              <Image
                src={productToDelete.image_url}
                alt={productToDelete.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-white font-bold">{productToDelete.name}</p>
            <p className="text-xs text-gray-500 font-mono">SKU: {productToDelete.sku}</p>
            <p className="text-sm text-gray-400 mt-1">₹{productToDelete.selling_price}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500/30 transition flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Product
        </button>
      </div>
    </div>
  </div>
)}

      </main>
    </>
  );
}
