"use client";

import { Star, TrendingUp, Package } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Digital Artist',
    content: 'Made $3,500 in my first month! The platform is super easy to use and the support team is amazing.',
    rating: 5,
    earnings: '$3.5K',
    designs: 23,
    color: '#ff6b35',
  },
  {
    name: 'Marcus Chen',
    role: 'Street Artist',
    content: 'Finally a platform that values artists. Fair commissions and fast payouts. Highly recommend!',
    rating: 5,
    earnings: '$5.2K',
    designs: 41,
    color: '#00d9ff',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Illustrator',
    content: 'Love seeing my designs worn by people worldwide. This changed my career trajectory completely.',
    rating: 5,
    earnings: '$4.1K',
    designs: 32,
    color: '#39ff14',
  },
];

export default function Testimonials() {
  return (
    <section className="relative py-32 bg-black">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Success Stories
          </h2>
          <p className="text-lg text-gray-500">
            Join thousands of artists earning from their creativity
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500"
            >
              {/* Top colored bar */}
              <div 
                className="h-1.5"
                style={{ backgroundColor: testimonial.color }}
              />

              {/* Content */}
              <div className="p-8">
                {/* Stats Row */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${testimonial.color}20` }}
                    >
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{testimonial.earnings}</p>
                      <p className="text-xs text-gray-600">Monthly</p>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-white/10" />

                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${testimonial.color}20` }}
                    >
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-black text-white">{testimonial.designs}</p>
                      <p className="text-xs text-gray-600">Designs</p>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
