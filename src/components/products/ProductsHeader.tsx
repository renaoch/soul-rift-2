"use client";

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductsHeader() {
  const router = useRouter();
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounce search typing
  const [debounced, setDebounced] = useState(searchQuery);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchQuery), 350);
    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const current = new URLSearchParams(params.toString());
    if (debounced) current.set('q', debounced);
    else current.delete('q');
    current.delete('page'); // reset pagination on new search
    router.replace(`/products?${current.toString()}`);
  }, [debounced]);

  const clearSearch = () => setSearchQuery('');

  return (
    <div className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-4">
        <div className="flex items-center gap-3 md:gap-4 pt-16 md:pt-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setDebounced(searchQuery)}
              placeholder="Search designs, artists, or SKUs..."
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/40 text-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Sort */}
          <SortSelect />

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Mobile Drawer placeholder (optional future) */}
      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-11/12 max-w-sm bg-black border-l border-white/10 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded hover:bg-white/10">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            {/* You can render FilterSidebar here for true mobile drawer UX */}
            <p className="text-gray-500 text-sm">Mobile filters coming soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get('sort') || 'popular';

  const change = (value: string) => {
    const current = new URLSearchParams(params.toString());
    current.set('sort', value);
    current.delete('page');
    router.replace(`/products?${current.toString()}`);
  };

  return (
    <select
      value={sort}
      onChange={(e) => change(e.target.value)}
      className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/30"
    >
      <option value="popular">Sort: Popular</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="newest">Newest First</option>
    </select>
  );
}
