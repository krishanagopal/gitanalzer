"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HLSVideo } from './HLSVideo';

export function Footer() {
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
    <footer className="relative w-full pt-40 pb-16 px-6 flex flex-col items-center justify-center overflow-hidden bg-black mt-auto">
      <HLSVideo 
         src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
         className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      />
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-black to-transparent pointer-events-none z-[1]" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mt-16">
        <h2 className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white tracking-tight leading-[0.85]">
          Uncover your true engineering score.
        </h2>
        <p className="font-body font-light text-white/60 text-lg md:text-xl mt-8 max-w-xl">
          Enter any GitHub username to instantly map out strengths, weaknesses, and a comprehensive developer baseline.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-12">
          <Link href="/#search-input" onClick={handleScrollToSearch}>
            <button className="liquid-glass-strong rounded-full px-10 py-5 font-body font-medium shadow-xl flex items-center gap-2 text-white">
              Analyze a Profile <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/enterprise">
            <button className="bg-white text-black rounded-full px-10 py-5 font-body font-medium transition-colors text-sm shadow-xl">
              View Enterprise API
            </button>
          </Link>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mt-40 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white/40 text-xs font-body tracking-wide">
          © 2026 GitAnalyzer. Developer Intelligence Platform.
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-body tracking-wide">Privacy Policy</a>
          <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-body tracking-wide">Terms of Service</a>
          <a href="#" className="text-white/40 hover:text-white transition-colors text-xs font-body tracking-wide">Contact</a>
        </div>
      </div>
    </footer>
  );
}
