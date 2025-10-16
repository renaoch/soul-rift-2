"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  Heart,
  ShoppingCart,
  Trash2,
  Sparkles,
  FileImage,
  Calendar,
  User,
  Package,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Design {
  id: string;
  title: string;
  description: string;
  design_code: string;
  design_url: string;
  thumbnail_url: string;
  is_approved: boolean;
  is_public: boolean;
  view_count: number;
  like_count: number;
  use_count: number;
  file_size_kb: number;
  tags: string[];
  created_at: string;
  artist_profiles: {
    id: string;
    display_name: string;
    is_verified: boolean;
  };
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function AdminDesignsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [designToReject, setDesignToReject] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, [statusFilter]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/designs?status=${statusFilter}${searchQuery ? `&search=${searchQuery}` : ''}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setDesigns(result.designs);
        setStats(result.stats);
      } else {
        if (result.error?.message.includes('Unauthorized')) {
          toast.error('Access denied - Admin only');
          router.push('/');
        } else {
          toast.error('Failed to load designs');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (designId: string) => {
    try {
      const response = await fetch('/api/admin/designs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId, action: 'approve' }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Design approved successfully');
        fetchDesigns();
        setSelectedDesign(null);
      } else {
        toast.error('Failed to approve design');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const openRejectModal = (designId: string) => {
    setDesignToReject(designId);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!designToReject) return;

    try {
      const response = await fetch('/api/admin/designs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          designId: designToReject, 
          action: 'reject', 
          reason: rejectReason 
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Design rejected');
        fetchDesigns();
        setSelectedDesign(null);
        setShowRejectModal(false);
        setDesignToReject(null);
        setRejectReason('');
      } else {
        toast.error('Failed to reject design');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (designId: string) => {
    if (!confirm('Are you sure you want to permanently delete this design?')) return;

    try {
      const response = await fetch(`/api/admin/designs?id=${designId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Design deleted successfully');
        fetchDesigns();
        setSelectedDesign(null);
      } else {
        toast.error('Failed to delete design');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleSearch = () => {
    fetchDesigns();
  };

  const getStatusBadge = (design: Design) => {
    if (design.is_approved) {
      return (
        <div className="px-3 py-1.5 rounded-full bg-green-500/20 backdrop-blur-xl border border-green-500/40 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-green-400" />
          <span className="text-xs font-bold text-green-400">Approved</span>
        </div>
      );
    } else if (!design.is_public) {
      return (
        <div className="px-3 py-1.5 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/40 flex items-center gap-1">
          <XCircle className="w-3 h-3 text-red-400" />
          <span className="text-xs font-bold text-red-400">Rejected</span>
        </div>
      );
    } else {
      return (
        <div className="px-3 py-1.5 rounded-full bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/40 flex items-center gap-1">
          <Clock className="w-3 h-3 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">Pending</span>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <>
        <ProductsNav />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-xl">Loading designs...</p>
          </div>
        </div>
      </>
    );
  }

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
        </div>

        {/* Glows */}
        <div className="absolute top-40 left-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#ff6b35]" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full blur-[150px] opacity-20 bg-[#00d9ff]" />

        <div className="max-w-[1800px] mx-auto px-8 relative z-10">
          {/* Header */}
          <div className="mb-12">
            <div 
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl backdrop-blur-3xl border shadow-2xl mb-8 group hover:scale-105 transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #ff6b3515, #ff313110)',
                borderColor: '#ff6b3530',
                boxShadow: '0 20px 60px #ff6b3520'
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-[#ff6b35]" />
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                Design Management
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

            <h1 className="text-[clamp(3rem,6vw,5rem)] font-black leading-[0.85] tracking-tighter relative mb-6">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="absolute inset-0"
                  style={{
                    color: '#ff6b35',
                    opacity: 0.15 - (i * 0.02),
                    transform: `translate(${i * 3}px, ${i * 3}px)`,
                    zIndex: -i
                  }}
                >
                  Review Designs
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Review Designs
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Approve, reject, or delete artist designs
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <FileImage className="w-8 h-8 text-[#ff6b35] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.total || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Total</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #39ff1408, transparent)',
                borderColor: '#39ff1420',
              }}
            >
              <CheckCircle2 className="w-8 h-8 text-[#39ff14] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.approved || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Approved</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <Clock className="w-8 h-8 text-[#00d9ff] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.pending || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Pending</p>
            </div>

            <div 
              className="rounded-2xl backdrop-blur-3xl border p-6 shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #ff313108, transparent)',
                borderColor: '#ff313120',
              }}
            >
              <XCircle className="w-8 h-8 text-[#ff3131] mb-3" />
              <p className="text-4xl font-black text-white mb-1">{stats?.rejected || 0}</p>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Rejected</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by title or code..."
                className="w-full pl-14 pr-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-4 rounded-2xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525] transition"
            >
              Search
            </button>

            <div className="flex gap-2">
              {['pending', 'approved', 'rejected', 'all'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all ${
                    statusFilter === status
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-black/40 text-gray-400 hover:bg-white/5'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Designs Grid */}
          {designs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="rounded-2xl backdrop-blur-3xl border overflow-hidden shadow-xl hover:scale-[1.02] transition-all group cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                    borderColor: '#ff6b3520',
                  }}
                  onClick={() => setSelectedDesign(design)}
                >
                  {/* Image */}
                  <div className="relative aspect-square bg-black/40">
                    <Image
                      src={design.design_url}
                      alt={design.title}
                      fill
                      className="object-contain p-4"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(design)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="text-white font-bold mb-2 line-clamp-1">{design.title}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {design.artist_profiles?.display_name}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {design.view_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {design.like_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        {design.use_count}
                      </span>
                    </div>

                    {/* Actions */}
                    {!design.is_approved && design.is_public && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(design.id);
                          }}
                          className="flex-1 py-2 rounded-xl bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold hover:bg-green-500/30 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openRejectModal(design.id);
                          }}
                          className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold hover:bg-red-500/30 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FileImage className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">No designs found</h3>
              <p className="text-gray-400">
                {searchQuery ? 'Try a different search term' : `No ${statusFilter} designs at the moment`}
              </p>
            </div>
          )}
        </div>

        {/* Design Detail Modal */}
        {selectedDesign && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setSelectedDesign(null)}
          >
            <div 
              className="max-w-4xl w-full rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/40">
                  <Image
                    src={selectedDesign.design_url}
                    alt={selectedDesign.title}
                    fill
                    className="object-contain p-8"
                  />
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2">{selectedDesign.title}</h2>
                      <p className="text-gray-400 text-sm">Code: {selectedDesign.design_code}</p>
                    </div>
                    {getStatusBadge(selectedDesign)}
                  </div>

                  {selectedDesign.description && (
                    <p className="text-gray-300 mb-6">{selectedDesign.description}</p>
                  )}

                  {/* Artist Info */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-6">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Artist</p>
                    <p className="text-white font-bold flex items-center gap-2">
                      {selectedDesign.artist_profiles?.display_name}
                      {selectedDesign.artist_profiles?.is_verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                      <Eye className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-2xl font-black text-white">{selectedDesign.view_count}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                      <Heart className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-2xl font-black text-white">{selectedDesign.like_count}</p>
                      <p className="text-xs text-gray-500">Likes</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center">
                      <ShoppingCart className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                      <p className="text-2xl font-black text-white">{selectedDesign.use_count}</p>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Uploaded: {new Date(selectedDesign.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Package className="w-4 h-4" />
                      <span>Size: {selectedDesign.file_size_kb} KB</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedDesign.tags && selectedDesign.tags.length > 0 && (
                    <div className="mb-6">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDesign.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    {!selectedDesign.is_approved && selectedDesign.is_public && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedDesign.id)}
                          className="w-full py-4 rounded-2xl bg-green-500/20 border border-green-500/40 text-green-400 font-bold hover:bg-green-500/30 transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Approve Design
                        </button>
                        <button
                          onClick={() => openRejectModal(selectedDesign.id)}
                          className="w-full py-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Reject Design
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(selectedDesign.id)}
                      className="w-full py-4 rounded-2xl bg-black/40 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/10 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Permanently
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-8"
            onClick={() => setShowRejectModal(false)}
          >
            <div 
              className="max-w-lg w-full rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff313108, transparent)',
                borderColor: '#ff313120',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Reject Design</h2>
                  <p className="text-gray-400 text-sm">Provide a reason for rejection (optional)</p>
                </div>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  placeholder="E.g., Poor image quality, copyright issues, inappropriate content..."
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 py-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 font-bold hover:bg-red-500/30 transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Design
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
