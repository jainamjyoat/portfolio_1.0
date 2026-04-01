"use client";

import React, { useState, useEffect, useMemo } from 'react';
import TransitionLink from '@/components/TransitionLink';
import TiltCard from '@/components/TiltCard';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- NEW: FORCE GPU ACCELERATION ---
gsap.config({
  force3D: true, 
});

import Ballpit from '@/components/Ballpit';

// Register GSAP ScrollTrigger to ensure they sync properly
gsap.registerPlugin(ScrollTrigger);

// --- STATIC REPOSITORY INTERFACE ---
interface ArchiveRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string | null;
  updated_at: string;
  stargazers_count: number;
  image: string; 
}

// --- HARDCODED CONTENT DATABASE ---
const staticRepos: ArchiveRepo[] = [
  {
    id: 1,
    name: "Varanasi-Tours-India",
    description: "Commercial freelance tourism platform built to showcase cultural heritage, local handicrafts, and drive digital bookings.",
    html_url: "https://varanasitoursindia.com",
    language: "TypeScript",
    topics: ["react", "next.js", "tailwindcss"],
    updated_at: "2026-03-15T10:00:00Z",
    stargazers_count: 12,
    image: "./VTI 1.webp" 
  },
  {
    id: 2,
    name: "CALYX-NASA-Space-Apps",
    description: "Real-time satellite data visualization and anomaly detection system. Global Honorable Mention winner.",
    html_url: "https://plant-phenology-state-detector.vercel.app/", 
    language: "JavaScript",
    topics: ["docker", "node.js", "computer-vision"],
    updated_at: "2025-10-05T14:30:00Z",
    stargazers_count: 48,
    image: "./CALAYX.webp" 
  },
  {
    id: 3,
    name: "UrbanSwap-AI-Marketplace",
    description: "AI-driven marketplace assistant designed for local artisans, featuring intelligent search and context-aware suggestions.",
    html_url: "https://ai-marketplace-assistant-162648101104.asia-south1.run.app/",
    language: "Python",
    topics: ["flask", "gcp", "vertex-ai"],
    updated_at: "2025-11-20T09:15:00Z",
    stargazers_count: 24,
    image: "./UrbanSwap.webp" 
  },
  {
    id: 4,
    name: "Neural-Render-Engine",
    description: "Experimental C++ engine for AI-assisted path tracing and real-time noise reduction in complex 3D environments.",
    html_url: "https://github.com/jainamjyoat",
    language: "C++",
    topics: ["cuda", "pytorch", "optix"],
    updated_at: "2025-08-12T16:45:00Z",
    stargazers_count: 89,
    image: "" 
  },
  {
    id: 5,
    name: "Ledger-Protocol-X",
    description: "Decentralized identity management protocol focusing on zero-knowledge proofs and secure cross-chain authentication.",
    html_url: "https://github.com/jainamjyoat",
    language: "Rust",
    topics: ["wasm", "solidity", "zk-snarks"],
    updated_at: "2025-06-30T11:20:00Z",
    stargazers_count: 156,
    image: "" 
  },
  {
    id: 6,
    name: "Cyber-Threat-Monitor",
    description: "Security information and event management (SIEM) dashboard for small-to-medium enterprise networks.",
    html_url: "https://github.com/jainamjyoat",
    language: "Go",
    topics: ["elasticsearch", "kibana", "security"],
    updated_at: "2026-01-10T08:00:00Z",
    stargazers_count: 34,
    image: "" 
  }
];

export default function ArchivePage() {
  const [activeCategory, setActiveCategory] = useState<string>("Show All");
  
  const categories = useMemo(() => {
    const langs = Array.from(new Set(staticRepos.map(r => r.language).filter(Boolean))) as string[];
    return ["Show All", ...langs];
  }, []);

  // --- DYNAMIC IST CLOCK ---
  const [localTime, setLocalTime] = useState<string>("India / --:-- IST");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLocalTime(`India / ${formatter.format(now)} IST`);
    };

    updateTime(); 
    const intervalId = setInterval(updateTime, 1000); 

    return () => clearInterval(intervalId); 
  }, []);

  // --- LENIS SMOOTH SCROLL + GSAP SYNC ---
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  const filteredRepos = activeCategory === "Show All" 
    ? staticRepos 
    : staticRepos.filter(r => r.language === activeCategory);

  return (
    <div className="bg-background-dark text-slate-100 font-sans selection:bg-primary selection:text-black min-h-screen flex flex-col">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-6 md:px-12 flex justify-between items-center bg-background-dark sticky top-0 z-50">
        <TransitionLink href="/" className="flex items-center gap-2 group cursor-pointer outline-none">
          <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">terminal</span>
          <span className="font-display font-bold text-xl tracking-tighter uppercase group-hover:text-primary transition-colors">Developer.Archive</span>
        </TransitionLink>
        <div className="flex items-center gap-8">
          <TransitionLink 
            className="font-display text-sm font-medium uppercase tracking-widest hover:text-primary transition-colors" 
            href="/"
          >
            Back to Home
          </TransitionLink>
        </div>
      </nav>

      <main className="flex-grow">
        
        {/* ==================================================== */}
        {/* HERO SECTION WITH SCOPED 3D BALLPIT                  */}
        {/* ==================================================== */}
        <section className="relative px-6 md:px-12 py-24 md:py-32 border-b border-white/10 overflow-hidden flex items-center min-h-[50vh]">
          <div className="absolute inset-0 z-0 opacity-60">
            <Ballpit
              count={75}
              gravity={0.02} 
              friction={0.99}
              wallBounce={0.95}
              followCursor={true} 
              colors={[0xFFFF00, 0x141414, 0x2A2A2A]}
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full pointer-events-none">
            <div>
              <p className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-4 pointer-events-auto">Curated Database / 2026</p>
              <h1 className="text-6xl md:text-9xl font-bold font-display leading-[0.85] tracking-tighter uppercase pointer-events-auto">
                Local<br /><span className="text-primary">Archive <span className="text-4xl align-top opacity-50">[{staticRepos.length.toString().padStart(2, '0')}]</span></span>
              </h1>
            </div>
          </div>
        </section>

        {/* Category Filter Bar */}
        <section className="flex flex-wrap border-b border-white/10 divide-x divide-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-background-dark">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 flex items-center gap-2 transition-all cursor-pointer outline-none ${
                activeCategory === cat 
                ? "text-primary bg-white/5 border-b-2 border-primary" 
                : "text-slate-400 hover:bg-white hover:text-black"
              }`}
            >
              {cat === "Show All" && (
                <span className={`size-1.5 bg-primary rounded-full ${activeCategory === cat ? 'animate-pulse' : ''}`}></span>
              )}
              {cat} {cat === "Show All" ? `[${staticRepos.length.toString().padStart(2, '0')}]` : ""}
            </button>
          ))}
          <div className="flex-grow"></div>
          <div className="px-6 py-4 hidden lg:flex items-center gap-4 text-slate-500 border-l border-white/10">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified_user</span> 
              Status: Encrypted Local Archive
            </span>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-background-dark/30">
          {filteredRepos.map((repo) => (
            
            <TiltCard key={repo.id}>
              {/* Removed hover-glow to prevent any residual yellow box-shadows */}
              <div className="h-full border-b border-r border-white/10 p-8 flex flex-col group transition-all duration-300 relative overflow-hidden bg-background-dark/40 backdrop-blur-sm">
                
                {/* Dynamic Image Rendering - Yellow overlay completely removed */}
                <div className="aspect-video bg-zinc-900 mb-6 overflow-hidden relative border border-white/5">
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    src={repo.image || `https://opengraph.githubassets.com/1/jainamjyoat/${repo.name}`} 
                    alt={repo.name}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  {/* Changed hover color to white for cleaner look */}
                  <h3 className="text-2xl font-bold font-display uppercase leading-none group-hover:text-white transition-colors pr-4">
                    {repo.name.replace(/-/g, ' ').split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word}{i === 1 ? <br /> : ' '}
                      </React.Fragment>
                    ))}
                  </h3>
                  
                  {/* Star Count */}
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">star</span>
                    {repo.stargazers_count}
                  </span>
                </div>

                <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed uppercase tracking-tight">
                  {repo.description}
                </p>

                <div className="mb-8">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-3">Tech Stack_</p>
                  <div className="flex flex-wrap gap-2">
                    {[repo.language, ...repo.topics].filter(Boolean).slice(0, 4).map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 border border-white/10 text-[10px] font-bold tracking-tighter uppercase group-hover:border-white/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Source Button - Changed to white on hover instead of yellow */}
                <a 
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-widest group-hover:border-white group-hover:bg-white group-hover:text-black transition-all"
                >
                  View Source Archive
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </a>
              </div>
            </TiltCard>

          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-20 bg-background-dark border-t border-white/10 flex flex-col md:flex-row justify-between gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl font-bold font-display uppercase tracking-tighter">
            Let's build the<br /><span className="text-primary underline decoration-2 underline-offset-8">next version.</span>
          </h2>
          <div className="flex gap-4">
            <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="https://github.com/jainamjyoat" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="https://www.linkedin.com/in/jainam-jyoat/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <div className="flex flex-col md:items-end justify-between">
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Local Time</p>
            <p className="font-bold text-xl uppercase tracking-tighter transition-opacity duration-300">
              {localTime}
            </p>
          </div>
          <div className="text-slate-600 text-[10px] uppercase tracking-widest mt-8">
            © 2026 DEV_ARCHIVE. All rights reserved. Designed for extreme performance.
          </div>
        </div>
      </footer>
    </div>
  );
}