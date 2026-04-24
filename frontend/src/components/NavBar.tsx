"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, X } from 'lucide-react';

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScrollToSearch = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      const el = document.getElementById('search-input');
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        el.focus();
      }
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 sm:top-4 inset-x-0 z-50 flex flex-col items-center w-full sm:px-6">
      <div className="w-full max-w-7xl flex items-center justify-between gap-2 relative bg-zinc-950/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none px-4 py-3 sm:px-0 sm:py-0 border-b border-white/5 sm:border-transparent">
        <Link href="/" onClick={closeMobileMenu} className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full liquid-glass-strong flex items-center justify-center font-heading italic text-lg sm:text-xl shadow-lg hover:scale-105 transition-transform text-white decoration-transparent z-10">
          GA<sup className="text-[8px] sm:text-[10px]">&reg;</sup>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex liquid-glass rounded-full px-8 py-3 items-center gap-8 shadow-md">
          <Link href="/features" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Features</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-white/90 hover:text-white transition-colors">How it Works</Link>
          <Link href="/blueprint" className="text-sm font-medium text-white/90 hover:text-white transition-colors">The Blueprint</Link>
          <Link href="/enterprise" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Enterprise</Link>
        </div>
        
        <div className="flex items-center gap-2 z-10">
          <Link href="/#search-input" onClick={handleScrollToSearch}>
            <button className="bg-white text-black font-body text-sm font-medium flex items-center gap-2 rounded-full px-5 py-2.5 shadow-lg hidden sm:flex">
              Analyze Profile <ArrowUpRight className="w-4 h-4" />
            </button>
            <button className="bg-white text-black font-body text-sm font-medium flex items-center justify-center rounded-full w-10 h-10 shadow-lg sm:hidden">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden liquid-glass-strong w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Links Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] right-4 w-56 bg-zinc-950/95 backdrop-blur-xl border border-zinc-800 rounded-2xl p-3 flex flex-col gap-1 shadow-2xl animate-in slide-in-from-top-2 duration-200 origin-top-right">
          <Link href="/features" onClick={closeMobileMenu} className="text-sm font-medium text-white/90 hover:text-white transition-colors px-4 py-3 hover:bg-zinc-800/50 rounded-xl">Features</Link>
          <Link href="/how-it-works" onClick={closeMobileMenu} className="text-sm font-medium text-white/90 hover:text-white transition-colors px-4 py-3 hover:bg-zinc-800/50 rounded-xl">How it Works</Link>
          <Link href="/blueprint" onClick={closeMobileMenu} className="text-sm font-medium text-white/90 hover:text-white transition-colors px-4 py-3 hover:bg-zinc-800/50 rounded-xl">The Blueprint</Link>
          <Link href="/enterprise" onClick={closeMobileMenu} className="text-sm font-medium text-white/90 hover:text-white transition-colors px-4 py-3 hover:bg-zinc-800/50 rounded-xl">Enterprise</Link>
        </div>
      )}
    </nav>
  );
}
