"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { BlurText } from '../components/BlurText';
import { Footer } from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="relative h-[1000px] w-full flex flex-col pt-[150px] md:pt-[200px] items-center text-center overflow-hidden">
        <video 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
          className="absolute top-[20%] w-full h-auto object-contain z-0 pointer-events-none"
          autoPlay loop muted playsInline
          poster="/images/hero_bg.jpeg"
        />
        <div className="absolute inset-0 bg-black/5 z-[1] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 z-[2] h-[400px] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center px-4 w-full">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-flex items-center gap-2 mb-8 shadow-sm">
            <span className="bg-white text-black rounded-full px-2 py-0.5 text-[10px] font-bold">New</span>
            <span>The deepest GitHub intelligence platform.</span>
          </div>
          
          <BlurText 
            text="The True Measure of a Developer"
            className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] tracking-[-4px] max-w-4xl"
          />
          
          <motion.p 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-body font-light text-white/60 text-lg md:text-xl max-w-2xl mt-8"
          >
            More than just stars and commits. Evaluate engineering depth, project complexity, and collaboration patterns to uncover real capability.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6 mt-12"
          >
            <button className="liquid-glass-strong rounded-full px-8 py-4 font-body font-medium flex items-center gap-2 hover:scale-105 transition-transform text-sm shadow-xl">
              Get Your Score <ArrowUpRight className="w-4 h-4" />
            </button>
            <Link href="/how-it-works" className="font-body font-medium flex items-center gap-2 hover:text-white/80 transition-colors text-sm text-white px-4 py-2">
              See how it works <Play className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        
        <div className="relative z-10 mt-auto pb-8 pt-16 flex flex-col items-center w-full px-6">
           <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-8">
             Evaluating engineers from top teams
           </div>
           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1, delay: 0.2 }}
             className="flex flex-wrap justify-center items-center gap-10 md:gap-16 w-full max-w-5xl"
           >
             {['Stripe', 'Vercel', 'Linear', 'Notion', 'Figma'].map(partner => (
               <div key={partner} className="text-2xl md:text-3xl font-heading italic text-white/80 select-none">
                 {partner}
               </div>
             ))}
           </motion.div>
        </div>
      </section>

      <section className="w-full py-32 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="mb-16">
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4 shadow-sm">
            Who Uses GitAnalyzer
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
            Trusted by engineering leaders.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {[
            { quote: "GitAnalyzer instantly cuts through the noise. It accurately spots a developer's true consistency and complexity rather than just their repository count.", name: "Sarah Chen", role: "VP of Engineering Luminary" },
            { quote: "Finally, an evaluation tool that respects open-source collaboration patterns. It has transformed how we discover senior technical talent.", name: "Marcus Webb", role: "Head of Talent Arcline" },
            { quote: "As a developer, seeing my structural strengths and tech diversity visualized in a single score is incredibly powerful for my portfolio.", name: "Elena Voss", role: "Senior Architect Helix" }
          ].map((testimonial, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-8 flex flex-col gap-8 shadow-xl hover:-translate-y-1 transition-transform duration-300">
               <p className="text-white/80 font-body font-light text-base md:text-sm lg:text-base italic leading-relaxed">
                 "{testimonial.quote}"
               </p>
               <div className="mt-auto flex flex-col gap-0.5">
                 <span className="text-white font-body font-medium text-sm">{testimonial.name}</span>
                 <span className="text-white/50 font-body font-light text-xs uppercase tracking-wider">{testimonial.role}</span>
               </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
