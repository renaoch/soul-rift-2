"use client";

import { X, Sparkles, DollarSign, Gem, Crown, Zap, Circle, Type, Repeat, Pen, Flame } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const priceRanges = [
  { key: 'budget', label: 'Budget', range: 'Under ₹500', color: '#39ff14', icon: DollarSign },
  { key: 'standard', label: 'Standard', range: '₹500 - ₹1000', color: '#00d9ff', icon: Gem },
  { key: 'premium', label: 'Premium', range: '₹1000 - ₹2000', color: '#ff6b35', icon: Crown },
  { key: 'luxury', label: 'Luxury', range: 'Over ₹2000', color: '#ff3131', icon: Sparkles },
];

const styles = [
  { key: 'street', name: 'Street Art', icon: Flame, color: '#ff6b35' },
  { key: 'minimal', name: 'Minimal', icon: Circle, color: '#ffffff' },
  { key: 'type', name: 'Typography', icon: Type, color: '#00d9ff' },
  { key: 'abstract', name: 'Abstract', icon: Repeat, color: '#ff3131' },
  { key: 'illustration', name: 'Illustration', icon: Pen, color: '#39ff14' },
  { key: 'pop', name: 'Pop Art', icon: Zap, color: '#ff6b35' },
];

const colors = [
  { key: 'black', name: 'Black', hex: '#000000' },
  { key: 'white', name: 'White', hex: '#ffffff' },
  { key: 'red', name: 'Red', hex: '#ff3131' },
  { key: 'blue', name: 'Blue', hex: '#00d9ff' },
  { key: 'green', name: 'Green', hex: '#39ff14' },
  { key: 'yellow', name: 'Yellow', hex: '#ffd700' },
  { key: 'purple', name: 'Purple', hex: '#a855f7' },
  { key: 'pink', name: 'Pink', hex: '#ff69b4' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function FilterSidebar() {
  const router = useRouter();
  const params = useSearchParams();

  const [price, setPrice] = useState<string | null>(params.get('price'));
  const [styleKeys, setStyleKeys] = useState<string[]>(params.get('styles')?.split(',').filter(Boolean) || []);
  const [colorKeys, setColorKeys] = useState<string[]>(params.get('colors')?.split(',').filter(Boolean) || []);
  const [sizeKeys, setSizeKeys] = useState<string[]>(params.get('sizes')?.split(',').filter(Boolean) || []);

  useEffect(() => {
    // keep state in sync if URL changes externally
    setPrice(params.get('price'));
    setStyleKeys(params.get('styles')?.split(',').filter(Boolean) || []);
    setColorKeys(params.get('colors')?.split(',').filter(Boolean) || []);
    setSizeKeys(params.get('sizes')?.split(',').filter(Boolean) || []);
  }, [params]);

  const hasFilters = !!price || styleKeys.length || colorKeys.length || sizeKeys.length;

  const toggleKey = (list: string[], key: string, setter: (v: string[]) => void) => {
    setter(list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);
  };

  const apply = () => {
    const current = new URLSearchParams(params.toString());
    if (price) current.set('price', price); else current.delete('price');
    styleKeys.length ? current.set('styles', styleKeys.join(',')) : current.delete('styles');
    colorKeys.length ? current.set('colors', colorKeys.join(',')) : current.delete('colors');
    sizeKeys.length ? current.set('sizes', sizeKeys.join(',')) : current.delete('sizes');
    current.delete('page');
    router.replace(`/products?${current.toString()}`);
  };

  const clearAll = () => {
    setPrice(null);
    setStyleKeys([]);
    setColorKeys([]);
    setSizeKeys([]);
    const current = new URLSearchParams(params.toString());
    ['price', 'styles', 'colors', 'sizes', 'page'].forEach((k) => current.delete(k));
    router.replace(`/products?${current.toString()}`);
  };

  return (
    <aside className="w-80 hidden md:block flex-shrink-0 sticky top-28 h-fit">
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff6b35]" />
              <h3 className="text-lg font-black text-white">Filters</h3>
            </div>
            {hasFilters && (
              <button onClick={clearAll} className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20">
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Find your perfect design</p>
        </div>

        <div className="p-5 space-y-6">
          {/* Price */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Price</h4>
            <div className="grid grid-cols-2 gap-3">
              {priceRanges.map((p) => {
                const Icon = p.icon;
                const active = price === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPrice(active ? null : p.key)}
                    className={`group p-4 rounded-xl border transition-all ${active ? 'border-white/40 bg-white/10 scale-[1.02]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    <div className="w-9 h-9 mb-2 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${p.color}20` }}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-[11px] font-bold text-white mb-0.5">{p.label}</p>
                    <p className="text-[10px] text-gray-500">{p.range}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Style</h4>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => {
                const Icon = s.icon;
                const active = styleKeys.includes(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleKey(styleKeys, s.key, setStyleKeys)}
                    className={`px-4 py-2.5 rounded-full border transition-all flex items-center gap-2 ${active ? 'border-white/40 bg-white/20 scale-[1.02]' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-xs font-bold text-white">{s.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Color</h4>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((c) => {
                const active = colorKeys.includes(c.key);
                return (
                  <button
                    key={c.key}
                    onClick={() => toggleKey(colorKeys, c.key, setColorKeys)}
                    className={`relative aspect-square rounded-xl border-2 transition-all hover:scale-110 ${active ? 'border-white scale-110' : 'border-white/20'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {active && <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-white shadow-lg" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Size</h4>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((sz) => {
                const active = sizeKeys.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleKey(sizeKeys, sz, setSizeKeys)}
                    className={`py-2.5 rounded-xl border font-bold text-xs transition-all ${active ? 'border-white/40 bg-gradient-to-br from-[#ff6b35] to-[#ff3131] text-white scale-[1.02]' : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-white/10 bg-gradient-to-br from-transparent to-white/5">
          <button onClick={apply} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff3131] text-white font-bold hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Apply Filters
            {hasFilters && <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-[10px]">{styleKeys.length + colorKeys.length + sizeKeys.length + (price ? 1 : 0)}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
