"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import TransitionLink from './TransitionLink';
import { usePathname } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const isInitialRender = useRef(true); 

  useEffect(() => {
    if (!menuRef.current || !bgRef.current) return;

    // Set the initial hidden state
    gsap.set(bgRef.current, { yPercent: -100, borderBottomLeftRadius: "50%", borderBottomRightRadius: "50%" });
    
    tl.current = gsap.timeline({ paused: true })
      .to(bgRef.current, { 
        yPercent: 0, 
        borderBottomLeftRadius: "0%", 
        borderBottomRightRadius: "0%",
        duration: 0.8, 
        ease: "expo.inOut" 
      })
      .fromTo(".menu-link-text", 
        { y: "150%", rotate: 10, opacity: 0 }, 
        { 
          y: "0%", 
          rotate: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.08, 
          ease: "expo.out" 
        }, 
        "-=0.4"
      )
      .fromTo(".menu-footer", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 
        "-=0.6"
      );

    return () => {
      tl.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return; 
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      tl.current?.play();
    } else {
      document.body.style.overflow = '';
      tl.current?.reverse();
    }
  }, [isOpen]);

  // --- THE FIX ---
  // Force the menu state to 'closed' whenever the page URL changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const closeMenu = () => setIsOpen(false);

  return (
    // Instead of returning null, we wrap the whole component in a div 
    // that hides itself if it's not on the home page. This preserves the GSAP elements!
    <div className={pathname === '/' ? 'block' : 'hidden'}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-6 right-6 z-[9995] bg-white text-black px-5 py-3 rounded-full flex items-center gap-3 hover:scale-105 transition-transform group shadow-xl"
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <span className={`absolute h-[2px] bg-black transition-all duration-300 ${isOpen ? 'w-5 rotate-45' : 'w-4 -translate-y-1'}`} />
          <span className={`absolute h-[2px] bg-black transition-all duration-300 ${isOpen ? 'w-5 -rotate-45' : 'w-4 translate-y-1'}`} />
        </div>
        <span className="font-display font-bold text-xs tracking-widest uppercase mt-0.5">
          {isOpen ? 'Close' : 'Menu'}
        </span>
      </button>

      <div 
        ref={menuRef} 
        className={`fixed inset-0 z-[9990] flex flex-col justify-center px-8 md:px-24 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div 
          ref={bgRef}
          className="absolute inset-0 w-full h-full bg-background-dark/95 backdrop-blur-xl will-change-transform"
        />

        <nav className="relative z-50 flex flex-col gap-2 md:gap-6 mt-12">
          {[
            { name: 'Home', href: '/' },
            { name: 'Archive', href: '/archive' },
            { name: 'Resume', href: '/resume' }
          ].map((link, i) => (
            <div key={i} className="overflow-hidden py-2">
              <TransitionLink 
                href={link.href} 
                onClick={closeMenu}
                className="group flex items-center gap-4 text-6xl md:text-8xl lg:text-9xl font-display font-black text-white hover:text-primary transition-colors uppercase tracking-tighter w-max relative z-50 cursor-pointer"
              >
                <span className="menu-link-text block will-change-transform transform-gpu origin-bottom-left pointer-events-none">
                  {link.name}
                </span>
                <span className="material-symbols-outlined text-4xl md:text-6xl opacity-0 -translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out pointer-events-none">
                  arrow_forward
                </span>
              </TransitionLink>
            </div>
          ))}

          <div className="menu-footer mt-16 flex flex-col gap-4 text-xs md:text-sm font-mono tracking-widest text-slate-400 uppercase relative z-50">
            <p className="text-primary mb-2">Get in touch</p>
            <a href="mailto:jainamjyoat2005@gmail.com" className="hover:text-white transition-colors w-max cursor-pointer">jainamjyoat2005@gmail.com</a>
            <div className="flex gap-6 mt-4">
              <a href="https://linkedin.com/in/jainam-jyoat/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">LinkedIn</a>
              <a href="https://github.com/jainamjyoat" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors cursor-pointer">GitHub</a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}