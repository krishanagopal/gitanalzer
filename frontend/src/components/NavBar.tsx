import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function NavBar() {
  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center w-full px-6">
      <div className="w-full max-w-7xl flex items-center justify-between">
        <Link href="/" className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center font-heading italic text-xl shadow-lg hover:scale-105 transition-transform text-white decoration-transparent">
          GA<sup className="text-[10px]">&reg;</sup>
        </Link>
        
        <div className="hidden md:flex liquid-glass rounded-full px-8 py-3 items-center gap-8 shadow-md">
          <Link href="/features" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Features</Link>
          <Link href="/how-it-works" className="text-sm font-medium text-white/90 hover:text-white transition-colors">How it Works</Link>
          <Link href="/metrics" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Metrics</Link>
          <Link href="/enterprise" className="text-sm font-medium text-white/90 hover:text-white transition-colors">Enterprise</Link>
        </div>
        
        <button className="bg-white text-black font-body text-sm font-medium flex items-center gap-2 rounded-full px-5 py-2.5 hover:scale-105 transition-transform shadow-lg">
          Analyze Profile <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
