"use client";
import { motion } from 'framer-motion';
import { Zap, Palette, BarChart3, Shield } from 'lucide-react';
import { HLSVideo } from '../../components/HLSVideo';

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-32 flex flex-col items-center">
      <section className="w-full px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col gap-16 md:gap-32">
        <div className="text-center md:text-left mt-16 mb-8">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4 shadow-sm">
            Deep Analysis
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9] max-w-3xl">
            Go beyond the<br/>surface metrics.
          </h1>
          <p className="mt-6 font-body text-white/60 text-lg max-w-2xl">
            We don't just count repositories or look at follower badges. GitAnalyzer inspects your actual codebase architecture, review participation, and technology footprint.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="flex-1 flex flex-col items-start gap-6">
            <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[0.9] tracking-tight">
              Track engineering depth.
            </h3>
            <p className="font-body font-light text-white/60 text-base leading-relaxed max-w-md">
              Stop counting followers. We analyze total project complexity, architecture, and technology diversity to reveal a developer's true technical spectrum.
            </p>
            <button className="liquid-glass-strong rounded-full px-8 py-3.5 font-body font-medium mt-2 hover:scale-105 transition-transform text-sm shadow-lg">
              Analyze your repo
            </button>
          </div>
          <div className="flex-1 w-full aspect-[4/3] liquid-glass rounded-2xl overflow-hidden shadow-2xl p-2 md:p-3 relative group">
             <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/80 border border-white/5 group-hover:border-white/20 transition-colors duration-500 flex flex-col items-center justify-center p-6 text-center">
               <HLSVideo 
                  src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-[1]" />
               
               <div className="relative z-10 mt-auto transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-3xl md:text-4xl font-heading italic text-white tracking-tight leading-none mb-2">You build it.<br/>We measure it.</h4>
                  <p className="text-white/60 font-body text-xs md:text-sm leading-relaxed max-w-[250px] mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    Connect any GitHub profile securely to map thousands of data points instantly.
                  </p>
               </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
          <div className="flex-1 flex flex-col items-start gap-6">
            <h3 className="text-3xl md:text-4xl font-heading italic text-white leading-[0.9] tracking-tight">
              Measure what matters.
            </h3>
            <p className="font-body font-light text-white/60 text-base leading-relaxed max-w-md">
              We evaluate real development activity: pull request frequency, code review participation, and consistent commit streaks over time.
            </p>
            <button className="text-white hover:text-white/80 border-b border-white/20 hover:border-white transition-colors pb-1 font-body text-sm font-medium mt-2">
              See the algorithms
            </button>
          </div>
          <div className="flex-1 w-full aspect-[4/3] liquid-glass rounded-2xl overflow-hidden shadow-2xl p-2 md:p-3 relative group">
             <div className="w-full h-full rounded-xl overflow-hidden relative bg-black/40 border border-white/5 group-hover:border-white/20 transition-colors duration-500 p-4">
               <div className="grid grid-cols-2 gap-3 w-full h-full relative z-10">
                 {[
                   { icon: Zap, title: "Velocity", delay: 0 },
                   { icon: Palette, title: "Quality", delay: 0.3 },
                   { icon: BarChart3, title: "Diversity", delay: 0.6 },
                   { icon: Shield, title: "Collaboration", delay: 0.9 }
                 ].map((mod, i) => (
                   <motion.div 
                     key={i}
                     className="liquid-glass rounded-xl flex flex-col justify-center items-center text-center p-3 shadow-2xl border border-white/5 group-hover:border-white/20 transition-colors"
                     animate={{ y: ["-3%", "3%", "-3%"] }}
                     transition={{ repeat: Infinity, duration: 5, delay: mod.delay, ease: "easeInOut" }}
                   >
                     <mod.icon className="w-6 h-6 text-white mb-2" />
                     <span className="text-white font-heading italic text-lg md:text-xl tracking-tight">{mod.title}</span>
                   </motion.div>
                 ))}
               </div>
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none blur-xl" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
