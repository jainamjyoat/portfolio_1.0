"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const textRef = useRef<HTMLDivElement>(null);
  let direction = 1;

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    // Create the infinite loop animation
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(text, { xPercent: -50, duration: 20, ease: "none" });

    // Link it to the scroll direction & speed
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (self.direction !== direction) {
          direction = self.direction;
          gsap.to(tl, { timeScale: direction, overwrite: true });
        }
        // Speed up the marquee while scrolling
        gsap.to(tl, { timeScale: direction * 4, duration: 0.1, overwrite: true });
        // Slow back down to normal when scrolling stops
        gsap.to(tl, { timeScale: direction, duration: 1, delay: 0.1, overwrite: true });
      }
    });

    return () => tl.kill();
  }, []);

  const techText = "REACT • NEXT.JS • THREE.JS • PYTHON • GSAP • TAILWIND • RUST • NODE.JS • ";

  return (
    <div className="w-full overflow-hidden bg-primary text-black py-4 border-y border-white/20 relative z-20 flex whitespace-nowrap">
      <div ref={textRef} className="flex whitespace-nowrap font-display font-black text-4xl uppercase tracking-tighter">
        {/* We duplicate the text twice so it loops seamlessly */}
        <span>{techText}{techText}</span>
        <span>{techText}{techText}</span>
      </div>
    </div>
  );
}