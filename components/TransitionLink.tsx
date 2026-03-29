"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export default function TransitionLink({ children, href, className, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    const hrefString = href.toString().toLowerCase();
    let destText = "SYSTEM_NAV_";
    
    if (hrefString === '/' || hrefString.startsWith('/#')) {
      destText = "HOME_ENVIRONMENT_";
    } else if (hrefString.includes('archive')) {
      destText = "ARCHIVE_INDEX_";
    } else if (hrefString.includes('resume')) {
      destText = "PROFESSIONAL_DOSSIER_";
    }

    const container = document.createElement('div');
    container.className = "fixed inset-0 z-[9999] pointer-events-none overflow-hidden";
    document.body.appendChild(container);

    // --- INJECTING THE 3D ORB CSS ---
    // The ball's vertical positions have been increased in the bounceBall and bounceShadow keyframes
    // to move the entire motion slightly downwards.
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes rotateBall { 0% { transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg); } 50% { transform: rotateY(360deg) rotateX(360deg) rotateZ(0deg); } 100% { transform: rotateY(720deg) rotateX(720deg) rotateZ(360deg); } }
      @keyframes bounceBall { 0% { transform: translateY(-30px) scale(1, 1); } 15% { transform: translateY(-20px) scale(1, 1); } 45% { transform: translateY(60px) scale(1, 1); } 50% { transform: translateY(65px) scale(1, 0.92); } 55% { transform: translateY(60px) scale(1, 0.95); } 85% { transform: translateY(-20px) scale(1, 1); } 95% { transform: translateY(-30px) scale(1, 1); } 100% { transform: translateY(-30px) scale(1, 1); } }
      @keyframes bounceShadow { 0% { filter: blur(3px); opacity: 0.6; transform: translateY(65px) scale(0.5, 0.5); } 45% { filter: blur(1px); opacity: 0.9; transform: translateY(65px) scale(1, 1); } 55% { filter: blur(1px); opacity: 0.9; transform: translateY(65px) scale(1, 1); } 100% { filter: blur(3px); opacity: 0.6; transform: translateY(65px) scale(0.5, 0.5); } }
      
      .bounce-ball { animation: bounceBall 1.2s infinite cubic-bezier(0.42, 0, 0.58, 1); border-radius: 50%; height: 60px; position: relative; transform: translateY(-70px); transform-style: preserve-3d; width: 60px; z-index: 1; }
      /* Modified to Neon Yellow/Cyberpunk Theme */
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
      .bounce-shadow { animation: bounceShadow 1.2s infinite cubic-bezier(0.42, 0, 0.58, 1); background: black; filter: blur(2px); border-radius: 50%; height: 6px; transform: translateY(65px); width: 54px; }
    `;
    container.appendChild(styleTag);

    const layer1 = document.createElement('div');
    layer1.className = "absolute inset-0 w-full h-full bg-slate-800 will-change-transform";
    
    const layer2 = document.createElement('div');
    layer2.className = "absolute inset-0 w-full h-full bg-zinc-950 will-change-transform";
    
    const layer3 = document.createElement('div');
    layer3.className = "absolute inset-0 w-full h-full bg-primary flex flex-col items-center justify-center will-change-transform relative";

    // --- TACTICAL GRID BACKGROUND ---
    const gridOverlay = document.createElement('div');
    gridOverlay.className = "absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(0,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none";
    layer3.appendChild(gridOverlay);

    // --- VIEWFINDER CORNERS ---
    const cornerTL = document.createElement('div');
    cornerTL.className = "absolute top-8 left-8 w-12 h-12 md:w-24 md:h-24 border-t-[6px] border-l-[6px] border-black opacity-0 will-change-transform";
    const cornerTR = document.createElement('div');
    cornerTR.className = "absolute top-8 right-8 w-12 h-12 md:w-24 md:h-24 border-t-[6px] border-r-[6px] border-black opacity-0 will-change-transform";
    const cornerBL = document.createElement('div');
    cornerBL.className = "absolute bottom-8 left-8 w-12 h-12 md:w-24 md:h-24 border-b-[6px] border-l-[6px] border-black opacity-0 will-change-transform";
    const cornerBR = document.createElement('div');
    cornerBR.className = "absolute bottom-8 right-8 w-12 h-12 md:w-24 md:h-24 border-b-[6px] border-r-[6px] border-black opacity-0 will-change-transform";
    layer3.append(cornerTL, cornerTR, cornerBL, cornerBR);

    const textWrapper = document.createElement('div');
    textWrapper.className = "overflow-hidden z-10 flex flex-col items-center"; 
    
    const textNode = document.createElement('span');
    textNode.className = "block text-black font-display font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter will-change-transform text-center px-4";
    textNode.innerText = destText;

    const subTextNode = document.createElement('span');
    subTextNode.className = "block text-black/60 font-mono text-xs md:text-sm font-bold tracking-[0.3em] mt-4 text-center will-change-transform";
    subTextNode.innerText = "ESTABLISHING CONNECTION...";

    // --- THE 3D BOUNCING ORB ---
    const loaderContainer = document.createElement('div');
    loaderContainer.className = "mt-12 mb-4 flex flex-col items-center justify-center will-change-transform scale-[0.6] md:scale-[0.8]";
    loaderContainer.innerHTML = `
      <div class="bounce-ball">
        <div class="inner">
          <div class="line"></div>
          <div class="line line--two"></div>
          <div class="oval"></div>
          <div class="oval oval--two"></div>
        </div>
      </div>
      <div class="bounce-shadow"></div>
    `;

    // --- LOADING PROGRESS BAR ---
    const progressWrapper = document.createElement('div');
    progressWrapper.className = "w-48 md:w-64 h-[3px] bg-black/10 overflow-hidden mt-6 rounded-full will-change-transform";
    const progressBar = document.createElement('div');
    progressBar.className = "w-full h-full bg-black origin-left scale-x-0 will-change-transform";
    progressWrapper.appendChild(progressBar);

    textWrapper.appendChild(textNode);
    textWrapper.appendChild(subTextNode);
    textWrapper.appendChild(loaderContainer);
    textWrapper.appendChild(progressWrapper);
    layer3.appendChild(textWrapper);
    
    container.appendChild(layer1);
    container.appendChild(layer2);
    container.appendChild(layer3);

    // Initial GSAP Setup
    gsap.set([layer1, layer2, layer3], { yPercent: 100 });
    gsap.set([textNode, subTextNode, loaderContainer, progressWrapper], { y: 40, opacity: 0 });
    gsap.set([cornerTL, cornerTR, cornerBL, cornerBR], { scale: 0.8 });

    const tl = gsap.timeline({
      onComplete: () => container.remove() 
    });

    const easeSlide = "expo.inOut";
    const easeText = "expo.out";

    // --- EXACT ABSOLUTE TIMINGS ---
    tl.to(layer1, { yPercent: 0, duration: 0.8, ease: easeSlide }, 0)
      .to(layer2, { yPercent: 0, duration: 0.8, ease: easeSlide }, 0.15) 
      .to(layer3, { yPercent: 0, duration: 0.8, ease: easeSlide }, 0.3)
      
      // Cascading reveal of the text, bouncing ball, and loading line
      .to([textNode, subTextNode, loaderContainer, progressWrapper], { 
        y: 0, 
        opacity: 1, 
        duration: 0.7, 
        stagger: 0.1, 
        ease: easeText 
      }, 0.45)
      
      // HUD elements snap in
      .to([cornerTL, cornerTR, cornerBL, cornerBR], { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 0.6)
      .to(progressBar, { scaleX: 1, duration: 0.7, ease: "power4.inOut" }, 0.6)

      .add(() => {
        tl.pause(); 
        router.push(href.toString());
        window.scrollTo(0, 0); 
        
        setTimeout(() => {
          subTextNode.innerText = "ACCESS GRANTED_";
          subTextNode.classList.remove("text-black/60");
          subTextNode.classList.add("text-black");
        }, 500);

        setTimeout(() => {
          tl.play(); 
        }, 1000);
      })
      
      // Exit animations
      .to([cornerTL, cornerTR, cornerBL, cornerBR], { scale: 1.2, opacity: 0, duration: 0.4, ease: "expo.in" })
      .to([textNode, subTextNode, loaderContainer, progressWrapper], { y: -40, opacity: 0, duration: 0.4, stagger: 0.05, ease: "expo.in" }, "<")
      .to(layer3, { yPercent: -100, duration: 0.8, ease: easeSlide }, "-=0.1")
      .to(layer2, { yPercent: -100, duration: 0.8, ease: easeSlide }, "-=0.65")
      .to(layer1, { yPercent: -100, duration: 0.8, ease: easeSlide }, "-=0.65");
  };

  return (
    <Link href={href} onClick={handleTransition} className={className} {...props}>
      {children}
    </Link>
  );
}