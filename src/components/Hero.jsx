'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '@/data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=150%',
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    tl.to(maskRef.current, { scale: 75, ease: 'power2.inOut' });
    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-theme">
      <div className="absolute inset-0 w-full h-full z-0">
        <img src={data.heroSection.backgroundImage} alt="Hero BG" className="w-full h-full object-cover filter grayscale contrast-150 brightness-50" />
      </div>
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center justify-center mix-blend-multiply bg-theme/10">
        <svg ref={maskRef} viewBox="0 0 100 100" className="w-[30vw] h-[30vw] will-change-transform fill-theme">
          <path d="M 0,0 L 100,0 L 100,100 L 0,100 Z M 50,15 L 65,42 L 95,42 L 70,60 L 80,90 L 50,72 L 20,90 L 30,60 L 5,42 L 35,42 Z" />
        </svg>
      </div>
      <div className="absolute bottom-16 left-12 z-20 font-mono text-theme">
        <p className="text-xs text-accent tracking-[0.3em] font-bold mb-2">{data.heroSection.subtitle}</p>
        <h2 className="font-cinzel text-5xl md:text-7xl font-bold tracking-tight">SCROLL_TO_ENTER</h2>
      </div>
    </div>
  );
}
