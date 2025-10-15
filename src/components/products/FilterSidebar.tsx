"use client";

import { X, Sparkles, DollarSign, Gem, Crown, Zap, Circle, Type, Repeat, Pen, Flame } from 'lucide-react';
import { useState } from 'react';

const priceRanges = [
  { label: 'Budget', range: 'Under $50', color: '#39ff14', icon: DollarSign },
  { label: 'Standard', range: '$50 - $100', color: '#00d9ff', icon: Gem },
  { label: 'Premium', range: '$100 - $200', color: '#ff6b35', icon: Crown },
  { label: 'Luxury', range: 'Over $200', color: '#ff3131', icon: Sparkles },
];

const styles = [
  { name: 'Street Art', icon: Flame, color: '#ff6b35' },
  { name: 'Minimal', icon: Circle, color: '#ffffff' },
  { name: 'Typography', icon: Type, color: '#00d9ff' },
  { name: 'Abstract', icon: Repeat, color: '#ff3131' },
  { name: 'Illustration', icon: Pen, color: '#39ff14' },
  { name: 'Pop Art', icon: Zap, color: '#ff6b35' },
];

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Red', hex: '#ff3131' },
  { name: 'Blue', hex: '#00d9ff' },
  { name: 'Green', hex: '#39ff14' },
  { name: 'Yellow', hex: '#ffd700' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ff69b4' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar() {
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const clearAll = () => {
    setSelectedPrice(null);
    setSelectedStyles([]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  const hasFilters = selectedPrice || selectedStyles.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0;

  return (
    <aside className="w-80 flex-shrink-0 sticky top-32 h-fit">
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff6b35]" />
              <h3 className="text-xl font-black text-white">Filters</h3>
            </div>
            {hasFilters && (
              <button 
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">Find your perfect design</p>
        </div>

        <div className="p-6 space-y-8">
          {/* Price Range - Card Style with Icons */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Price Range</h4>
            <div className="grid grid-cols-2 gap-3">
              {priceRanges.map((price) => (
                <button
                  key={price.range}
                  onClick={() => setSelectedPrice(price.range === selectedPrice ? null : price.range)}
                  className={`group p-4 rounded-xl border transition-all ${
                    selectedPrice === price.range
                      ? 'border-white/40 bg-white/10 scale-105'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-10 h-10 mb-3 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${price.color}20` }}
                  >
                    <price.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-white mb-1">{price.label}</p>
                  <p className="text-[10px] text-gray-500">{price.range}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Style - Pill Buttons with Icons */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Style</h4>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => toggleStyle(style.name)}
                  className={`group px-4 py-2.5 rounded-full border transition-all flex items-center gap-2 ${
                    selectedStyles.includes(style.name)
                      ? 'border-white/40 bg-white/20 scale-105'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <style.icon className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colors - Color Swatches */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Color</h4>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  className={`group relative aspect-square rounded-xl border-2 transition-all hover:scale-110 ${
                    selectedColors.includes(color.name)
                      ? 'border-white scale-110'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {selectedColors.includes(color.name) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white shadow-lg" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes - Toggle Buttons */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`py-3 rounded-xl border font-bold transition-all ${
                    selectedSizes.includes(size)
                      ? 'border-white/40 bg-gradient-to-br from-[#ff6b35] to-[#ff3131] text-white scale-105 shadow-lg'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="p-6 border-t border-white/10 bg-gradient-to-br from-transparent to-white/5">
          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3131] text-white font-bold hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Apply Filters
            {hasFilters && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {(selectedStyles.length + selectedColors.length + selectedSizes.length + (selectedPrice ? 1 : 0))}
              </span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
