"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 12) + 1; // Random jumps for realism
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(interval);
        
        // GSAP Animation to reveal the site
        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = ''; // Restore scrolling
          }
        });

        tl.to(textRef.current, { opacity: 0, duration: 0.2 })
          .to(containerRef.current, { 
            yPercent: -100, 
            duration: 0.8, 
            ease: "power4.inOut" 
          });
      } else {
        setProgress(currentProgress);
      }
    }, 60); // Speed of the loading counter

    return () => clearInterval(interval);
  }, []);

  // Create a cool visual progress bar [|||||     ]
  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const progressBar = `[${'|'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[9999] bg-background-dark flex flex-col items-center justify-center pointer-events-none"
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
  );
}