"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export default function TransitionLink({ children, href, className, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    let destText = "SYSTEM_NAV_";
    if (href === '/' || href.toString().includes('#')) destText = "HOME_ENVIRONMENT_";
    if (href === '/archive') destText = "ARCHIVE_INDEX_";

    const container = document.createElement('div');
    container.className = "fixed inset-0 z-[9999] pointer-events-none overflow-hidden";
    document.body.appendChild(container);

    const layer1 = document.createElement('div');
    layer1.className = "absolute inset-0 w-full h-full bg-slate-800 will-change-transform";
    
    const layer2 = document.createElement('div');
    layer2.className = "absolute inset-0 w-full h-full bg-zinc-950 will-change-transform";
    
    const layer3 = document.createElement('div');
    layer3.className = "absolute inset-0 w-full h-full bg-primary flex flex-col items-center justify-center will-change-transform";

    const textWrapper = document.createElement('div');
    textWrapper.className = "overflow-hidden"; 
    
    const textNode = document.createElement('span');
    textNode.className = "block text-black font-display font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter will-change-transform";
    textNode.innerText = destText;

    const subTextNode = document.createElement('span');
    subTextNode.className = "block text-black/60 font-mono text-xs md:text-sm font-bold tracking-[0.3em] mt-4 text-center will-change-transform";
    subTextNode.innerText = "ESTABLISHING CONNECTION...";

    textWrapper.appendChild(textNode);
    textWrapper.appendChild(subTextNode);
    layer3.appendChild(textWrapper);
    
    container.appendChild(layer1);
    container.appendChild(layer2);
    container.appendChild(layer3);

    gsap.set([layer1, layer2, layer3], { yPercent: 100 });
    gsap.set([textNode, subTextNode], { yPercent: 100 });

    const tl = gsap.timeline({
      onComplete: () => container.remove() 
    });

    // --- PHASE 1: ENTER SEQUENCE ---
    tl.to(layer1, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
      .to(layer2, { yPercent: 0, duration: 0.6, ease: "expo.inOut" }, "-=0.45") 
      .to(layer3, { yPercent: 0, duration: 0.6, ease: "expo.inOut" }, "-=0.45")
      .to(textNode, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.2")
      .to(subTextNode, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.4")
      
      // --- PHASE 2: THE CPU HANDOFF ---
      .add(() => {
        // 1. Pause GSAP completely so it stops fighting Next.js for CPU power
        tl.pause(); 

        // 2. Trigger the heavy React route change
        router.push(href.toString());
        window.scrollTo(0, 0); 

        // 3. Wait 800ms. This gives the Three.js Ballpit plenty of time to compile its shaders 
        // while the user safely looks at the solid yellow loading screen.
        setTimeout(() => {
          // 4. Resume the GSAP timeline now that the CPU is free!
          tl.play(); 
        }, 800);
      })

      // --- PHASE 3: EXIT SEQUENCE ---
      // Slide the text away first
      .to([textNode, subTextNode], { yPercent: -100, duration: 0.4, ease: "expo.in" })
      // Then peel the layers off smoothly
      .to(layer3, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, "-=0.1")
      .to(layer2, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, "-=0.45")
      .to(layer1, { yPercent: -100, duration: 0.6, ease: "expo.inOut" }, "-=0.45");
  };

  return (
    <Link href={href} onClick={handleTransition} className={className} {...props}>
      {children}
    </Link>
  );
}