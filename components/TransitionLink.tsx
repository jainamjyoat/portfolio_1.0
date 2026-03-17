"use client";

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export default function TransitionLink({ children, href, className, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleTransition = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    const hrefString = href.toString().toLowerCase();
    let destText = "SYSTEM_NAV_";
    
    if (hrefString === '/' || hrefString.startsWith('/#')) {
      destText = "HOME_ENVIRONMENT_";
    } else if (hrefString.includes('archive')) {
      destText = "ARCHIVE_INDEX_";
    } else if (hrefString.includes('resume')) {
      destText = "PROFESSIONAL_DOSSIER_";
    }

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
    textNode.className = "block text-black font-display font-black text-4xl md:text-7xl lg:text-8xl uppercase tracking-tighter will-change-transform text-center px-4";
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

    tl.to(layer1, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
      .to(layer2, { yPercent: 0, duration: 0.6, ease: "expo.inOut" }, "-=0.45") 
      .to(layer3, { yPercent: 0, duration: 0.6, ease: "expo.inOut" }, "-=0.45")
      .to(textNode, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.2")
      .to(subTextNode, { yPercent: 0, duration: 0.5, ease: "expo.out" }, "-=0.4")
      .add(() => {
        tl.pause(); 
        router.push(href.toString());
        window.scrollTo(0, 0); 
        setTimeout(() => {
          tl.play(); 
        }, 800);
      })
      .to([textNode, subTextNode], { yPercent: -100, duration: 0.4, ease: "expo.in" })
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