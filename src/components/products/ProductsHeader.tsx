"use client";

import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function ProductsHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-[1800px] mx-auto  px-8 py-6">
        <div className="flex items-center  mt-20 gap-4">
          {/* Search Bar */}
         

        
        </div>
      </div>
    </div>
  );
}
