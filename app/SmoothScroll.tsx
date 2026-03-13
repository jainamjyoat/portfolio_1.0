"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      // Keep duration modest to reduce perceived lag
      duration: reducedMotion ? 0 : 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // cubic out
      smoothWheel: true,
      normalizeWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoRaf: false, // we drive rAF manually to avoid duplicate loops
    });

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      // @ts-expect-error internal types allow destroy
      lenis.destroy?.();
    };
  }, []);

  return null;
}
