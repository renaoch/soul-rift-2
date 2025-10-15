"use client";

import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const footerLinks = {
  shop: ['All Designs', 'T-Shirts', 'Hoodies', 'Collections', 'New Arrivals'],
  artists: ['Become a Creator', 'How It Works', 'Artist Guidelines', 'Success Stories', 'FAQs'],
  company: ['About Us', 'Careers', 'Press', 'Blog', 'Contact'],
  support: ['Help Center', 'Shipping', 'Returns', 'Size Guide', 'Track Order'],
};

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#ff3131] flex items-center justify-center font-black text-xl text-white">
                T
              </div>
              <span className="text-xl font-black text-white">TeeStudio</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering artists worldwide to share their creativity and earn from their passion.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                <button
                  key={index}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 TeeStudio. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              Artist Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
