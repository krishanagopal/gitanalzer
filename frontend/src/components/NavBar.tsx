"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function NavBar() {
  const handleScrollToSearch = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const el = document.getElementById('search-input');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        el.focus();
      }
    }
  };

  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center w-full px-4 sm:px-6">
      <div className="w-full max-w-7xl flex items-center justify-between gap-2">
        <Link href="/" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full liquid-glass-strong flex items-center justify-center font-heading italic text-lg sm:text-xl shadow-lg hover:scale-105 transition-transform text-white decoration-transparent">
          GA<sup className="text-[8px] sm:text-[10px]">&reg;</sup>
        </Link>
        
        <div className="hidden md:flex liquid-glass rounded-full px-8 py-3 items-center gap-8 shadow-md">
          <Link href="/features" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Features</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-white/90 hover:text-white transition-colors">How it Works</Link>
          <Link href="/blueprint" className="text-sm font-medium text-white/90 hover:text-white transition-colors">The Blueprint</Link>
          <Link href="/enterprise" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Enterprise</Link>
        </div>
        
        <Link href="/#search-input" onClick={handleScrollToSearch}>
          <button className="bg-white text-black font-body text-sm font-medium flex items-center gap-2 rounded-full px-5 py-2.5 shadow-lg">
            Analyze Profile <ArrowUpRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </nav>
  );
}
