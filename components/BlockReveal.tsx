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

    gsap.fromTo(
      el,
      { 
        opacity: 0, 
        y: 50, 
        filter: 'blur(12px)',
        willChange: 'opacity, transform, filter' // Forces GPU acceleration
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: 'top 85%', // Triggers exactly when the element hits the bottom 15% of your screen
          toggleActions: 'play none none reverse', // Plays on scroll down, reverses on scroll up
          // scrub: 1 has been REMOVED to kill the lag
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}