"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Layer Refs
  const layer1Ref = useRef<HTMLDivElement>(null); // Slate Ribbon
  const layer2Ref = useRef<HTMLDivElement>(null); // Zinc Ribbon
  const layer3Ref = useRef<HTMLDivElement>(null); // Yellow HUD Ribbon
  const layer4Ref = useRef<HTMLDivElement>(null); // Dark Terminal Layer
  
  // Element Refs
  const terminalWrapper = useRef<HTMLDivElement>(null);
  const textNode = useRef<HTMLSpanElement>(null);
  const subTextNode = useRef<HTMLSpanElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const progressWrapperRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // HUD Corner Refs
  const cornerTL = useRef<HTMLDivElement>(null);
  const cornerTR = useRef<HTMLDivElement>(null);
  const cornerBL = useRef<HTMLDivElement>(null);
  const cornerBR = useRef<HTMLDivElement>(null);

  // --- DYNAMIC TEXT BASED ON URL ---
  let readyText = "SYSTEM_READY_";
  let finalSubText = "ACCESS GRANTED TO JAINAM.DEV";
  let terminalText = "Booting WebGL Engine...";
  
  if (pathname === '/resume') {
    readyText = "PROFESSIONAL_DOSSIER_";
    finalSubText = "LOADING CAREER HISTORY...";
    terminalText = "Compiling Resume Data...";
  } else if (pathname === '/archive') {
    readyText = "ARCHIVE_INDEX_";
    finalSubText = "LOADING PROJECT ARCHIVE...";
    terminalText = "Accessing Archive Server...";
  }

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
        
        // Wait a tiny bit at 100% so the user registers the completion
        setTimeout(() => {
          const tl = gsap.timeline({
            onComplete: () => {
              document.body.style.overflow = ''; 
              if (containerRef.current) containerRef.current.style.display = 'none'; 
            }
          });

          const easeSlide = "expo.inOut";
          const easeText = "expo.out";

          // Initial setup for the HUD elements
          gsap.set([textNode.current, subTextNode.current, ballRef.current, progressWrapperRef.current], { y: 40, opacity: 0 });
          gsap.set([cornerTL.current, cornerTR.current, cornerBL.current, cornerBR.current], { scale: 0.8, opacity: 0 });

          // 1. Terminal text fades and slides up slightly
          tl.to(terminalWrapper.current, { y: -40, opacity: 0, duration: 0.5, ease: "expo.in" })
            
            // 2. Peel away the Dark Terminal to reveal the Yellow HUD
            .to(layer4Ref.current, { yPercent: -100, duration: 0.8, ease: easeSlide })
            
            // 3. Animate HUD elements IN (Cascading)
            .to([textNode.current, subTextNode.current, ballRef.current, progressWrapperRef.current], 
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: easeText }, 
              "-=0.45"
            )
            
            // Snap corners and fill the loading rail
            .to([cornerTL.current, cornerTR.current, cornerBL.current, cornerBR.current], 
              { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 
              "-=0.5"
            )
            .to(progressBarRef.current, { scaleX: 1, duration: 0.7, ease: "power4.inOut" }, "-=0.6")

            // 4. Transform text to "ACCESS GRANTED"
            .add(() => {
              if (subTextNode.current) {
                subTextNode.current.innerText = finalSubText;
                subTextNode.current.classList.remove("text-black/60");
                subTextNode.current.classList.add("text-black");
              }
            }, "+=0.1")

            // Pause so the user can read it
            .to({}, { duration: 1.0 })

            // 5. Blast the HUD elements away
            .to([cornerTL.current, cornerTR.current, cornerBL.current, cornerBR.current], 
              { scale: 1.2, opacity: 0, duration: 0.4, ease: "expo.in" }
            )
            .to([textNode.current, subTextNode.current, ballRef.current, progressWrapperRef.current], 
              { y: -40, opacity: 0, duration: 0.4, stagger: 0.05, ease: "expo.in" }, 
              "<"
            )
            
            // 6. Final Cascading Slide Out
            .to(layer3Ref.current, { yPercent: -100, duration: 0.8, ease: easeSlide }, "-=0.1")
            .to(layer2Ref.current, { yPercent: -100, duration: 0.8, ease: easeSlide }, "-=0.65")
            .to(layer1Ref.current, { yPercent: -100, duration: 0.8, ease: easeSlide }, "-=0.65");
            
        }, 400);

      } else {
        setProgress(currentProgress);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [finalSubText]);

  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const emptyLength = barLength - filledLength;
  const progressBarText = `[${'|'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      
      {/* 3D Orb CSS injected cleanly into the component (ZERO design changes made to the ball) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rotateBall { 0% { transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg); } 50% { transform: rotateY(360deg) rotateX(360deg) rotateZ(0deg); } 100% { transform: rotateY(720deg) rotateX(720deg) rotateZ(360deg); } }
        @keyframes bounceBall { 0% { transform: translateY(-25px) scale(1, 1); } 15% { transform: translateY(-15px) scale(1, 1); } 45% { transform: translateY(65px) scale(1, 1); } 50% { transform: translateY(70px) scale(1, 0.92); } 55% { transform: translateY(65px) scale(1, 0.95); } 85% { transform: translateY(-15px) scale(1, 1); } 95% { transform: translateY(-25px) scale(1, 1); } 100% { transform: translateY(-25px) scale(1, 1); } }
        @keyframes bounceShadow { 0% { filter: blur(3px); opacity: 0.6; transform: translateY(70px) scale(0.5, 0.5); } 45% { filter: blur(1px); opacity: 0.9; transform: translateY(70px) scale(1, 1); } 55% { filter: blur(1px); opacity: 0.9; transform: translateY(70px) scale(1, 1); } 100% { filter: blur(3px); opacity: 0.6; transform: translateY(70px) scale(0.5, 0.5); } }
        .bounce-ball { animation: bounceBall 1.2s infinite cubic-bezier(0.42, 0, 0.58, 1); border-radius: 50%; height: 60px; position: relative; transform: translateY(-25px); transform-style: preserve-3d; width: 60px; z-index: 1; }
        .bounce-ball::before { background: radial-gradient(circle at 36px 20px, #eaff00, #809900); border: 2px solid #111; border-radius: 50%; content: ""; height: calc(100% + 6px); left: -6px; position: absolute; top: -3px; transform: translateZ(1vmin); width: calc(100% + 6px); }
        .bounce-ball .inner { animation: rotateBall 25s infinite linear; border-radius: 50%; height: 100%; position: absolute; transform-style: preserve-3d; width: 100%; }
        .bounce-ball .line::before, .bounce-ball .line::after { border: 2px solid #111; border-radius: 50%; content: ""; height: 99%; position: absolute; width: 99%; }
        .bounce-ball .line::before { transform: rotate3d(0, 0, 0, 0); }
        .bounce-ball .line::after { transform: rotate3d(1, 0, 0, 90deg); }
        .bounce-ball .line--two::before { transform: rotate3d(0, 0, 0, 2deg); }
        .bounce-ball .line--two::after { transform: rotate3d(1, 0, 0, 88deg); }
        .bounce-ball .oval::before, .bounce-ball .oval::after { border-top: 4px solid #111; border-radius: 50%; content: ""; height: 99%; position: absolute; width: 99%; }
        .bounce-ball .oval::before { transform: rotate3d(1, 0, 0, 45deg) translate3d(0, 0, 6px); }
        .bounce-ball .oval::after { transform: rotate3d(1, 0, 0, -45deg) translate3d(0, 0, -6px); }
        .bounce-ball .oval--two::before { transform: rotate3d(1, 0, 0, 135deg) translate3d(0, 0, -6px); }
        .bounce-ball .oval--two::after { transform: rotate3d(1, 0, 0, -135deg) translate3d(0, 0, 6px); }
        .bounce-shadow { animation: bounceShadow 1.2s infinite cubic-bezier(0.42, 0, 0.58, 1); background: black; filter: blur(2px); border-radius: 50%; height: 6px; transform: translateY(70px); width: 54px; }
      `}} />

      {/* LAYER 1: Slate Ribbon */}
      <div ref={layer1Ref} className="absolute inset-0 w-full h-full bg-slate-800 will-change-transform z-10" />
      
      {/* LAYER 2: Zinc Ribbon */}
      <div ref={layer2Ref} className="absolute inset-0 w-full h-full bg-zinc-950 will-change-transform z-20" />
      
      {/* LAYER 3: Primary Yellow HUD */}
      <div ref={layer3Ref} className="absolute inset-0 w-full h-full bg-primary flex flex-col items-center justify-center will-change-transform z-30">
        
        {/* Tactical Grid */}
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Viewfinder Corners */}
        <div ref={cornerTL} className="absolute top-8 left-8 w-12 h-12 md:w-24 md:h-24 border-t-[6px] border-l-[6px] border-black opacity-0 will-change-transform" />
        <div ref={cornerTR} className="absolute top-8 right-8 w-12 h-12 md:w-24 md:h-24 border-t-[6px] border-r-[6px] border-black opacity-0 will-change-transform" />
        <div ref={cornerBL} className="absolute bottom-8 left-8 w-12 h-12 md:w-24 md:h-24 border-b-[6px] border-l-[6px] border-black opacity-0 will-change-transform" />
        <div ref={cornerBR} className="absolute bottom-8 right-8 w-12 h-12 md:w-24 md:h-24 border-b-[6px] border-r-[6px] border-black opacity-0 will-change-transform" />
        
        <div className="overflow-hidden flex flex-col items-center z-10 w-full">
          <span ref={textNode} className="block text-black font-display font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter text-center opacity-0 will-change-transform px-4">
            {readyText}
          </span>
          <span ref={subTextNode} className="block text-black/60 font-mono text-xs md:text-sm font-bold tracking-[0.3em] mt-4 text-center opacity-0 will-change-transform">
            DECRYPTING SYSTEM...
          </span>

          {/* 3D BOUNCING ORB (Margins fixed to close the gap) */}
          <div ref={ballRef} className="mt-16 flex flex-col items-center justify-center will-change-transform scale-[0.6] md:scale-[0.8] opacity-0 z-20 relative">
            <div className="bounce-ball">
              <div className="inner">
                <div className="line"></div>
                <div className="line line--two"></div>
                <div className="oval"></div>
                <div className="oval oval--two"></div>
              </div>
            </div>
            <div className="bounce-shadow"></div>
          </div>
          
          {/* LOADING PROGRESS RAIL (Pulled directly up into the shadow) */}
          <div ref={progressWrapperRef} className="w-48 md:w-64 h-[3px] bg-black/10 overflow-hidden mt-8 md:mt-11 rounded-full will-change-transform opacity-0 z-10 relative">
            <div ref={progressBarRef} className="w-full h-full bg-black origin-left scale-x-0 will-change-transform"></div>
          </div>
        </div>
      </div>
      
      {/* LAYER 4: Dark Terminal (Starts Top-Most) */}
      <div ref={layer4Ref} className="absolute inset-0 w-full h-full bg-background-dark flex flex-col items-center justify-center will-change-transform z-40">
        <div ref={terminalWrapper} className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-5xl animate-pulse">terminal</span>
          <p className="text-primary font-mono text-sm tracking-widest whitespace-pre">
            {progressBarText} {progress.toString().padStart(3, '0')}%
          </p>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase mt-2 animate-pulse">
            {terminalText}
          </p>
        </div>
      </div>

    </div>
  );
}