"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null); 
  const layer2Ref = useRef<HTMLDivElement>(null); 
  const layer3Ref = useRef<HTMLDivElement>(null); 
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock the screen scroll while booting
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
            }
          });

          // 1. Terminal text fades and slides up
          tl.to(textRef.current, { y: -50, opacity: 0, duration: 0.5, ease: "expo.in" })
            // 2. Peel away the Dark Terminal
            .to(layer3Ref.current, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "+=0.1")
            // 3. Hold the Yellow ribbon for 0.8 seconds
            .to(layer2Ref.current, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "+=0.8") 
            // 4. Peel away the Slate Ribbon
            .to(layer1Ref.current, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "-=0.65");
            
        }, 800);

      } else {
        setProgress(currentProgress);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // --- DYNAMIC TEXT BASED ON URL ---
  let readyText = "SYSTEM_READY_";
  let subText = "ACCESS GRANTED TO JAINAM.DEV";
  let terminalText = "Booting WebGL Engine...";
  
  if (pathname === '/resume') {
    readyText = "PROFESSIONAL_DOSSIER_";
    subText = "LOADING CAREER HISTORY...";
    terminalText = "Compiling Resume Data...";
  } else if (pathname === '/archive') {
    readyText = "ARCHIVE_INDEX_";
    subText = "LOADING PROJECT ARCHIVE...";
    terminalText = "Accessing Archive Server...";
  }

  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const progressBar = `[${'|'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      
      {/* LAYER 1: Slate Ribbon */}
      <div ref={layer1Ref} className="absolute inset-0 w-full h-full bg-slate-800 will-change-transform z-10" />
      
      {/* LAYER 2: Primary Yellow Ribbon */}
      <div ref={layer2Ref} className="absolute inset-0 w-full h-full bg-primary flex flex-col items-center justify-center will-change-transform z-20">
        <div className="overflow-hidden flex flex-col items-center">
          <span className="block text-black font-display font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-center">
            {readyText}
          </span>
          <span className="block text-black/60 font-mono text-xs md:text-sm font-bold tracking-[0.3em] mt-4 text-center">
            {subText}
          </span>
        </div>
      </div>
      
      {/* LAYER 3: Dark Terminal */}
      <div ref={layer3Ref} className="absolute inset-0 w-full h-full bg-background-dark flex flex-col items-center justify-center will-change-transform z-30">
        <div ref={textRef} className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-pulse">terminal</span>
          <p className="text-primary font-mono text-sm tracking-widest whitespace-pre">
            {progressBar} {progress.toString().padStart(3, '0')}%
          </p>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase mt-2 animate-pulse">
            {terminalText}
          </p>
        </div>
      </div>
    </div>
  );
}