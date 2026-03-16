"use client";

import React, { useEffect } from 'react';
import TransitionLink from '@/components/TransitionLink';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP ScrollTrigger to ensure they sync properly
gsap.registerPlugin(ScrollTrigger);

export default function ResumePage() {

  // --- 1. THE SMOOTH SCROLL ENGINE (LENIS) ---
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08, // The "heaviness" of the scroll smoothing
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

  // --- 2. THE ENTRANCE ANIMATION ENGINE ---
  useEffect(() => {
    // Check if we need to wait for the long Preloader, or just the quick TransitionLink
    const isFirstLoad = !sessionStorage.getItem('siteBooted');
    const delayTime = isFirstLoad ? 2.2 : 0.6;

    // Grab everything with the "reveal-up" class and stagger it in
    gsap.fromTo(".reveal-up", 
      { y: 60, opacity: 0 }, 
      { 
        y: 0, 
        opacity: 1, 
        duration: 1, 
        stagger: 0.1, 
        ease: "expo.out", 
        delay: delayTime 
      }
    );
  }, []);

  return (
    <div className="bg-background-dark font-sans text-slate-100 min-h-screen selection:bg-primary selection:text-black overflow-hidden">
      
      {/* Top Navigation / Header Section */}
      <header className="border-b border-white/10 px-6 py-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 reveal-up">
            <span className="tracking-[0.2em] uppercase text-primary text-xs font-bold font-display">
              Software Engineer Portfolio
            </span>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white font-display">
              JAINAM <span className="text-primary">JYOAT</span>
            </h1>
            
            <div className="flex flex-wrap gap-4 pt-4 text-sm text-slate-400">
              <a className="hover:text-primary transition-colors flex items-center gap-1" href="mailto:jainamjyoat2005@gmail.com">
                <span className="material-symbols-outlined text-sm">mail</span> jainamjyoat2005@gmail.com
              </a>
              <span className="opacity-30">/</span>
              <a className="hover:text-primary transition-colors flex items-center gap-1" href="tel:+916395133005">
                <span className="material-symbols-outlined text-sm">call</span> +91-6395133005
              </a>
              <span className="opacity-30">/</span>
              <a className="hover:text-primary transition-colors flex items-center gap-1" href="https://linkedin.com/in/jainam-jyoat/" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-sm">link</span> LinkedIn
              </a>
              <span className="opacity-30">/</span>
              <a className="hover:text-primary transition-colors flex items-center gap-1" href="https://github.com/jainamjyoat" target="_blank" rel="noopener noreferrer">
                <span className="material-symbols-outlined text-sm">code</span> GitHub
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 reveal-up">
            <TransitionLink 
              href="/" 
              className="border border-primary text-primary hover:bg-primary hover:text-black transition-colors font-bold px-6 py-3 flex items-center justify-center gap-2 font-display text-xs uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Portfolio
            </TransitionLink>
            
            <a 
              href="/resume.pdf" 
              download
              className="bg-primary text-black font-bold px-8 py-3 flex items-center justify-center gap-2 hover:bg-white transition-colors font-display text-sm uppercase tracking-widest"
            >
              DOWNLOAD PDF
              <span className="material-symbols-outlined">download</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-16">
            <section className="reveal-up">
              <h2 className="tracking-[0.2em] uppercase text-primary text-xs font-bold mb-6 flex items-center gap-2 font-display">
                <span className="w-8 h-[1px] bg-primary"></span> Tech Stack
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Languages</p>
                  <p className="text-white font-medium">Python, JavaScript, C, HTML5</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Frameworks</p>
                  <p className="text-white font-medium">Next.js, Tailwind CSS</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Tools / Platforms</p>
                  <p className="text-white font-medium">MySQL, Git</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Soft Skills</p>
                  <p className="text-white font-medium">Problem-Solving, Team Management, Time Management, Adaptability</p>
                </div>
              </div>
            </section>

            <section className="reveal-up">
              <h2 className="tracking-[0.2em] uppercase text-primary text-xs font-bold mb-6 flex items-center gap-2 font-display">
                <span className="w-8 h-[1px] bg-primary"></span> Education
              </h2>
              <div className="space-y-8">
                <div className="border-l-2 border-primary pl-6 py-2">
                  <h3 className="text-xl font-bold text-white leading-tight font-display">Lovely Professional University</h3>
                  <p className="text-slate-400 text-sm">B.Tech in Computer Science & Engineering</p>
                  <p className="text-slate-500 text-xs mt-1">Phagwara, Punjab</p>
                  <p className="text-primary text-sm font-bold mt-2">Apr' 23 — Present <span className="text-white ml-2">• CGPA: 7.02</span></p>
                </div>
                <div className="border-l-2 border-white/20 pl-6 py-2">
                  <h3 className="text-xl font-bold text-white leading-tight font-display">Shri Aurobindo Public School</h3>
                  <p className="text-slate-400 text-sm">Intermediate</p>
                  <p className="text-slate-500 text-xs mt-1">Baddi, Himachal Pradesh</p>
                  <p className="text-primary text-sm font-bold mt-2">Apr' 22 — Mar' 23 <span className="text-white ml-2">• Percentage: 80</span></p>
                </div>
                <div className="border-l-2 border-white/20 pl-6 py-2">
                  <h3 className="text-xl font-bold text-white leading-tight font-display">Amenity Public School</h3>
                  <p className="text-slate-400 text-sm">Matriculation</p>
                  <p className="text-slate-500 text-xs mt-1">Rudrapur, Uttarakhand</p>
                  <p className="text-primary text-sm font-bold mt-2">Apr' 20 — Mar' 21 <span className="text-white ml-2">• Percentage: 89</span></p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-8 space-y-16">
            <section className="reveal-up">
              <h2 className="tracking-[0.2em] uppercase text-primary text-xs font-bold mb-8 flex items-center gap-2 font-display">
                <span className="w-8 h-[1px] bg-primary"></span> Experience
              </h2>
              <div className="space-y-12">
                <div className="group relative pb-12 border-b border-white/10">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors font-display">UI / UX Intern</h3>
                      <p className="text-slate-400 font-medium text-lg">
                        Sucantis Biotech Pvt. Ltd. | 
                        <a className="text-primary text-sm underline ml-1" href="#" target="_blank" rel="noopener noreferrer">Link</a>
                      </p>
                    </div>
                    <span className="text-primary font-mono text-sm mt-1 md:mt-0">JUN' 25 — JUL' 25</span>
                  </div>
                  <ul className="space-y-3 text-slate-400 list-none mb-6">
                    <li className="flex gap-3"><span className="text-primary">/</span><span>Achieved hands-on industry exposure to understand real-world UI/UX design workflows and standards.</span></li>
                    <li className="flex gap-3"><span className="text-primary">/</span><span>Completed industrial training involving wireframing, interface design, usability practices, and assigned design tasks.</span></li>
                    <li className="flex gap-3"><span className="text-primary">/</span><span>Developed practical UI/UX skills, improved design thinking, and demonstrated strong professional work ethic.</span></li>
                  </ul>
                  <p className="text-xs text-slate-500 uppercase tracking-widest"><span className="text-white font-bold">TECH USED:</span> FIGMA, ADOBE XD, HTML, CSS, JAVASCRIPT, UI/UX PROTOTYPING, WIREFRAMING AND USER RESEARCH.</p>
                </div>

                <div className="group relative pb-12 border-b border-white/10">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors font-display">Cyber Security Intern</h3>
                      <p className="text-slate-400 font-medium text-lg">
                        Threat Prism | 
                        <a className="text-primary text-sm underline ml-1" href="#" target="_blank" rel="noopener noreferrer">Link</a>
                      </p>
                    </div>
                    <span className="text-primary font-mono text-sm mt-1 md:mt-0">MAR' 24 — APR' 24</span>
                  </div>
                  <ul className="space-y-3 text-slate-400 mb-6">
                    <li className="flex gap-3"><span className="text-primary">/</span><span>Gained practical exposure to real-world cyber security and ethical hacking practices.</span></li>
                    <li className="flex gap-3"><span className="text-primary">/</span><span>Accomplished an internship covering ethical hacking fundamentals, security concepts, and hands-on cyber security activities.</span></li>
                    <li className="flex gap-3"><span className="text-primary">/</span><span>Advanced foundational cyber security skills and demonstrated dedication, diligence, and professional discipline.</span></li>
                  </ul>
                  <p className="text-xs text-slate-500 uppercase tracking-widest"><span className="text-white font-bold">TECH USED:</span> KALI LINUX, WIRESHARK, METASPLOIT, BURP SUITE, NMAP, PYTHON, NETWORK SECURITY AND VULNERABILITY ASSESSMENT.</p>
                </div>
              </div>
            </section>

            <section className="reveal-up">
              <h2 className="tracking-[0.2em] uppercase text-primary text-xs font-bold mb-8 flex items-center gap-2 font-display">
                <span className="w-8 h-[1px] bg-primary"></span> Selected Projects
              </h2>
              <div className="space-y-8">
                
                <div className="p-8 bg-white/5 border border-white/10 group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] bg-primary text-black px-2 py-0.5 font-bold">OCT' 25</span>
                        <TransitionLink href="/archive" className="text-primary text-[10px] font-bold underline">
                          VIEW ARCHIVE
                        </TransitionLink>
                      </div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors font-display">Calyx</h3>
                      <p className="text-slate-400 text-sm mt-1">An Earth Observation Application for Global Flowering Phenology</p>
                    </div>
                    <span className="material-symbols-outlined text-white group-hover:text-primary transition-transform group-hover:rotate-45">north_east</span>
                  </div>
                  <ul className="space-y-2 text-slate-400 text-sm mb-6">
                    <li>• Achieved an interactive web application for detecting plant phenology states to support botanical studies and field data analysis.</li>
                    <li>• Developed core features including map, machine learning inference, and state prediction using computer vision/model integration.</li>
                    <li>• Delivered a functional and user-friendly tool that enables accurate phenology classification and facilitates research insights.</li>
                  </ul>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">NEXT.JS</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">TYPESCRIPT</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">PYTHON</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">MACHINE LEARNING</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">DOCKER</span>
                  </div>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 group relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] bg-primary text-black px-2 py-0.5 font-bold">OCT' 25</span>
                        <TransitionLink href="/archive" className="text-primary text-[10px] font-bold underline">
                          VIEW ARCHIVE
                        </TransitionLink>
                      </div>
                      <h3 className="text-3xl font-bold text-white group-hover:text-primary transition-colors font-display">UrbanSwap</h3>
                      <p className="text-slate-400 text-sm mt-1">AI-Powered Marketplace Assistant for Local Artisans</p>
                    </div>
                    <span className="material-symbols-outlined text-white group-hover:text-primary transition-transform group-hover:rotate-45">north_east</span>
                  </div>
                  <ul className="space-y-2 text-slate-400 text-sm mb-6">
                    <li>• Created an AI-driven marketplace assistant to streamline user discovery and recommendation of AI tools and services.</li>
                    <li>• Matured core functionality including intelligent search, context-aware suggestions, and responsive UI with backend integration.</li>
                    <li>• Provided a user-friendly assistant that enhances tool exploration and improves user engagement across AI offerings.</li>
                  </ul>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">REACT.JS</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">FLASK</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">GCP</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">DIALOGFLOW</span>
                    <span className="px-2 py-1 border border-white/20 text-[10px] text-slate-300">VERTEX AI</span>
                  </div>
                </div>

              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              <section className="reveal-up">
                <h2 className="tracking-[0.2em] uppercase text-primary text-xs font-bold mb-8 flex items-center gap-2 font-display">
                  <span className="w-8 h-[1px] bg-primary"></span> Certifications
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 hover:border-primary transition-colors group cursor-default">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-black font-bold">verified_user</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-snug group-hover:text-primary transition-colors">Cybersecurity Analyst</h4>
                      <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-medium">Tata • SEP' 25</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 hover:border-primary transition-colors group cursor-default">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-black font-bold">security</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-snug group-hover:text-primary transition-colors">Assets, Threats, and Vulnerabilities</h4>
                      <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-medium">Google • JUN' 24</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 hover:border-primary transition-colors group cursor-default">
                    <div className="w-10 h-10 flex-shrink-0 bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-black font-bold">terminal</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-snug group-hover:text-primary transition-colors">Software Engineering Simulation</h4>
                      <p className="text-slate-400 text-xs mt-1 uppercase tracking-wider font-medium">JPMorgan Chase & Co. • DEC' 23</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="reveal-up">
                <h2 className="tracking-[0.2em] uppercase text-primary text-xs font-bold mb-8 flex items-center gap-2 font-display">
                  <span className="w-8 h-[1px] bg-primary"></span> Achievements
                </h2>
                <div className="space-y-10">
                  <div className="relative group cursor-default">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase font-display">Global Honorable Mention</span>
                      <span className="text-slate-500 text-[10px] font-bold font-mono">NOV' 25</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-none tracking-tighter mb-4 font-display group-hover:text-primary transition-colors italic">NASA Space Apps Challenge 2025</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md">Top 23 teams globally from 11,500+ projects submitted worldwide.</p>
                    <div className="w-full h-[1px] bg-white/10 mt-8"></div>
                  </div>
                  <div className="relative group cursor-default">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase font-display">Top 100 Teams (India)</span>
                      <span className="text-slate-500 text-[10px] font-bold font-mono">NOV' 25</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white leading-none tracking-tighter mb-4 font-display group-hover:text-primary transition-colors italic">Innov-a-thon 2025</h3>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md">Prestigious national level innovation challenge organized by NIT Rourkela.</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t border-white/10 py-12 px-6 md:px-12 lg:px-24 reveal-up">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-50 text-white">
          <p className="text-xs uppercase tracking-widest">© 2026 JAINAM JYOAT — FULL STACK DEVELOPER</p>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest font-display">
            <TransitionLink href="/" className="hover:text-primary transition-colors">Home</TransitionLink>
            <a className="hover:text-primary transition-colors" href="https://linkedin.com/in/jainam-jyoat/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="hover:text-primary transition-colors" href="https://github.com/jainamjyoat" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}