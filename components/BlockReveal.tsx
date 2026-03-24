"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface BlockRevealProps {
  children: ReactNode;
  className?: string;
}

export default function BlockReveal({ children, className = '' }: BlockRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // We store the animation in a variable so we can clean up ONLY this instance
    const animation = gsap.fromTo(
      el,
      { 
        opacity: 0, 
        y: 50, 
        filter: 'blur(12px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.0, // Sped up slightly from 1.2 to 1.0 for a snappier feel
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: 'top 95%', // <-- FIX 1: Triggers immediately when it enters the screen
          toggleActions: 'play none none reverse', 
        }
      }
    );

    return () => {
      // <-- FIX 2: We only kill THIS specific trigger, preserving the rest of your site
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className={className} style={{ willChange: 'opacity, transform, filter' }}>
      {children}
    </div>
  );
}