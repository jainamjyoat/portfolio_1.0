"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation'; // Added to track page changes

export default function CustomCursor() {
  const [mounted, setMounted] = React.useState(false);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const pathname = usePathname(); // Get the current URL path

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Handle actual mouse movement (Only needs to run once)
  useEffect(() => {
    if (!mounted) return;

    document.body.style.cursor = 'none';

    const xMoveDot = gsap.quickTo(cursorDot.current, "x", { duration: 0.1, ease: "power3" });
    const yMoveDot = gsap.quickTo(cursorDot.current, "y", { duration: 0.1, ease: "power3" });
    const xMoveRing = gsap.quickTo(cursorRing.current, "x", { duration: 0.5, ease: "power3" });
    const yMoveRing = gsap.quickTo(cursorRing.current, "y", { duration: 0.5, ease: "power3" });

    const moveCursor = (e: MouseEvent) => {
      xMoveDot(e.clientX);
      yMoveDot(e.clientY);
      xMoveRing(e.clientX);
      yMoveRing(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = 'auto';
    };
  }, [mounted]);

  // 2. Handle hover states & page transitions (Runs every time the URL changes)
  useEffect(() => {
    if (!mounted) return;

    // FORCE RESET: When the page changes, instantly shrink the cursor back to normal
    gsap.to(cursorRing.current, { scale: 1, backgroundColor: "transparent", duration: 0.3 });
    gsap.to(cursorDot.current, { scale: 1, duration: 0.3 });

    const handleHover = () => {
      gsap.to(cursorRing.current, { scale: 1.8, backgroundColor: "rgba(255, 255, 0, 0.1)", duration: 0.3 });
      gsap.to(cursorDot.current, { scale: 0, duration: 0.3 });
    };

    const handleLeave = () => {
      gsap.to(cursorRing.current, { scale: 1, backgroundColor: "transparent", duration: 0.3 });
      gsap.to(cursorDot.current, { scale: 1, duration: 0.3 });
    };

    // Delay attaching listeners by 100ms to ensure the new page DOM has finished rendering
    const timeout = setTimeout(() => {
      const clickables = document.querySelectorAll("a, button, input");
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", handleHover);
        el.addEventListener("mouseleave", handleLeave);
        (el as HTMLElement).style.cursor = 'none';
      });
    }, 100);

    // Cleanup: Remove listeners from old elements before applying to new ones
    return () => {
      clearTimeout(timeout);
      const clickables = document.querySelectorAll("a, button, input");
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [pathname, mounted]); // <--- This dependency is the magic fix!

  if (!mounted) return null;

  return (
    <>
      <div 
        ref={cursorDot} 
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div 
        ref={cursorRing} 
        className="fixed top-0 left-0 w-8 h-8 border border-primary rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}