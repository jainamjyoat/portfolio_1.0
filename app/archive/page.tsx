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

// --- GITHUB API INTERFACE ---
interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string | null;
  updated_at: string;
  stargazers_count: number;
}

export default function ArchivePage() {
  // State for live GitHub data
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [categories, setCategories] = useState<string[]>(["Show All"]);
  const [activeCategory, setActiveCategory] = useState<string>("Show All");
  const [loading, setLoading] = useState(true);

  // --- LIVE GITHUB SYNC ---
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Fetch your public repos, sorted by most recently updated
        const response = await fetch('https://api.github.com/users/jainamjyoat/repos?sort=updated&per_page=12');
        if (!response.ok) throw new Error('Failed to fetch from GitHub API');
        const data: GitHubRepo[] = await response.json();
        
        setRepos(data);

        // Dynamically generate category filters based on the languages used in your repos
        const langs = Array.from(new Set(data.map(r => r.language).filter(Boolean))) as string[];
        setCategories(["Show All", ...langs]);

      } catch (error) {
        console.error('Error syncing with GitHub:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
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

  // Filter logic based on dynamically generated language categories
  const filteredRepos = activeCategory === "Show All" 
    ? repos 
    : repos.filter(r => r.language === activeCategory);

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
              <p className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-4 pointer-events-auto">Live Git Sync / 2026</p>
              <h1 className="text-6xl md:text-9xl font-bold font-display leading-[0.85] tracking-tighter uppercase pointer-events-auto">
                Live<br /><span className="text-primary">Archive <span className="text-4xl align-top opacity-50">[{loading ? '--' : repos.length.toString().padStart(2, '0')}]</span></span>
              </h1>
            </div>
          </div>
        </section>

        {/* Category Filter Bar (Dynamically populated from GitHub languages) */}
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
              {cat} {cat === "Show All" && !loading ? `[${repos.length.toString().padStart(2, '0')}]` : ""}
            </button>
          ))}
          <div className="flex-grow"></div>
          <div className="px-6 py-4 hidden lg:flex items-center gap-4 text-slate-500 border-l border-white/10">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">sync</span> API Status: Connected</span>
          </div>
        </section>

        {/* Loading State OR Projects Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-primary bg-background-dark/30">
            <span className="material-symbols-outlined animate-spin text-4xl">autorenew</span>
            <span className="font-mono text-xs tracking-widest uppercase">Decrypting GitHub Data...</span>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-background-dark/30">
            {filteredRepos.map((repo) => (
              
              <TiltCard key={repo.id}>
                <div className="h-full border-b border-r border-white/10 p-8 flex flex-col group hover-glow transition-all duration-300 relative overflow-hidden bg-background-dark/40 backdrop-blur-sm">
                  
                  {/* Auto-Generated OpenGraph Cover Image from GitHub */}
                  <div className="aspect-video bg-zinc-900 mb-6 overflow-hidden relative border border-white/5">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                    <img 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                      src={`https://opengraph.githubassets.com/1/jainamjyoat/${repo.name}`} 
                      alt={repo.name}
                    />
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold font-display uppercase leading-none group-hover:text-primary transition-colors pr-4">
                      {/* Formats dashes into spaces and splits to multiple lines nicely */}
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
                    {repo.description || "Experimental repository. Inspect source code for architecture details."}
                  </p>

                  <div className="mb-8">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-3">Tech Stack_</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Combines primary language and topics into one tech stack array */}
                      {[repo.language, ...repo.topics].filter(Boolean).slice(0, 4).map((tech) => (
                        <span 
                          key={tech}
                          className="px-2 py-1 border border-white/10 text-[10px] font-bold tracking-tighter uppercase group-hover:border-primary/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a 
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-widest group-hover:border-primary group-hover:bg-primary group-hover:text-black transition-all"
                  >
                    View Source Archive
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </a>
                </div>
              </TiltCard>

            ))}
          </section>
        )}
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