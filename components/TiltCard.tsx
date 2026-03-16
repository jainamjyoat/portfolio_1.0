"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function TiltCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    if (!card || !content) return;

    const xTo = gsap.quickTo(content, "rotateY", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(content, "rotateX", { duration: 0.5, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 15 degrees)
      const rotateX = ((y - centerY) / centerY) * -15; 
      const rotateY = ((x - centerX) / centerX) * 15;

      xTo(rotateY);
      yTo(rotateX);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      gsap.to(content, { scale: 1, duration: 0.5, ease: "power3.out" });
    };

    const handleMouseEnter = () => {
      gsap.to(content, { scale: 1.02, duration: 0.5, ease: "power3.out" });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div ref={cardRef} className={`relative perspective-1000 ${className}`}>
      <div ref={contentRef} className="w-full h-full transform-style-3d will-change-transform">
        {children}
      </div>
    </div>
  );
}