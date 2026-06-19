'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import data from '@/data/portfolio.json';

export default function IntroReveal({ onComplete }) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Cache validation checker to prevent animation desync
  useEffect(() => {
    const img = new Image();
    img.src = data.intro.profilePhoto;
    if (img.complete) {
      setImageLoaded(true);
    } else {
      img.onload = () => setImageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!imageLoaded) return;
    
    // Absolute Zero-Delay Entry: Detonate exactly when cached
    const tl = gsap.timeline({ onComplete });
    
    // The "Anticipation Intro" Fluid Cell Reveal (400ms total)
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0, ease: 'none' }, 0)
    .to(imageRef.current, {
      scale: 1.15,
      filter: 'hue-rotate(90deg) contrast(200%) brightness(150%) blur(4px)',
      duration: 0.15,
      ease: 'power4.in',
    }, 0)
    // Instant Logo Manifestation at 200ms
    .fromTo(titleRef.current, 
      { scale: 2, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.2, ease: 'back.out(2)' },
      0.2
    )
    .to(containerRef.current, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 100%)', // Diagonal split warp
      duration: 0.4,
      ease: 'power4.inOut',
    }, 0.4);

  }, [imageLoaded, onComplete]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[200] bg-theme flex flex-col items-center justify-center overflow-hidden pointer-events-none will-change-transform will-change-clip gap-8 opacity-0"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      <div className="w-[40vw] max-w-[400px] aspect-[4/5] relative overflow-hidden shadow-2xl">
        <img 
          ref={imageRef}
          src={data.intro.profilePhoto} 
          alt="Intro sequence anchor" 
          className="w-full h-full object-cover filter grayscale contrast-150 will-change-transform mix-blend-difference"
        />
        <div className="absolute inset-0 bg-accent mix-blend-overlay opacity-50" />
      </div>
      
      {/* Title that smashes into view */}
      <h1 ref={titleRef} className="font-cinzel text-5xl md:text-7xl font-bold tracking-widest text-theme uppercase drop-shadow-lg opacity-0 will-change-transform">
        M.nemosyneLens<span className="text-accent drop-shadow-[0_0_15px_rgba(255,0,43,1)]">.</span>
      </h1>
    </div>
  );
}
