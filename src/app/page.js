'use client';
import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import IntroReveal from '@/components/IntroReveal';
import Hero from '@/components/Hero';
import GalleryTrack from '@/components/GalleryTrack';
import Lightbox from '@/components/Lightbox';
import ThemeController from '@/components/ThemeController';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    if (introFinished) {
      // Optimized Lenis instance for high refresh rate monitors (120Hz/144Hz)
      const lenis = new Lenis({ 
        duration: 1.2, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) { 
        lenis.raf(time); 
        requestAnimationFrame(raf); 
      }
      requestAnimationFrame(raf);
      
      return () => {
        lenis.destroy();
      };
    }
  }, [introFinished]);

  return (
    <main className="relative min-h-screen bg-theme pt-20">
      {/* Problem 6: Persistent Top HUD Header */}
      <div className="fixed top-0 inset-x-0 z-40 bg-[#020202] border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-2xl pointer-events-auto">
        <h1 className="font-cinzel text-xl md:text-2xl font-bold tracking-widest text-[#FFD700] uppercase">
          M.nemosyneLens<span className="text-[#FF002B] drop-shadow-[0_0_8px_rgba(255,0,43,0.8)]">.</span>
        </h1>
        <div className="font-mono text-[9px] text-white/50 uppercase tracking-[0.3em]">
          SYS.ONLINE
        </div>
      </div>

      <ThemeController />
      
      {/* Zero-delay mount: Intro Reveal acts as the detonator */}
      {!introFinished && <IntroReveal onComplete={() => setIntroFinished(true)} />}

      <Hero />
      <GalleryTrack onPhotoSelect={(media) => setSelectedPhoto(media)} />
      <Lightbox activePhoto={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </main>
  );
}
