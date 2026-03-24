"use client";

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { GridScan } from '@/app/GridScan';
import FloatingLines from '@/components/FloatingLines';
import ScrollReveal from '@/components/ScrollReveal';
import BlockReveal from '@/components/BlockReveal';
import TransitionLink from '@/components/TransitionLink';

// Ensure GSAP knows about ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const [activeTheme, setActiveTheme] = useState<'grid' | 'lines'>('grid');
  
  // --- SECURE CONTACT FORM LOGIC ---
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // --- THE FIX: Check if the response is actually JSON before parsing ---
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned HTML instead of JSON. Check your API route path!");
      }

      const result = await response.json();

      if (response.ok && result.success) {
        setFormStatus('success');
        event.currentTarget.reset(); 
        setTimeout(() => setFormStatus('idle'), 3000);
      } else {
        console.error("Form Error:", result.message);
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };
  
  // --- ADDED LENIS SMOOTH SCROLL + GSAP SYNC ---
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.08, // The lower the number, the smoother/heavier the scroll
      smoothWheel: true,
    });

    // Sync Lenis scroll with GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Turn off GSAP's default lag smoothing to prevent stuttering with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup on unmount
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);
  // ---------------------------------------------

  return (
    <div className="bg-background-dark text-slate-100 font-sans selection:bg-primary selection:text-black">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter uppercase font-display text-primary">Jainam Jyoat</span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-12 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <a className="hover:text-primary transition-colors" href="#about">About</a>
            <a className="hover:text-primary transition-colors" href="#projects">Projects</a>
            <a className="hover:text-primary transition-colors" href="#skills">Skills</a>
            <a className="hover:text-primary transition-colors" href="#achievements">Achievements</a>
            <a className="px-6 py-2 bg-primary text-black hover:bg-white transition-all" href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        
        {/* --- DYNAMIC BACKGROUND LAYER --- */}
        <div className="absolute inset-0 z-0">
          {activeTheme === 'grid' ? (
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#392e4e"
              gridScale={0.1}
              scanColor="#FFFF00"
              scanOpacity={0.5}
              enablePost={true} 
              bloomIntensity={0.5}
              chromaticAberration={0.002}
              noiseIntensity={0.03}
            />
          ) : (
            <FloatingLines 
              enabledWaves={["top", "middle", "bottom"]}
              lineCount={5}
              lineDistance={5}
              bendRadius={5}
              bendStrength={-0.5}
              interactive={true}
              parallax={true}
              linesGradient={['#00d2ff', '#3a7bd5', '#8a2be2', '#ff0080']}
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full relative z-10 pointer-events-auto">
          {/* Left Side: Typography and Buttons */}
          <div className="pt-10">
            <p className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-6">Portfolio 2026</p>
            
            <h1 className="text-7xl md:text-[7.5rem] font-black font-display leading-[0.85] tracking-tighter uppercase mb-8 pointer-events-none">
              <span className="block text-white">Jainam</span>
              <span className="block stroke-text !text-transparent !opacity-100" style={{ WebkitTextStroke: "2px white" }}>Jyoat</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 font-light mb-12 max-w-lg leading-relaxed pointer-events-none">
              Cyber Security | Full Stack Developer.<br/>
              Building scalable web applications and exploring the intersection of AI and software engineering.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              <TransitionLink 
                href="/archive" 
                className="px-6 py-4 bg-primary text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-3"
              >
                View Projects <span className="material-symbols-outlined text-base">arrow_forward</span>
              </TransitionLink>
              
              {/* Social Links Grid */}
              <div className="flex gap-4">
                <a 
                  className="w-12 h-12 border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center outline-none" 
                  href="https://github.com/jainamjyoat" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="GitHub"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </a>

                <a 
                  className="w-12 h-12 border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center outline-none" 
                  href="https://www.linkedin.com/in/jainam-jyoat/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                <a 
                  className="w-12 h-12 border border-white/20 text-white hover:bg-white/10 transition-colors flex items-center justify-center outline-none" 
                  href="https://www.skills.google/public_profiles/5ecb2464-9f2e-42b1-93ec-73e93bcfdce8/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Google Cloud"
                >
                  <span className="material-symbols-outlined text-[20px]">cloud</span>
                </a>
              </div>
              
              <TransitionLink 
                href="/resume"
                className="px-8 py-4 h-12 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                Resume
              </TransitionLink>
            </div>
          </div>

          {/* Right Side: Profile Image */}
          <div className="flex justify-center md:justify-end pointer-events-none">
            <div className="relative p-8 inline-block pointer-events-auto">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] border-primary"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] border-primary"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-[1px] border-r-[1px] border-white/20"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[1px] border-l-[1px] border-white/20"></div>
              <div className="absolute inset-4 border border-white/10 pointer-events-none"></div>

              <div className="w-64 h-64 md:w-80 md:h-80 bg-[#cccccc] flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 relative z-10 p-4">
                <img alt="Profile photo" className="w-full h-full object-cover" src="./My_photo.png" loading="eager" />
              </div>
            </div>
          </div>
        </div>

        {/* --- THEME TOGGLE BUTTON --- */}
        <div className="absolute bottom-8 right-7 z-50 pointer-events-auto">
          <button 
            onClick={() => setActiveTheme(prev => prev === 'grid' ? 'lines' : 'grid')}
            className="group flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 px-5 py-2.5 rounded-full text-[10px] font-bold font-mono tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px] group-hover:rotate-180 transition-transform duration-500">
              change_circle
            </span>
            SWITCH THEME
          </button>
        </div>

      </section>

      {/* About Section */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden bg-background-dark/95" id="about">
        <div className="watermark absolute -left-20 top-20">PROFILE</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 mb-24 border-b border-white/10 pb-20">
            <div className="md:w-1/3">
              <BlockReveal>
                <h2 className="text-6xl md:text-8xl font-bold font-display uppercase tracking-tighter leading-none text-white">
                  About<br /><span className="text-primary italic">Me.</span>
                </h2>
              </BlockReveal>
            </div>
            <div className="md:w-2/3 flex items-center">
              <ScrollReveal
                baseOpacity={0.8}
                blurStrength={4}
                containerClassName="!my-0"
                textClassName="!text-2xl !text-slate-400 !leading-relaxed !font-light"
              >
                Passionate developer focused on creating clean, efficient, and user-centric solutions. Currently pursuing my B.Tech in Computer Science, I specialize in bridging the gap between robust back-end logic and intuitive front-end experiences.
              </ScrollReveal>
            </div>
          </div>
          
          <BlockReveal className="grid grid-cols-1 md:grid-cols-4 border border-white/10 bg-background-dark">
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-primary transition-all group cursor-default">
              <span className="material-symbols-outlined text-primary mb-8 block text-4xl group-hover:text-black">code</span>
              <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black">Full Stack</h3>
              <p className="text-sm text-slate-500 group-hover:text-black/70">Modern web technologies and frameworks.</p>
            </div>
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-primary transition-all group cursor-default">
              <span className="material-symbols-outlined text-primary mb-8 block text-4xl group-hover:text-black">psychology</span>
              <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black">AI</h3>
              <p className="text-sm text-slate-500 group-hover:text-black/70">Integrating machine learning into applications.</p>
            </div>
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/10 hover:bg-primary transition-all group cursor-default">
              <span className="material-symbols-outlined text-primary mb-8 block text-4xl group-hover:text-black">terminal</span>
              <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black">Problem Solving</h3>
              <p className="text-sm text-slate-500 group-hover:text-black/70">Deep diving into DSA and architecture.</p>
            </div>
            <div className="p-12 hover:bg-primary transition-all group cursor-default">
              <span className="material-symbols-outlined text-primary mb-8 block text-4xl group-hover:text-black">account_tree</span>
              <h3 className="text-xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black">Open Source</h3>
              <p className="text-sm text-slate-500 group-hover:text-black/70">Contributing to the global dev community.</p>
            </div>
          </BlockReveal>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-32 bg-neutral-slate border-t border-white/5 relative overflow-hidden" id="projects">
        <div className="watermark absolute -right-40 bottom-20">WORKS</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <BlockReveal className="max-w-2xl mb-24">
            <p className="text-primary font-bold tracking-[0.4em] uppercase text-sm mb-4">Selected Portfolio</p>
            <h2 className="text-6xl md:text-8xl font-bold font-display uppercase tracking-tighter leading-none text-white">
              Featured<br /><span className="text-primary italic">Projects.</span>
            </h2>
          </BlockReveal>
          
          <div className="space-y-0 border-t border-white/10">
            {/* Project 1 */}
            <BlockReveal className="group border-b border-white/10 py-20 transition-all">
              <div className="grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-2 text-6xl md:text-8xl font-black text-white/5 font-display group-hover:text-primary/10 transition-colors">01</div>
                <div className="md:col-span-5">
                  <div className="flex gap-4 mb-4">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">Freelance</span>
                    <span className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs">Commercial</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 font-display group-hover:text-primary transition-colors">Varanasi Tours India</h3>
                  
                  <p className="text-slate-400 text-lg mb-8 font-light">
                    A high-performance commercial tourism platform designed to showcase the spiritual ghats, cultural heritage, and classical music of the city. Built to drive seamless user bookings and deliver an immersive digital experience.
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">React</span>
                    <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tailwind CSS</span>
                    <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">Next.js</span>
                  </div>
                </div>
                <div className="md:col-span-5 relative">
                  <div className="aspect-video bg-neutral-slate overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img alt="Varanasi Tours website preview" className="w-full h-full object-cover" src="./VTI 1.webp" loading="lazy" />
                  </div>
                  <a className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary text-black flex items-center justify-center hover:scale-110 transition-transform" href="https://varanasitoursindia.com" target="_blank" rel="noopener noreferrer">
                    <span className="material-symbols-outlined text-3xl">arrow_outward</span>
                  </a>
                </div>
              </div>
            </BlockReveal>

            {/* Project 2 */}
            <BlockReveal className="group border-b border-white/10 py-20 transition-all">
              <div className="grid md:grid-cols-12 gap-12 items-center">
                <div className="md:col-span-2 text-6xl md:text-8xl font-black text-white/5 font-display group-hover:text-primary/10 transition-colors">02</div>
                <div className="md:col-span-5">
                  <div className="flex gap-4 mb-4">
                    <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs">NASA Space Apps Challenge</span>
                    <span className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs">hackathon</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 font-display group-hover:text-primary transition-colors">CALYX</h3>
                  <p className="text-slate-400 text-lg mb-8 font-light">Satellite data visualization tool built for tracking atmospheric changes over time, winner of global recognition.</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">JavaScript</span>
                    <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">D3.js</span>
                    <span className="px-3 py-1 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-500">Node.js</span>
                  </div>
                </div>
                <div className="md:col-span-5 relative">
                  <div className="aspect-video bg-neutral-slate overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img alt="Project preview" className="w-full h-full object-cover" src="./CALAYX.webp" loading="lazy" />
                  </div>
                  <a className="absolute -bottom-6 -right-6 w-20 h-20 bg-primary text-black flex items-center justify-center hover:scale-110 transition-transform" href="#">
                    <span className="material-symbols-outlined text-3xl">arrow_outward</span>
                  </a>
                </div>
              </div>
            </BlockReveal>
          </div>
        </div>
      </section>

      {/* Technical Skills */}
      <section className="py-32 border-t border-white/5 bg-background-dark/95" id="skills">
        <div className="max-w-7xl mx-auto px-6">
          <BlockReveal className="mb-24">
            <h2 className="text-6xl md:text-8xl font-bold font-display uppercase tracking-tighter leading-none text-white">
              Technical<br /><span className="text-primary">Mastery.</span>
            </h2>
          </BlockReveal>
          
          <BlockReveal className="grid grid-cols-1 md:grid-cols-3 gap-y-20 md:gap-x-16">
            {/* Programming */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <span className="text-primary font-black">01</span>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em]">Programming</h3>
              </div>
              <div className="space-y-8">
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">Python</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Expert</span>
                  </div>
                </div>
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">JavaScript / TS</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Advanced</span>
                  </div>
                </div>
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">C++</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Mid</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Web */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <span className="text-primary font-black">02</span>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em]">Web Stack</h3>
              </div>
              <div className="space-y-8">
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">React / Next.js</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Expert</span>
                  </div>
                </div>
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">Node / Express</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Advanced</span>
                  </div>
                </div>
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">Tailwind CSS</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Expert</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Tools */}
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                <span className="text-primary font-black">03</span>
                <h3 className="text-xs font-bold uppercase tracking-[0.4em]">Tools & DB</h3>
              </div>
              <div className="space-y-8">
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">Google Cloud</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Advanced</span>
                  </div>
                </div>
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors"> Mongo</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Advanced</span>
                  </div>
                </div>
                <div className="group border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xl font-bold font-display group-hover:text-primary transition-colors">Git / Docker</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Advanced</span>
                  </div>
                </div>
              </div>
            </div>
          </BlockReveal>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-32 border-t border-white/5 bg-background-dark relative overflow-hidden" id="achievements">
        <div className="absolute -right-20 top-20 text-[15rem] font-bold stroke-text leading-none opacity-20 pointer-events-none select-none uppercase font-display">
          Awards
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <BlockReveal className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <p className="text-primary font-bold tracking-[0.4em] uppercase text-sm mb-4">Milestones & Recognition</p>
              <h2 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-[0.85] font-display text-white">
                Proven <br />
                <span className="text-slate-500 italic">Excellence.</span>
              </h2>
            </div>
            <div className="hidden md:block">
              <span className="material-symbols-outlined text-primary text-8xl">military_tech</span>
            </div>
          </BlockReveal>
          
          <div className="border-t border-white/10">
            
            {/* Achievement Item 1 - CSE-LPU Achiever Award */}
            <BlockReveal className="achievement-row group border-b border-white/10 py-16 transition-all cursor-pointer hover:bg-white/[0.02]">
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7403129359298928640/?updateEntityUrn=urn%3Ali%3Afs_updateV2%3A%28urn%3Ali%3Aactivity%3A7403129359298928640%2CFEED_DETAIL%2CEMPTY%2CDEFAULT%2Cfalse%29" target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row gap-12 items-start w-full outline-none">
                <div className="achievement-year transition-all duration-300 md:w-1/4 text-7xl md:text-9xl tracking-tighter font-black text-white/5 font-display group-hover:text-primary/10">
                  '26
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h3 className="achievement-title text-3xl md:text-5xl font-bold text-slate-300 transition-colors duration-300 group-hover:text-primary font-display">
                      CSE-LPU Achiever Award
                    </h3>
                    <span className="px-4 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest h-fit w-fit">
                      Edu Revolution
                    </span>
                  </div>
                  <p className="text-xl text-slate-500 max-w-3xl leading-relaxed group-hover:text-slate-300 transition-colors font-light">
                    Honored with the prestigious Achiever Award, representing the lived reality of the Edu Revolution. Recognized for exceptional grit, unstoppable ambition, and pushing the definition of academic and technological excellence to new heights.
                  </p>
                </div>
                <div className="md:w-12 flex justify-end">
                  <span className="material-symbols-outlined text-slate-800 group-hover:text-primary transition-all group-hover:translate-x-2 text-4xl">arrow_outward</span>
                </div>
              </a>
            </BlockReveal>

            {/* Achievement Item 2 - NASA Space Apps */}
            <BlockReveal className="achievement-row group border-b border-white/10 py-16 transition-all cursor-pointer hover:bg-white/[0.02]">
              <a href="https://www.spaceappschallenge.org/2025/find-a-team/kaalnetra/" target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row gap-12 items-start w-full outline-none">
                <div className="achievement-year transition-all duration-300 md:w-1/4 text-7xl md:text-9xl tracking-tighter font-black text-white/5 font-display group-hover:text-primary/10">
                  '25
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h3 className="achievement-title text-3xl md:text-5xl font-bold text-slate-300 transition-colors duration-300 group-hover:text-primary font-display">
                      NASA Space Apps Challenge
                    </h3>
                    <span className="px-4 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest h-fit w-fit">
                      Global Honorable Mention
                    </span>
                  </div>
                  <p className="text-xl text-slate-500 max-w-3xl leading-relaxed group-hover:text-slate-300 transition-colors font-light">
                    Awarded Global Honorable Mention (Top 23 out of 11,500+ projects globally) for building an AI Computer Vision system for Plant Phenology State Detection.
                  </p>
                </div>
                <div className="md:w-12 flex justify-end">
                  <span className="material-symbols-outlined text-slate-800 group-hover:text-primary transition-all group-hover:translate-x-2 text-4xl">arrow_outward</span>
                </div>
              </a>
            </BlockReveal>

            {/* Achievement Item 3 - Innov-a-thon */}
            <BlockReveal className="achievement-row group border-b border-white/10 py-16 transition-all cursor-pointer hover:bg-white/[0.02]">
              <a href="https://unstop.com/certificate-preview/7757a769-9abe-4b7c-88c8-099864fbc965" target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row gap-12 items-start w-full outline-none">
                <div className="achievement-year transition-all duration-300 md:w-1/4 text-7xl md:text-9xl tracking-tighter font-black text-white/5 font-display group-hover:text-primary/10">
                  '25
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <h3 className="achievement-title text-3xl md:text-5xl font-bold text-slate-300 transition-colors duration-300 group-hover:text-primary font-display">
                      Innov-a-thon (NIT Rourkela)
                    </h3>
                    <span className="px-4 py-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest h-fit w-fit">
                      Top 100 in India
                    </span>
                  </div>
                  <p className="text-xl text-slate-500 max-w-3xl leading-relaxed group-hover:text-slate-300 transition-colors font-light">
                    Ranked among the Top 100 teams in India for developing the "AI Marketplace Assistant", leveraging AI for smart customer-seller engagement, tailored recommendations, and dynamic marketplace analytics.
                  </p>
                </div>
                <div className="md:w-12 flex justify-end">
                  <span className="material-symbols-outlined text-slate-800 group-hover:text-primary transition-all group-hover:translate-x-2 text-4xl">arrow_outward</span>
                </div>
              </a>
            </BlockReveal>

          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-32 border-t border-white/5 bg-neutral-slate/80 relative overflow-hidden" id="certifications">
        <div className="watermark absolute -left-20 top-40 uppercase">Verified</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <BlockReveal className="mb-24">
            <p className="text-primary font-bold tracking-[0.4em] uppercase text-sm mb-4">Professional Growth</p>
            <h2 className="text-6xl md:text-8xl font-bold font-display uppercase tracking-tighter leading-none text-white">
              Academic<br /><span className="text-primary italic">Certificates.</span>
            </h2>
          </BlockReveal>
          
          <BlockReveal className="grid grid-cols-1 md:grid-cols-4 border-t border-white/10 bg-background-dark">
            
            {/* Certificate 1 */}
            <a href="YOUR_TATA_LINK_HERE" target="_blank" rel="noopener noreferrer" className="block p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-primary transition-all cursor-pointer outline-none">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-4xl font-black text-white/5 font-display group-hover:text-black/10 mb-8 transition-colors">01</div>
                  <h3 className="text-2xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black leading-tight">Cybersecurity Analyst</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-black/70 mb-8">Tata • Sep 2025</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-black transition-colors mt-8">
                  View Certificate
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </a>

            {/* Certificate 2 */}
            <a href="YOUR_GOOGLE_LINK_HERE" target="_blank" rel="noopener noreferrer" className="block p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-primary transition-all cursor-pointer outline-none">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-4xl font-black text-white/5 font-display group-hover:text-black/10 mb-8 transition-colors">02</div>
                  <h3 className="text-2xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black leading-tight">Assets, Threats & Vulnerabilities</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-black/70 mb-8">Google • Jun 2024</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-black transition-colors mt-8">
                  View Certificate
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </a>


            {/* Certificate 3 */}
            <a href="YOUR_GCP_LINK_HERE" target="_blank" rel="noopener noreferrer" className="block p-12 group hover:bg-primary transition-all cursor-pointer outline-none">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-4xl font-black text-white/5 font-display group-hover:text-black/10 mb-8 transition-colors">03</div>
                  <h3 className="text-2xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black leading-tight">Google Cloud Associate</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-black/70 mb-8">Google • 2024</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-black transition-colors mt-8">
                  View Certificate
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </a>

            
            {/* Certificate 4 */}
            <a href="YOUR_JPMORGAN_LINK_HERE" target="_blank" rel="noopener noreferrer" className="block p-12 border-b md:border-b-0 md:border-r border-white/10 group hover:bg-primary transition-all cursor-pointer outline-none">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="text-4xl font-black text-white/5 font-display group-hover:text-black/10 mb-8 transition-colors">04</div>
                  <h3 className="text-2xl font-bold mb-4 font-display uppercase tracking-tight group-hover:text-black leading-tight">Software Engineering Simulation</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-black/70 mb-8">JPMorgan Chase & Co. • Dec 2023</p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-black transition-colors mt-8">
                  View Certificate
                  <span className="material-symbols-outlined text-sm">arrow_outward</span>
                </div>
              </div>
            </a>

          </BlockReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden bg-background-dark/95" id="contact">
        <div className="watermark absolute -left-20 bottom-20">CONNECT</div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-24">
            <div>
              <BlockReveal className="mb-10">
                <h2 className="text-6xl md:text-8xl font-bold font-display uppercase tracking-tighter leading-none text-white">
                  Let's<br /><span className="text-primary italic">Talk.</span>
                </h2>
              </BlockReveal>
              
              <ScrollReveal
                baseOpacity={0.1}
                blurStrength={4}
                containerClassName="!my-0 !mb-12"
                textClassName="!text-slate-400 !text-xl !font-light !leading-relaxed"
              >
                I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
              </ScrollReveal>

              <BlockReveal className="space-y-8">
                <a className="flex items-center gap-6 text-slate-300 hover:text-primary transition-colors group" href="mailto:jainamjyoaat2005@gmail.com">
                  <span className="material-symbols-outlined p-5 bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors text-3xl">mail</span>
                  <span className="text-lg font-bold font-display uppercase tracking-widest">jainamjyoaat2005@gmail.com</span>
                </a>
                <a className="flex items-center gap-6 text-slate-300 hover:text-primary transition-colors group" href="https://www.linkedin.com/in/jainam-jyoat/" target="_blank" rel="noopener noreferrer">
                  <div className="p-5 bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors flex items-center justify-center">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
                  </div>
                  <span className="text-lg font-bold font-display uppercase tracking-widest">LinkedIn /jainam-jyoat</span>
                </a>
                <a className="flex items-center gap-6 text-slate-300 hover:text-primary transition-colors group" href="https://github.com/jainamjyoat" target="_blank" rel="noopener noreferrer">
                  <div className="p-5 bg-white/5 group-hover:bg-primary group-hover:text-black transition-colors flex items-center justify-center">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg>
                  </div>
                  <span className="text-lg font-bold font-display uppercase tracking-widest">GitHub /jainamjyoat</span>
                </a>
              </BlockReveal>
            </div>
            
            <BlockReveal className="relative p-12 bg-white/[0.02] border border-white/10">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary"></div>
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Name</label>
                    <input 
                      name="name" 
                      required 
                      className="w-full bg-transparent border-b border-white/20 px-0 py-4 focus:outline-none focus:border-primary transition-colors text-white font-display text-lg" 
                      placeholder="Jainam Jyoat" 
                      type="text" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Email</label>
                    <input 
                      name="email" 
                      required 
                      className="w-full bg-transparent border-b border-white/20 px-0 py-4 focus:outline-none focus:border-primary transition-colors text-white font-display text-lg" 
                      placeholder="hello@jainam.dev" 
                      type="email" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Message</label>
                  <textarea 
                    name="message" 
                    required 
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 focus:outline-none focus:border-primary transition-colors resize-none text-white font-display text-lg" 
                    placeholder="How can I help you?" 
                    rows={4}
                  ></textarea>
                </div>
                
                {/* Dynamic Submit Button */}
                <button 
                  disabled={formStatus === 'submitting' || formStatus === 'success'}
                  className={`w-full py-6 font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 text-sm ${
                    formStatus === 'success' ? 'bg-green-500 text-black border border-green-500' : 
                    formStatus === 'error' ? 'bg-red-500 text-white border border-red-500' :
                    formStatus === 'submitting' ? 'bg-white/20 text-white cursor-wait' :
                    'bg-primary text-black hover:bg-white'
                  }`} 
                  type="submit"
                >
                  {formStatus === 'submitting' ? 'Sending...' : 
                   formStatus === 'success' ? 'Message Sent!' : 
                   formStatus === 'error' ? 'Error. Try Again.' : 
                   'Send Message'}
                   
                  {formStatus === 'idle' && <span className="material-symbols-outlined">send</span>}
                  {formStatus === 'success' && <span className="material-symbols-outlined">check_circle</span>}
                  {formStatus === 'error' && <span className="material-symbols-outlined">error</span>}
                </button>
              </form>
            </BlockReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-2xl font-black font-display text-primary">Jainam Jyoat</div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">
            © 2026 Jainam Jyoat. All Rights Reserved.
          </p>
          <div className="flex gap-10 text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
            <a className="hover:text-primary transition-colors" href="https://github.com/jainamjyoat" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="hover:text-primary transition-colors" href="https://www.linkedin.com/in/jainam-jyoat/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}