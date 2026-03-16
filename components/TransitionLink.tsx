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

    // Create the "Curtain" element dynamically
    const curtain = document.createElement('div');
    
    // Added 'will-change-transform' to force GPU rendering for maximum smoothness
    curtain.className = "fixed top-0 left-0 w-full h-[100vh] bg-primary z-[9999] origin-bottom will-change-transform";
    document.body.appendChild(curtain);

    // Animate the curtain UP
    gsap.fromTo(curtain, 
      { scaleY: 0 }, 
      { 
        scaleY: 1, 
        duration: 0.6, // Slightly longer for a more luxurious feel
        ease: "expo.inOut", // Expo provides a much smoother curve than Power4
        onComplete: () => {
          // Push the new route
          router.push(href.toString());
          
          // Force scroll to top behind the curtain so the user doesn't see a jump
          window.scrollTo(0, 0);

          // Pre-set the origin to top BEFORE the exit animation starts
          gsap.set(curtain, { transformOrigin: "top" });

          // Wait 400ms to let Next.js completely finish rendering the new page's WebGL
          // This ensures the CPU is completely free when the sweep-away animation starts
          setTimeout(() => {
            gsap.to(curtain, { 
              scaleY: 0, 
              duration: 0.6, 
              ease: "expo.inOut",
              onComplete: () => curtain.remove() 
            });
          }, 400); 
        }
      }
    );
  };

  return (
    <Link href={href} onClick={handleTransition} className={className} {...props}>
      {children}
    </Link>
  );
}