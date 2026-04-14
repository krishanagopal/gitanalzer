"use client";
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { HLSVideo } from '../../components/HLSVideo';

export default function HowItWorks() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <section className="relative w-full min-h-[900px] py-40 px-6 md:px-16 lg:px-24 flex items-center justify-center overflow-hidden bg-black flex-grow">
        <HLSVideo 
           src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
           className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-black to-transparent pointer-events-none z-[1]" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl justify-center">
          <div className="liquid-glass rounded-full px-5 py-1.5 text-sm font-medium text-white font-body inline-block mb-8 shadow-md border border-white/10">
            The Process
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9]">
            You build it.<br/>We measure it.
          </h1>
          <p className="font-body font-light text-white/60 text-lg md:text-xl mt-8 max-w-2xl leading-relaxed">
            Connect any GitHub profile securely. Our proprietary intelligence engine maps thousands of activity points—from your architectural layout and framework diversity to commit consistency and peer collaboration rates—resolving an accurate assessment in roughly 15 seconds.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
            <Link href="/#search-input">
              <button className="liquid-glass-strong rounded-full px-10 py-5 font-body font-bold flex items-center gap-3 shadow-2xl">
                Connect GitHub <ArrowUpRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/blueprint" className="text-white hover:text-white/80 border-b border-white/20 hover:border-white transition-colors pb-1 font-body text-sm font-medium mt-4 sm:mt-0">
              Read the Whitepaper
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
