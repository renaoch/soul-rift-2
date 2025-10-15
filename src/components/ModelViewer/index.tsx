"use client";

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import Model from './Model';
import { products } from '@/app/lib/product';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import ProgressBar from '@/components/ProgressBar';
import { 
  Sparkles,
  Star,
  ArrowUpRight,
  Layers,
  MousePointerClick
} from 'lucide-react';

export default function ModelViewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotationComplete, setRotationComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentProduct = products[currentIndex];

  // Auto-rotation cycle
  useEffect(() => {
    if (rotationComplete && !isPaused) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setRotationComplete(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [rotationComplete, isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setRotationComplete(false);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setRotationComplete(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Minimal Grid Pattern Only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${currentProduct.theme.primary} 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Top Bar */}
      <TopBar product={currentProduct} />

      {/* Main Split Layout */}
      <div className="h-full flex">
        {/* Left Panel - Product Info */}
        <div className="w-[42%] h-full flex items-center justify-end pl-16 pr-12 z-20">
          <div className="max-w-xl w-full space-y-10">
            
            {/* Floating Collection Badge */}
            <div 
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl backdrop-blur-3xl border shadow-2xl group hover:scale-105 transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${currentProduct.theme.primary}15, ${currentProduct.theme.accent}10)`,
                borderColor: `${currentProduct.theme.primary}30`,
                boxShadow: `0 20px 60px ${currentProduct.theme.primary}20`
              }}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentProduct.theme.primary }}
              />
              <span className="text-sm font-bold tracking-widest text-white uppercase">
                {currentProduct.collection}
              </span>
              <Sparkles className="w-4 h-4 text-white opacity-60" />
            </div>

            {/* Product Name - 3D Depth Typography */}
            <div className="space-y-5 relative">
              <h1 className="text-[clamp(4rem,8vw,6.5rem)] font-black leading-[0.85] tracking-tighter relative">
                {/* Multiple shadow layers for 3D depth */}
                {[...Array(8)].map((_, i) => (
                  <span
                    key={i}
                    className="absolute inset-0"
                    style={{
                      color: currentProduct.theme.primary,
                      opacity: 0.15 - (i * 0.02),
                      transform: `translate(${i * 3}px, ${i * 3}px)`,
                      zIndex: -i
                    }}
                  >
                    {currentProduct.name}
                  </span>
                ))}
                
                {/* Main text */}
                <span 
                  className="relative text-white"
                  style={{
                    filter: 'drop-shadow(0 2px 70px rgba(0,0,0,0.5))'
                  }}
                >
                  {currentProduct.name}
                </span>
              </h1>
              
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-2xl font-bold text-gray-300 tracking-wide uppercase">
                  {currentProduct.color}
                </p>
                
                <div 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-2xl border transition-transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${currentProduct.theme.primary}20, ${currentProduct.theme.accent}10)`,
                    borderColor: `${currentProduct.theme.primary}40`,
                    boxShadow: `0 8px 32px ${currentProduct.theme.primary}30`
                  }}
                >
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-black text-white">{currentProduct.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-1">★★★★★</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 leading-relaxed font-light">
              {currentProduct.description}
            </p>

            {/* Price & CTA Section */}
            <div 
              className="p-8 rounded-3xl backdrop-blur-3xl border space-y-6 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentProduct.theme.primary}08, transparent)`,
                borderColor: `${currentProduct.theme.primary}20`,
              }}
            >
              {/* Price Display */}
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-xs tracking-[0.3em] text-gray-500 mb-3 uppercase font-bold">From</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-6xl font-black text-white">${currentProduct.price}</p>
                    <span className="text-gray-500 text-lg mb-1">USD</span>
                  </div>
                </div>
                <div 
                  className="w-16 h-16 rounded-2xl backdrop-blur-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${currentProduct.theme.primary}30, ${currentProduct.theme.accent}20)`,
                    boxShadow: `0 10px 40px ${currentProduct.theme.primary}30`
                  }}
                >
                  <Layers className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button 
                  className="col-span-2 group relative overflow-hidden py-5 rounded-2xl font-bold text-white text-lg transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${currentProduct.theme.primary}, ${currentProduct.theme.accent})`,
                    boxShadow: `0 20px 60px ${currentProduct.theme.primary}50`
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Explore Collection
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${currentProduct.theme.accent}, ${currentProduct.theme.primary})`,
                    }}
                  />
                </button>

                <button 
                  className="py-4 rounded-2xl font-bold text-white backdrop-blur-xl border transition-all duration-300 hover:bg-white/10"
                  style={{ borderColor: `${currentProduct.theme.primary}40` }}
                >
                  Try AR
                </button>
                
                <button 
                  className="py-4 rounded-2xl font-bold text-white backdrop-blur-xl border transition-all duration-300 hover:bg-white/10"
                  style={{ borderColor: `${currentProduct.theme.primary}40` }}
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - 3D Model with Glow Behind */}
        <div className="w-[58%] h-full relative">
          {/* PRIMARY GLOW - Behind the model */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[150px] opacity-50 transition-all duration-1000 animate-pulse z-0"
            style={{ 
              backgroundColor: currentProduct.theme.primary,
              boxShadow: `0 0 200px 100px ${currentProduct.theme.primary}`,
            }}
          />
          
          {/* SECONDARY GLOW - Accent color */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 transition-all duration-1000 z-0"
            style={{ 
              backgroundColor: currentProduct.theme.accent,
              animation: 'pulse 3s ease-in-out infinite',
              animationDelay: '0.5s'
            }}
          />

          {/* Canvas Container */}
          <div 
            className="absolute inset-0 rounded-l-[3rem] overflow-hidden z-10"
            style={{
              boxShadow: `inset 0 0 100px ${currentProduct.theme.primary}20`
            }}
          >
            <Canvas camera={{ position: [0, 0, 7], fov: 50 }} shadows>
              <ambientLight intensity={0.6} />
              <spotLight position={[15, 15, 15]} angle={0.3} penumbra={1} intensity={2} castShadow />
              <spotLight position={[-15, -10, -15]} angle={0.3} penumbra={1} intensity={0.8} />
              
              {/* Enhanced colored lights around the model */}
              <pointLight position={[0, 8, 8]} intensity={2} color={currentProduct.theme.primary} />
              <pointLight position={[0, -5, 5]} intensity={1.5} color={currentProduct.theme.accent} />
              <pointLight position={[5, 0, 3]} intensity={1} color={currentProduct.theme.primary} />
              <pointLight position={[-5, 0, 3]} intensity={1} color={currentProduct.theme.accent} />
              
              <Environment preset="city" />
              
              <Model 
                textureUrl={currentProduct.texture} 
                onRotationComplete={() => setRotationComplete(true)}
              />
              
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial opacity={0.4} />
              </mesh>
            </Canvas>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-12 right-12 flex flex-col gap-3 z-20">
            <div 
              className="px-5 py-3 rounded-2xl backdrop-blur-3xl border flex items-center gap-3 shadow-xl"
              style={{
                background: '#00000090',
                borderColor: `${currentProduct.theme.primary}30`,
              }}
            >
              <MousePointerClick className="w-5 h-5 text-white animate-pulse" />
              <span className="text-sm font-bold text-white">360° Interactive</span>
            </div>
          </div>

          {/* Product Counter */}
          <div className="absolute bottom-12 right-12 z-20">
            <div 
              className="px-6 py-4 rounded-2xl backdrop-blur-3xl border shadow-2xl"
              style={{
                background: '#00000090',
                borderColor: `${currentProduct.theme.primary}30`,
              }}
            >
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-5xl font-black"
                  style={{ color: currentProduct.theme.primary }}
                >
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-gray-600 text-2xl font-light">/</span>
                <span className="text-gray-500 text-xl font-light">
                  {String(products.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Navigation
        products={products}
        currentIndex={currentIndex}
        currentProduct={currentProduct}
        onNext={goToNext}
        onPrev={goToPrev}
        onSelectProduct={(index) => {
          setCurrentIndex(index);
          setRotationComplete(false);
        }}
      />

      {/* Progress Bar */}
      <ProgressBar
        products={products}
        currentIndex={currentIndex}
        currentProduct={currentProduct}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
      />
    </div>
  );
}
