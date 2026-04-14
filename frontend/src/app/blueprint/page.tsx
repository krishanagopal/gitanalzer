"use client";
import React from 'react';
import { 
  ArrowUpRight, 
  Map, 
  Layout, 
  FileText, 
  GitBranch, 
  User, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Zap, 
  History,
  Terminal,
  Share2,
  Box
} from 'lucide-react';
import Link from 'next/link';
import { HLSVideo } from '../../components/HLSVideo';

const MindMapNode = ({ title, children, icon: Icon, colorClass, delay = "" }) => (
  <div className={`group relative liquid-glass p-6 rounded-[1.5rem] border border-white/10 flex flex-col gap-4 hover:border-${colorClass}-500/50 transition-all duration-500 hover:translate-y-[-4px] ${delay}`}>
    <div className={`w-12 h-12 rounded-xl bg-${colorClass}-500/10 flex items-center justify-center border border-${colorClass}-500/20 group-hover:scale-110 transition-transform`}>
      <Icon className={`w-6 h-6 text-${colorClass}-400`} />
    </div>
    <div className="flex flex-col gap-3">
      <h3 className={`text-xl font-heading italic text-${colorClass}-100`}>{title}</h3>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
    <div className={`absolute -inset-[1px] rounded-[1.5rem] bg-gradient-to-br from-${colorClass}-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
  </div>
);

const SubNode = ({ text, tooltip }) => (
  <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] font-body text-white/70 hover:bg-white/10 hover:text-white transition-all cursor-default flex items-center gap-2 group/sub">
    {text}
    {tooltip && <div className="hidden group-hover/sub:block absolute mt-8 p-2 bg-black/90 rounded text-[10px] w-32 z-50 border border-white/10">{tooltip}</div>}
  </div>
);

export default function BlueprintPage() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-black text-white selection:bg-white/20 pb-20 overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none z-0">
        <HLSVideo 
           src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
           className="w-full h-full object-cover opacity-30 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black" />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-32 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-white/10 mb-8 animate-fade-in">
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          <span className="text-xs font-medium tracking-[0.2em] uppercase">The Gold Standard</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-heading italic tracking-tighter leading-[0.8] mb-6">
          The <span className="text-emerald-400">Ideal</span> Profile.<br/>
          <span className="text-white/20">A Mind Map.</span>
        </h1>
        <p className="max-w-2xl mx-auto font-body font-light text-white/50 text-lg md:text-xl">
          We've mapped 14+ professional signals into 5 core pillars. This is exactly what a senior engineering audit looks for in a developer portfolio.
        </p>
      </header>

      {/* Central Hub Image/Design Placeholder - Represents the Mind Map Core */}
      <div className="relative z-10 w-full max-w-7xl px-6">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Branch */}
          <div className="md:col-span-4 space-y-8 order-2 md:order-1">
            <MindMapNode title="IDENTITY" icon={User} colorClass="emerald">
              <SubNode text="Greeting & Professional Bio" />
              <SubNode text="Tech Stack Visualization" />
              <SubNode text="Contact & Social Links" />
              <SubNode text="GitHub Stats Widgets" />
              <SubNode text="Featured Projects Showcase" />
            </MindMapNode>

            <MindMapNode title="ARCHITECTURE" icon={Layout} colorClass="blue">
              <SubNode text="Modular Folder Hierarchy" />
              <SubNode text="CI/CD (.github/workflows)" />
              <SubNode text="Professional LICENSE" />
              <SubNode text="Clean Root (No clutter)" />
              <SubNode text="Separation of Concerns" />
            </MindMapNode>
          </div>

          {/* Central Core */}
          <div className="md:col-span-4 flex items-center justify-center order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-8 bg-emerald-500/20 rounded-full blur-[60px] group-hover:bg-emerald-500/30 transition-all duration-700 animate-pulse" />
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full liquid-glass flex flex-col items-center justify-center border-2 border-white/10 shadow-2xl backdrop-blur-3xl group-hover:scale-105 transition-transform duration-700">
                <div className="liquid-glass-strong w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                  <Box className="w-8 h-8 md:w-10 md:h-10 text-emerald-400" />
                </div>
                <div className="text-center">
                  <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1">Target</div>
                  <div className="text-3xl md:text-5xl font-heading italic text-white flex items-center gap-1">
                    100<span className="text-xs text-white/30 not-italic align-top">/100</span>
                  </div>
                </div>
              </div>
              {/* Connector Lines (Desktop Only) */}
              <div className="hidden md:block absolute top-1/2 -left-32 w-32 h-[1px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
              <div className="hidden md:block absolute top-1/2 -right-32 w-32 h-[1px] bg-gradient-to-l from-purple-500/50 to-transparent" />
            </div>
          </div>

          {/* Right Branch */}
          <div className="md:col-span-4 space-y-8 order-3">
            <MindMapNode title="WORKFLOW" icon={GitBranch} colorClass="orange">
              <SubNode text="Feature Branching" />
              <SubNode text="Pull Request Merges" />
              <SubNode text="Versioned Releases" />
              <SubNode text="Issue-Based Tracking" />
              <SubNode text="Project Board Usage" />
            </MindMapNode>

            <MindMapNode title="DOCUMENTATION" icon={FileText} colorClass="purple">
              <SubNode text="Standard Big 4 Headers" />
              <SubNode text="Detailed Setup Guides" />
              <SubNode text="Live Demo / Screenshots" />
              <SubNode text="Usage Documentation" />
              <SubNode text="Contributor Guidelines" />
            </MindMapNode>
          </div>

        </div>

        {/* Bottom Branch - Spanning */}
        <div className="mt-12 md:max-w-xl mx-auto">
          <MindMapNode title="AUDIT TRAIL (COMMITS)" icon={History} colorClass="rose">
            <SubNode text="Conventional Commit Prefixes" />
            <SubNode text="Non-Contiguous Streak Proof" />
            <SubNode text="Detailed Message Lengths" />
            <SubNode text="High Conventional Ratio" />
            <SubNode text="Multi-timeframe Consistency" />
          </MindMapNode>
        </div>
      </div>

      {/* Final Section */}
      <section className="relative z-10 mt-32 px-6 flex flex-col items-center">
        <div className="liquid-glass p-8 md:p-12 rounded-[3rem] border border-white/10 max-w-4xl w-full text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-emerald-500/10 transition-colors">
            <Terminal className="w-32 h-32" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading italic mb-6">Ready for your Audit?</h2>
          <p className="text-white/60 font-body mb-10 max-w-2xl mx-auto">
            Connect your GitHub and see how your profile maps against the Blueprint. We provide specific file-by-file suggestions to reach the 100/100 gold standard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/#search-input">
              <button className="liquid-glass-strong px-12 py-5 rounded-full font-body font-bold text-sm tracking-wider flex items-center gap-2">
                Get Started <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/enterprise" className="text-white/40 hover:text-white transition-colors text-sm font-medium border-b border-white/10 pb-1">
              View API Documentation
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mt-20 pt-10 border-t border-white/5 w-full max-w-7xl px-6 flex justify-between items-center text-[10px] tracking-widest text-white/30 uppercase font-body">
        <div>© 2026 GitAnalyzer Intelligence Engine</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>

      {/* Decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-20">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
