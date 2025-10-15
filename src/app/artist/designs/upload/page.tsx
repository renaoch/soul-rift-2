"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductsNav from '@/components/layout/ProductsNav';
import { 
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  FileImage,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface DesignFormData {
  title: string;
  description: string;
  category_id: string;
  tags: string[];
  allow_commercial_use: boolean;
}

const DESIGN_CATEGORIES = [
  { id: '1', name: 'Abstract', slug: 'abstract' },
  { id: '2', name: 'Typography', slug: 'typography' },
  { id: '3', name: 'Illustration', slug: 'illustration' },
  { id: '4', name: 'Nature', slug: 'nature' },
  { id: '5', name: 'Pop Culture', slug: 'pop-culture' },
  { id: '6', name: 'Minimalist', slug: 'minimalist' },
  { id: '7', name: 'Vintage', slug: 'vintage' },
  { id: '8', name: 'Geometric', slug: 'geometric' },
];

export default function DesignUploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<DesignFormData>({
    title: '',
    description: '',
    category_id: '',
    tags: [],
    allow_commercial_use: true,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (formData.tags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
      return;
    }
    if (formData.tags.includes(tagInput.trim())) {
      toast.error('Tag already added');
      return;
    }

    setFormData({
      ...formData,
      tags: [...formData.tags, tagInput.trim()],
    });
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a design file');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category_id', formData.category_id);
      uploadFormData.append('tags', JSON.stringify(formData.tags));
      uploadFormData.append('allow_commercial_use', String(formData.allow_commercial_use));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/artist/designs/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        toast.success('Design uploaded successfully!', {
          description: 'Your design is pending approval.',
        });
        
        setTimeout(() => {
          router.push('/artist/dashboard');
        }, 1500);
      } else {
        toast.error(result.error?.message || 'Upload failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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

        <div className="max-w-5xl mx-auto px-8 relative z-10">
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
                Upload Design
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
                  Share Your Art
                </span>
              ))}
              
              <span 
                className="relative text-white"
                style={{
                  filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                }}
              >
                Share Your Art
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed font-light max-w-2xl">
              Upload your design and start earning. Files will be reviewed within 24-48 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* File Upload */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Upload className="w-6 h-6 text-[#ff6b35]" />
                Design File
              </h2>

              {!selectedFile ? (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div 
                    className="border-2 border-dashed rounded-2xl p-12 text-center hover:bg-white/5 transition-all"
                    style={{ borderColor: '#ff6b3540' }}
                  >
                    <div 
                      className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, #ff6b3520, #ff313110)',
                      }}
                    >
                      <FileImage className="w-10 h-10 text-[#ff6b35]" />
                    </div>
                    <p className="text-white font-bold text-lg mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-400 text-sm">
                      PNG, JPG or SVG (Max 10MB)
                    </p>
                  </div>
                </label>
              ) : (
                <div className="relative">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative">
                    <Image
                      src={previewUrl!}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/40 flex items-center justify-center hover:bg-red-500/30 transition"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">Uploading...</span>
                    <span className="text-sm text-gray-400">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/40 overflow-hidden">
                    <div 
                      className="h-full transition-all duration-300"
                      style={{ 
                        width: `${uploadProgress}%`,
                        background: 'linear-gradient(90deg, #ff6b35, #ff3131)'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Design Details */}
            <div 
              className="rounded-3xl backdrop-blur-3xl border p-8 shadow-2xl space-y-6"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#ff6b35]" />
                Design Details
              </h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                  placeholder="Give your design a catchy title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all resize-none"
                  placeholder="Describe your design, inspiration, or story behind it..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                >
                  <option value="">Select a category</option>
                  {DESIGN_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">
                  Tags (Max 10)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-5 py-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    placeholder="Type a tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 rounded-2xl bg-[#ff6b35] text-white font-bold hover:bg-[#ff5525] transition"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-400 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Commercial Use */}
              <div 
                className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-4"
              >
                <input
                  type="checkbox"
                  id="commercial"
                  checked={formData.allow_commercial_use}
                  onChange={(e) => setFormData({ ...formData, allow_commercial_use: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-black/40 checked:bg-[#ff6b35]"
                />
                <label htmlFor="commercial" className="flex-1">
                  <p className="text-white font-bold mb-1">Allow Commercial Use</p>
                  <p className="text-sm text-gray-400">
                    Your design can be used on products sold through Soul Rift. You'll earn 30% commission on all sales.
                  </p>
                </label>
              </div>
            </div>

            {/* Info Banner */}
            <div 
              className="p-6 rounded-2xl border flex items-start gap-4"
              style={{
                background: 'linear-gradient(135deg, #00d9ff08, transparent)',
                borderColor: '#00d9ff20',
              }}
            >
              <Info className="w-6 h-6 text-[#00d9ff] flex-shrink-0 mt-1" />
              <div>
                <p className="text-white font-bold mb-2">Review Process</p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  All designs are reviewed by our team to ensure quality and compliance. 
                  You'll receive a notification once your design is approved (usually within 24-48 hours).
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="group relative overflow-hidden w-full py-5 rounded-2xl font-bold text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg, #ff6b35, #ff3131)',
                boxShadow: '0 20px 60px #ff6b3550'
              }}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Design
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
