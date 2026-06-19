'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import data from '@/data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

function MediaContainer({ media, onSelect, setHoveredPhoto }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    setHoveredPhoto(media);
    if (media.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHoveredPhoto(null);
    if (media.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      onClick={() => onSelect(media)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex-shrink-0 w-full md:w-[45vw] aspect-video bg-zinc-950 overflow-hidden cursor-pointer shadow-2xl"
    >
      {media.type === 'video' ? (
        <video 
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          loop
          muted
          playsInline
          controlsList="nodownload"
          className="w-full h-full object-contain md:object-cover filter grayscale contrast-125 brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 will-change-transform transform translate-z-0"
        />
      ) : (
        <img 
          src={media.src} 
          alt={media.title} 
          className="w-full h-full object-contain md:object-cover filter grayscale contrast-125 brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 will-change-transform transform translate-z-0" 
        />
      )}
      
      {/* The "Strobe" Crimson Glitch Flash */}
      <div className="absolute inset-0 bg-accent opacity-0 mix-blend-overlay transition-opacity duration-200 group-hover:opacity-100" />
      
      {/* Embedded HUD inside the photo container */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end font-mono text-xs text-white">
        <div className="flex justify-between border-b border-white/20 pb-2 mb-2">
          {media.type === 'video' ? (
            <>
              <span className="font-cinzel font-bold tracking-widest text-accent-secondary">{media.resolution}</span>
              <span>{media.fps} FPS</span>
            </>
          ) : (
            <>
              <span className="font-cinzel font-bold tracking-widest text-accent-secondary">ISO_{media.ISO}</span>
              <span>ƒ/{media.f}</span>
            </>
          )}
        </div>
        <h3 className="font-cinzel text-2xl font-bold uppercase tracking-widest text-white">{media.title}</h3>
      </div>
    </div>
  );
}

export default function GalleryTrack({ onPhotoSelect }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [hoveredPhoto, setHoveredPhoto] = useState(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Problem 4: Mobile horizontal clipping bypass
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        if (!track) return;
        
        setTimeout(() => {
          const scrollWidth = track.scrollWidth - window.innerWidth;
          
          gsap.to(track, {
            x: -scrollWidth,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: () => `+=${track.scrollWidth}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1
            }
          });
        }, 100);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full md:h-screen bg-theme overflow-hidden md:overflow-visible">
      
      {/* TACTICAL CAMERA HUD WIDGET */}
      <div 
        className={`fixed bottom-8 right-8 z-50 pointer-events-none transition-opacity duration-500 flex flex-col items-end gap-2 text-right ${
          hoveredPhoto ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="font-mono text-[9px] tracking-[0.4em] text-accent">
          [ TACTICAL_HUD_ACTIVE ]
        </div>
        <div className="flex gap-6 font-mono text-xs text-white bg-black/80 p-4 border border-white/10 backdrop-blur-md shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
          {hoveredPhoto?.type === 'video' ? (
            <>
              <div className="flex flex-col">
                <span className="text-white/40 text-[8px] uppercase tracking-widest mb-1">FPS</span>
                <span className="text-accent-secondary font-bold tracking-widest">{hoveredPhoto?.fps || '--'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/40 text-[8px] uppercase tracking-widest mb-1">Res</span>
                <span className="text-accent-secondary font-bold tracking-widest">{hoveredPhoto?.resolution || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/40 text-[8px] uppercase tracking-widest mb-1">Bitrate</span>
                <span className="text-accent-secondary font-bold tracking-widest">{hoveredPhoto?.bitrate || '---'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-white/40 text-[8px] uppercase tracking-widest mb-1">ISO</span>
                <span className="text-accent-secondary font-bold tracking-widest">{hoveredPhoto?.ISO || '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/40 text-[8px] uppercase tracking-widest mb-1">Aperture</span>
                <span className="text-accent-secondary font-bold tracking-widest">ƒ/{hoveredPhoto?.f || '-.-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/40 text-[8px] uppercase tracking-widest mb-1">Shutter</span>
                <span className="text-accent-secondary font-bold tracking-widest">1/{hoveredPhoto?.shutter || '---'}s</span>
              </div>
            </>
          )}
        </div>
        <div className="font-cinzel text-2xl font-bold uppercase tracking-widest text-theme mt-2 drop-shadow-md">
          {hoveredPhoto?.title || 'SCANNING...'}
        </div>
      </div>

      {/* Massive Background Watermark */}
      <div className="absolute top-4 left-0 right-0 pointer-events-none z-0 overflow-hidden whitespace-nowrap">
        <h1 className="text-[24vw] font-black text-theme-secondary opacity-10 uppercase leading-none transform -skew-x-12 select-none">
          M.NEMOSYNE
        </h1>
      </div>

      {/* PARALLAX HORIZONTAL TRACK (Vertical on mobile) */}
      <div 
        ref={trackRef} 
        className="relative md:absolute md:inset-y-0 left-0 flex flex-col md:flex-row items-center gap-16 px-4 py-16 md:py-0 md:px-16 h-auto md:h-full z-10 will-change-transform"
      >
        {data.media.map((item) => (
          <MediaContainer 
            key={item.id} 
            media={item} 
            onSelect={onPhotoSelect} 
            setHoveredPhoto={setHoveredPhoto} 
          />
        ))}
      </div>
    </div>
  );
}
