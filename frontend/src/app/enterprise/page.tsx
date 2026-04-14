"use client";
import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function EnterprisePage() {
  return (
    <div className="pt-32 pb-32 flex flex-col items-center min-h-[90vh]">
      <section className="w-full px-6 md:px-16 lg:px-24 max-w-5xl mx-auto flex flex-col items-center text-center">
        <div className="mt-16 mb-8">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4 shadow-sm border border-white/10">
            For Teams & Platforms
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading italic text-white tracking-tight leading-[0.9]">
            GitAnalyzer API.
          </h1>
          <p className="mt-8 font-body font-light text-white/60 text-xl max-w-2xl leading-relaxed mx-auto">
            Integrate the world's deepest developer intelligence engine directly into your ATS, hiring platform, or internal engineering dashboards.
          </p>
        </div>

        <div className="liquid-glass rounded-3xl p-10 md:p-16 w-full mt-12 flex flex-col md:flex-row items-center md:items-start justify-between gap-12 border border-white/5 shadow-2xl relative overflow-hidden text-left">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] pointer-events-none -mr-40 -mt-40" />
           
           <div className="flex-1 z-10">
             <h3 className="text-3xl font-heading italic text-white">Enterprise Tier</h3>
             <ul className="mt-8 flex flex-col gap-5">
               {[
                 'Unlimited profile analyses via REST/GraphQL API', 
                 'Automated hiring ATS integrations (Greenhouse, Lever)', 
                 'Custom scoring weights for your specific tech stack', 
                 'Dedicated account architecture support', 
                 'SLA guaranteed 99.99% uptime API resolving'
               ].map((feature, i) => (
                 <li key={i} className="flex items-center gap-3 font-body text-white/80">
                   <CheckCircle2 className="w-5 h-5 text-white/70" />
                   {feature}
                 </li>
               ))}
             </ul>
           </div>
           
           <div className="flex-1 w-full md:w-auto liquid-glass-strong rounded-2xl p-8 flex flex-col items-center justify-center text-center z-10 border border-white/10">
             <div className="text-5xl font-heading italic text-white">Custom</div>
             <div className="text-white/50 font-body text-sm mt-3 mb-8 px-4 leading-relaxed">Priced dynamically to match your candidate volume flow.</div>
             <a href="mailto:hello@gitanalyzer.com" className="w-full">
               <button className="bg-white text-black w-full rounded-full px-8 py-5 font-body font-bold flex items-center justify-center gap-3 shadow-2xl">
                 Contact Sales <ArrowUpRight className="w-5 h-5" />
               </button>
             </a>
           </div>
        </div>
      </section>
    </div>
  );
}
