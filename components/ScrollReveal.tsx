"use client";

import React, { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
}) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="inline-block word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const wordElements = el.querySelectorAll<HTMLElement>('.word');

    // Combine opacity, rotation, and blur into a single, highly-optimized timeline
    gsap.fromTo(
      wordElements,
      { 
        opacity: baseOpacity, 
        rotate: baseRotation, 
        filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
        willChange: 'opacity, transform, filter'
      },
      {
        opacity: 1,
        rotate: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.03, // Animates word-by-word quickly
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 85%', // Perfect sync point
          toggleActions: 'play none none reverse',
          // scrub: true REMOVED
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-semibold ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

export default ScrollReveal;