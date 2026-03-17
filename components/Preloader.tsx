"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  // If the site already booted in this session, skip the preloader entirely
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('siteBooted');
    } catch (e) {
      return true;
    }
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); 
  const layer2Ref = useRef<HTMLDivElement>(null); 
  const layer3Ref = useRef<HTMLDivElement>(null); 
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldRender) return; // Don't run the boot sequence if we've already booted

    // mark site as booted so subsequent navigations won't show the preloader
    try {
      sessionStorage.setItem('siteBooted', '1');
    } catch (e) {}

    document.body.style.overflow = 'hidden';

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 1; 
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);
        
        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              document.body.style.overflow = ''; 
              if (containerRef.current) containerRef.current.style.display = 'none'; 
              setShouldRender(false);
            }
          });

          // 1. Terminal text fades and slides up
          tl.to(textRef.current, { 
              y: -50, 
              opacity: 0, 
              duration: 0.5, 
              ease: "expo.in" 
            })
            // 2. Peel away the Dark Terminal (Revealing the big SYSTEM_READY text)
            .to(layer3Ref.current, { 
              yPercent: -100, 
              duration: 0.85, 
              ease: "expo.inOut" 
            }, "+=0.1")
            
            // 3. THE FIX: Hold the Yellow ribbon on screen for 0.8 seconds before peeling!
            .to(layer2Ref.current, { 
              yPercent: -100, 
              duration: 0.85, 
              ease: "expo.inOut" 
            }, "+=0.55") // Changed from -=0.65 to +=0.8
            
            // 4. Peel away the Slate Ribbon right behind the Yellow one
            .to(layer1Ref.current, { 
              yPercent: -100, 
              duration: 0.85, 
              ease: "expo.inOut" 
            }, "-=0.65");
            
        }, 800);

      } else {
        setProgress(currentProgress);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [shouldRender]);

  if (!shouldRender) return null;

  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const progressBar = `[${'|'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* LAYER 1: Slate Ribbon */}
      <div 
        ref={layer1Ref} 
        className="absolute inset-0 w-full h-full bg-slate-800 will-change-transform z-10" 
      />
      
      {/* LAYER 2: Primary Yellow Ribbon WITH MASSIVE TEXT */}
      <div 
        ref={layer2Ref} 
        className="absolute inset-0 w-full h-full bg-primary flex flex-col items-center justify-center will-change-transform z-20" 
      >
        <div className="overflow-hidden flex flex-col items-center">
          <span className="block text-black font-display font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter">
            SYSTEM_READY_
          </span>
          <span className="block text-black/60 font-mono text-xs md:text-sm font-bold tracking-[0.3em] mt-4 text-center">
            ACCESS GRANTED TO JAINAM.DEV
          </span>
        </div>
      </div>
      
      {/* LAYER 3: Dark Terminal (Top Layer) */}
      <div 
        ref={layer3Ref} 
        className="absolute inset-0 w-full h-full bg-background-dark flex flex-col items-center justify-center will-change-transform z-30"
      >
        <div ref={textRef} className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-pulse">terminal</span>
          <p className="text-primary font-mono text-sm tracking-widest whitespace-pre">
            {progressBar} {progress.toString().padStart(3, '0')}%
          </p>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase mt-2 animate-pulse">
            Booting WebGL Engine...
          </p>
        </div>
      </div>
    </div>
  );
}