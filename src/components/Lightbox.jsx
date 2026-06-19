'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Lightbox({ activePhoto, onClose }) {
  const wrapperRef = useRef(null);
  const hudRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (activePhoto) {
      const tl = gsap.timeline();
      tl.fromTo(wrapperRef.current, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.25, ease: 'power3.out' });
      tl.fromTo(hudRef.current?.children, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.05 }, '-=0.1');

      if (activePhoto.type === 'video' && videoRef.current) {
        setTimeout(() => videoRef.current?.play(), 300);
      }
    }
  }, [activePhoto]);

  if (!activePhoto) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-theme flex items-center justify-center p-4 md:p-12">
      {/* SHUTTER BLADE TRANSITION ELEMENT (Flashes theme accent color on load) */}
      <div className="absolute inset-0 bg-accent z-50 pointer-events-none shutter-close-fast" />

      <div ref={wrapperRef} className="relative z-10 w-full max-w-5xl h-[70vh] flex items-center justify-center bg-black border border-white/10 shadow-2xl overflow-hidden" style={{ clipPath: 'polygon(2% 0%, 100% 0%, 100% 96%, 98% 100%, 0% 100%, 0% 4%)' }}>
        {activePhoto.type === 'video' ? (
          <video 
            ref={videoRef}
            src={activePhoto.src}
            loop
            muted
            playsInline
            controlsList="nodownload"
            className="w-full h-full object-contain max-h-full max-w-full p-4"
          />
        ) : (
          <img src={activePhoto.src} alt={activePhoto.title} className="w-full h-full object-contain max-h-full max-w-full p-4" />
        )}
        <button onClick={onClose} className="absolute top-4 right-6 z-20 font-mono text-xs tracking-widest text-theme-secondary hover:text-accent transition-colors focus:outline-none bg-black/50 px-2 py-1 backdrop-blur-sm">[ ESCAPE_VIEW ]</button>
      </div>

      <div ref={hudRef} className="absolute bottom-4 md:bottom-10 inset-x-6 md:inset-x-16 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-none">
        <div>
          <span className="font-mono text-[9px] text-accent tracking-widest uppercase drop-shadow-md bg-panel px-1">— TITULUS —</span>
          <h2 className="font-cinzel text-2xl md:text-5xl font-bold tracking-widest text-theme uppercase drop-shadow-lg">{activePhoto.title}</h2>
        </div>
        <div className="flex gap-6 font-cinzel border-t md:border-t-0 border-theme pt-2 md:pt-0 w-full md:w-auto bg-panel/80 md:bg-transparent p-2 md:p-0 backdrop-blur-sm md:backdrop-blur-none">
          {activePhoto.type === 'video' ? (
            <>
              <div className="flex flex-col"><span className="font-mono text-[8px] text-theme-secondary">[I] FPS</span><span className="text-xs md:text-sm font-bold text-accent-secondary">{activePhoto.fps}</span></div>
              <div className="flex flex-col"><span className="font-mono text-[8px] text-theme-secondary">[II] RES</span><span className="text-xs md:text-sm font-bold text-accent-secondary">{activePhoto.resolution}</span></div>
              <div className="flex flex-col"><span className="font-mono text-[8px] text-theme-secondary">[III] RATE</span><span className="text-xs md:text-sm font-bold text-accent-secondary">{activePhoto.bitrate}</span></div>
            </>
          ) : (
            <>
              <div className="flex flex-col"><span className="font-mono text-[8px] text-theme-secondary">[I] LUM</span><span className="text-xs md:text-sm font-bold text-accent-secondary">ISO {activePhoto.ISO}</span></div>
              <div className="flex flex-col"><span className="font-mono text-[8px] text-theme-secondary">[II] SCIS</span><span className="text-xs md:text-sm font-bold text-accent-secondary">ƒ/{activePhoto.f}</span></div>
              <div className="flex flex-col"><span className="font-mono text-[8px] text-theme-secondary">[III] TEMP</span><span className="text-xs md:text-sm font-bold text-accent-secondary">1/{activePhoto.shutter}s</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
