"use client";

import React, { useState, useEffect } from 'react';
import TransitionLink from '@/components/TransitionLink';
import TiltCard from '@/components/TiltCard';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Ballpit from '@/components/Ballpit';

// Register GSAP ScrollTrigger to ensure they sync properly
gsap.registerPlugin(ScrollTrigger);

// Define the structure for your projects
interface Project {
  id: string;
  title: string;
  category: 'AI / ML' | 'Full-Stack' | 'Systems Architecture';
  description: string;
  techStack: string[];
  image: string;
  sourceLink: string;
}

const projects: Project[] = [
  { 
    id: "01", 
    title: "Varanasi Tours India", 
    category: "Full-Stack", 
    description: "Commercial freelance tourism platform built to showcase cultural heritage, local handicrafts, and drive digital bookings.", 
    techStack: ["REACT", "NEXT.JS", "TAILWIND CSS"], 
    image: "./VTI 1.webp", // Assuming you have this image from your main page
    sourceLink: "https://varanasitoursindia.com" 
  },
  { id: "02", title: "NASA Kaalnetra", category: "AI / ML", description: "Real-time satellite data visualization and anomaly detection system. Processing massive datasets to identify environmental shifts.", techStack: ["REACT", "D3.JS", "AWS LAMBDA", "WEBGL"], image: "./CALAYX.webp", sourceLink: "#" },
  { id: "03", title: "Microservices Food Logic", category: "Full-Stack", description: "A robust microservices-based architecture for high-concurrency food delivery operations, featuring real-time tracking.", techStack: ["NODE.JS", "REDIS", "MONGODB", "KUBERNETES"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiTWPFmAwGbt-LyfENzeIX3AWbM1TauEqTwge_ieKS4hCDhcdiKn_kiv3JDKldREdmFpHJw180WyK3_IJ4D_VLky2gNcqhEQGAFsrwK8hc7Xs_lkJDUNby9yh2IQw7zOLY_P2jUrB5m2vHP7IiGI7xKCp9qfjun-uk3BWVE_TnfZx8weUoBYkymaQWQWoLkAZH01_jRpTL9FFitRAjk7YNrqKs-v4ymspLlO3UZgIPbuKCoxXT4SZT68ZZfgcEaVEnvY9rh3kvOkg", sourceLink: "#" },
  { id: "04", title: "Neural Render Engine", category: "Systems Architecture", description: "Experimental C++ engine for AI-assisted path tracing and real-time noise reduction in complex 3D environments.", techStack: ["C++ 20", "NVIDIA CUDA", "PYTORCH", "OPTIX"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpLhYjQunLMc0kq2BSAGMoIqGyPukCCUDQ9VHW2IKIHWKE8DFRigMJwYk19G1e2MZeNuvZmxRbdyfCGDPEs7Af7k8_dDob7W7mkIjjd54XIr6oJZjURse-OGKNXASITHT-puCu9GwnM2c9uLoOv-ea90n4HCgMbBV7_6jd8HVWnUQwXYwASD_mFXMxhvSoSsKd5-FjP710w9NlaQ2qEhnl_tTvUgvFR-7g4cb9c1oLko2eQeC3FGWnl1o6zN-k1WNgFakVuozNvkg", sourceLink: "#" },
  { id: "05", title: "Ledger Protocol X", category: "Systems Architecture", description: "Decentralized identity management protocol focusing on zero-knowledge proofs and secure cross-chain authentication.", techStack: ["RUST", "WASM", "SOLIDITY", "ZK-SNARKS"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuO6FaaouuQzXpRFUsZyZvZTRc6T3cMXKfHZX1MMLrqnAh9uW3vn8A_tKsFBv62aLSP3S-j3ohzwCWcMtERfBQbIHTfh5EEtC-3boidInwBcfA7Nw5b4QIrcZbGGBVZWi0nxKjRmvCBLT7BK6iwTJGQFXxs7lDO2mDpvQ3a9dtXrsDQfE9Ae7AxILAAoy5iMUABRTSDoyoqPbr8jw_eTs7p1d3o9axu1HP8sLL-YgJNaKpI2bk9Ih5Tzdxf2ONUPBl8HhSe1A-258", sourceLink: "#" },
  { id: "06", title: "Cyber Threat Monitor", category: "Full-Stack", description: "Security information and event management (SIEM) dashboard for small-to-medium enterprise networks.", techStack: ["GO 1.18", "ELASTICSEARCH", "KIBANA", "LOGSTASH"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhNlF-MQc9pqAGY64gFEDZtmCC7mfsFEL0ZIi5p-u-CyRXSzGUozO3qGgYMDprwDgzLoORp4Uc12aTYyvBRkclhpopxeiIVI2dQ6NHkVVA6J_CgkOqHtsSWLswS8efQYTLTzzCddbHIHhaeoa6Y-rI6xjrkYuoofo9htkJB0NYUOOXTV8kknwqJLF4bIu7Zz2X9aSqYxfXUJIV6viwOXYO5PTCrfWUlB8XgIrkXT2B_8aB1aJl-AW3XjaW6DX09Lfdx0fBIiygxSk", sourceLink: "#" }
];

const categories = ["Show All", "AI / ML", "Full-Stack", "Systems Architecture"] as const;

export default function ArchivePage() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>("Show All");

  // --- DYNAMIC IST CLOCK ---
  const [localTime, setLocalTime] = useState<string>("India / --:-- IST");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format the time specifically for Asia/Kolkata (IST) in 24-hour format
      const formatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setLocalTime(`India / ${formatter.format(now)} IST`);
    };

    updateTime(); // Set initial time immediately
    const intervalId = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  // ---------------------------------------------

  // --- ADDED LENIS SMOOTH SCROLL + GSAP SYNC ---
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
  // ---------------------------------------------

  const filteredProjects = activeCategory === "Show All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-background-dark text-slate-100 font-sans selection:bg-primary selection:text-black min-h-screen flex flex-col">
      
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-6 md:px-12 flex justify-between items-center bg-background-dark sticky top-0 z-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
          <span className="font-display font-bold text-xl tracking-tighter uppercase">Developer.Archive</span>
        </div>
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
          
          {/* Ballpit Background scoped just to this section */}
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

          {/* Header Text */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 w-full pointer-events-none">
            <div>
              <p className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-4 pointer-events-auto">Portfolio Index / 2026</p>
              <h1 className="text-6xl md:text-9xl font-bold font-display leading-[0.85] tracking-tighter uppercase pointer-events-auto">
                Selected<br /><span className="text-primary">Works <span className="text-4xl align-top opacity-50">[{projects.length.toString().padStart(2, '0')}]</span></span>
              </h1>
            </div>
            <div className="max-w-md text-slate-400 text-sm leading-relaxed uppercase tracking-tight pointer-events-auto">
              A curated collection of technical solutions ranging from deep learning models to large-scale data visualization systems.
            </div>
          </div>
        </section>

        {/* Category Filter Bar */}
        <section className="flex flex-wrap border-b border-white/10 divide-x divide-white/10 text-[10px] md:text-xs font-bold uppercase tracking-widest bg-background-dark">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-4 flex items-center gap-2 transition-all cursor-pointer ${
                activeCategory === cat 
                ? "text-primary bg-white/5 border-b-2 border-primary" 
                : "text-slate-400 hover:bg-primary hover:text-black"
              }`}
            >
              {cat === "Show All" && (
                <span className={`size-1.5 bg-primary rounded-full ${activeCategory === cat ? 'animate-pulse' : ''}`}></span>
              )}
              {cat} {cat === "Show All" ? `[${projects.length.toString().padStart(2, '0')}]` : ""}
            </button>
          ))}
          <div className="flex-grow"></div>
          <div className="px-6 py-4 hidden lg:flex items-center gap-4 text-slate-500 border-l border-white/10">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">history</span> Last Updated: MAR 2026</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">database</span> 1.2GB Data Assets</span>
          </div>
        </section>

        {/* Projects Grid with TiltCards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-background-dark/30">
          {filteredProjects.map((project) => (
            
            <TiltCard key={project.id}>
              
              <div className="h-full border-b border-r border-white/10 p-8 flex flex-col group hover-glow transition-all duration-300 relative overflow-hidden bg-background-dark/40 backdrop-blur-sm">
                
                <div className="aspect-video bg-zinc-900 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                    src={project.image} 
                    alt={project.title}
                  />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold font-display uppercase leading-none group-hover:text-primary transition-colors">
                    {project.title.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word}{i === 1 ? <br /> : ' '}
                      </React.Fragment>
                    ))}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">{project.id}</span>
                </div>

                <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed uppercase tracking-tight">
                  {project.description}
                </p>

                <div className="mb-8">
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-3">Tech Stack_</p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 border border-white/10 text-[10px] font-bold tracking-tighter group-hover:border-primary/30 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <a 
                  href={project.sourceLink}
                  className="flex items-center justify-between border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-widest group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all"
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
            <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">GitHub</a>
            <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">LinkedIn</a>
            <a className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors" href="#">Twitter</a>
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