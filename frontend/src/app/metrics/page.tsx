"use client";
import React from 'react';
import { Zap, Palette, BarChart3, Shield } from 'lucide-react';
import { HLSVideo } from '../../components/HLSVideo';

export default function MetricsPage() {
  return (
    <div className="pt-32 flex flex-col items-center">
      {/* SECTION 1 - FEATURES GRID */}
      <section className="w-full py-16 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col items-center md:items-start">
        <div className="text-center md:text-left mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4 shadow-sm border border-white/10">
            The Metrics
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9]">
            Evaluate with<br/>comprehensive precision.
          </h1>
          <p className="mt-8 font-body font-light text-white/60 text-xl max-w-2xl leading-relaxed">
            By aggregating distinct dimensions of a developer's code output, we synthesize an accurate reflection of their raw engineering capability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-4">
          {[
            { icon: Zap, title: "Development Velocity", desc: "Measure commit frequency, issue resolution, and project turnaround speed." },
            { icon: Palette, title: "Code Quality", desc: "Analyze documentation habits, architecture patterns, and repository structure." },
            { icon: BarChart3, title: "Tech Diversity", desc: "Understand the real-world variety of languages and frameworks mastered." },
            { icon: Shield, title: "Collaboration Patterns", desc: "Track meaningful peer code reviews, issues opened, and PRs merged." }
          ].map((feature, i) => (
            <div key={i} className="liquid-glass rounded-3xl p-8 flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-500 shadow-xl border border-white/5">
              <div className="liquid-glass-strong rounded-full w-14 h-14 flex items-center justify-center shadow-inner border border-white/10">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-heading italic text-white mt-4">
                {feature.title}
              </h4>
              <p className="text-white/60 font-body font-light text-base leading-relaxed mt-2">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2 - STATS */}
      <section className="relative w-full py-40 px-6 flex items-center justify-center overflow-hidden bg-black mt-16 mb-16">
        <HLSVideo 
           src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
           className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
           style={{ filter: 'saturate(0)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-[1]" />
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none z-[1]" />
        
        <div className="relative z-10 w-full max-w-6xl">
          <div className="mx-auto w-full grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 p-12 md:p-16 text-center liquid-glass rounded-3xl shadow-2xl border border-white/10">
             {[
               { val: "1M+", lbl: "Profiles Analyzed" },
               { val: "50+", lbl: "Data Points Evaluated" },
               { val: "4x", lbl: "Better Hiring Accuracy" },
               { val: "15s", lbl: "Analysis Time" }
             ].map((stat, i) => (
               <div key={i} className="flex flex-col items-center gap-3 lg:border-r border-white/10 last:border-0 border-dashed">
                  <div className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tighter drop-shadow-lg">{stat.val}</div>
                  <div className="text-white/60 font-body font-light text-sm uppercase tracking-widest">{stat.lbl}</div>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
