import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import data from './data/portfolio.json';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [introActive, setIntroActive] = useState(true);
  const [imageCached, setImageCached] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [hoveredData, setHoveredData] = useState({ p1: '---', p2: '---', p3: '---' });
  const [activeMedia, setActiveMedia] = useState(null);
  
  const introContainer = useRef(null);
  const introImg = useRef(null);
  const introLogo = useRef(null);
  const heroContainer = useRef(null);
  const heroMask = useRef(null);
  const galleryContainer = useRef(null);
  const galleryTrack = useRef(null);

  const cycleTheme = () => {
    const themes = ['dark', 'monolith', 'sulphur'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  useEffect(() => {
    const imgObj = new Image();
    imgObj.src = data.intro.coverImage;
    const triggerTimeline = () => setImageCached(true);
    
    if (imgObj.complete) triggerTimeline();
    else imgObj.onload = triggerTimeline;
  }, []);

  useEffect(() => {
    if (!imageCached) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroActive(false);
        initializeScrollSystems();
      }
    });

    tl.fromTo(introContainer.current, { opacity: 0 }, { opacity: 1, duration: 0, ease: 'none' })
      .fromTo(introImg.current,
        { scale: 1.4, filter: 'contrast(3) brightness(3) saturate(0)' },
        { scale: 1, filter: 'contrast(1.2) brightness(0.9) saturate(0)', duration: 0.4, ease: "power4.out" }
      )
      .fromTo(introLogo.current,
        { opacity: 0, y: 40, letterSpacing: '0.4em' },
        { opacity: 1, y: 0, letterSpacing: '0.12em', duration: 0.3, ease: 'back.out(1.7)' },
        '-=0.25'
      )
      .to(introContainer.current, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        duration: 0.4,
        ease: 'power4.inOut',
        delay: 0.3
      });
  }, [imageCached]);

  const initializeScrollSystems = () => {
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    gsap.to(heroMask.current, {
      scale: 85,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: heroContainer.current, start: 'top top', end: '+=130%', scrub: true, pin: true, anticipatePin: 1 }
    });

    const matchMedia = gsap.matchMedia();
    matchMedia.add('(min-width: 769px)', () => {
      const track = galleryTrack.current;
      const horizontalLength = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: -horizontalLength,
        ease: 'none',
        scrollTrigger: { trigger: galleryContainer.current, start: 'top top', end: () => `+=${track.scrollWidth}`, scrub: true, pin: true, anticipatePin: 1 }
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  };

  return (
    <main className="relative min-h-screen bg-[var(--bg-primary)] pt-16">
      
      {/* Persistent Global Top HUD */}
      <div className="fixed top-0 inset-x-0 z-40 bg-[#020202] border-b border-[var(--border-primary)] px-6 py-4 flex justify-between items-center shadow-2xl pointer-events-auto">
        <h1 className="font-cinzel text-xl md:text-2xl font-bold tracking-widest text-[#FFD700] uppercase">
          M.nemosyneLens<span className="text-[#FF002B] drop-shadow-[0_0_8px_rgba(255,0,43,0.8)]">.</span>
        </h1>
        <div className="font-mono text-[9px] text-white/50 uppercase tracking-[0.3em]">
          SYS.ONLINE
        </div>
        <button onClick={cycleTheme} className="font-mono text-[9px] text-[#FFD700] border border-[#FFD700]/30 px-2 py-1 hover:bg-[#FFD700] hover:text-black transition-colors">
          [ THEME: {theme.toUpperCase()} ]
        </button>
      </div>

      {introActive && (
        <div ref={introContainer} className="fixed inset-0 z-50 bg-[#020202] flex flex-col items-center justify-center p-6 will-change-transform opacity-0" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
          <div className="w-[40vw] max-w-[400px] aspect-[4/5] relative overflow-hidden shadow-2xl">
            <img ref={introImg} src={data.intro.coverImage} className="w-full h-full object-cover will-change-transform mix-blend-difference" />
            <div className="absolute inset-0 bg-[#FF002B] mix-blend-overlay opacity-50" />
          </div>
          <h1 ref={introLogo} className="font-cinzel text-5xl md:text-7xl font-bold tracking-widest text-white uppercase drop-shadow-lg will-change-transform mt-8">
            M.nemosyneLens<span className="text-[#FF002B]">.</span>
          </h1>
        </div>
      )}

      <div ref={heroContainer} className="relative w-full h-screen overflow-hidden">
        <img src={data.hero.backgroundImage} className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-150 brightness-50 z-0" />
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none flex items-center justify-center mix-blend-multiply bg-[var(--bg-primary)]/10">
          <svg ref={heroMask} viewBox="0 0 100 100" className="w-[30vw] h-[30vw] will-change-transform fill-[var(--bg-primary)]">
            <path d="M 0,0 L 100,0 L 100,100 L 0,100 Z M 50,15 L 65,42 L 95,42 L 70,60 L 80,90 L 50,72 L 20,90 L 30,60 L 5,42 L 35,42 Z" />
          </svg>
        </div>
        <div className="absolute bottom-16 left-12 z-20 font-mono text-[var(--text-primary)]">
          <p className="text-xs text-[var(--color-accent)] tracking-[0.3em] font-bold mb-2">{data.hero.subtitle}</p>
        </div>
      </div>

      <div ref={galleryContainer} className="relative w-full md:h-screen overflow-hidden md:overflow-visible">
        <div ref={galleryTrack} className="relative md:absolute md:inset-y-0 left-0 flex flex-col md:flex-row items-center gap-16 px-4 md:px-16 py-16 md:py-0 h-auto md:h-full z-10 will-change-transform">
          {data.media.map((item) => (
            <MediaCard key={item.id} item={item} onTrack={setHoveredData} onSelect={setActiveMedia} />
          ))}
        </div>
      </div>

      {activeMedia && <Lightbox activePhoto={activeMedia} onClose={() => setActiveMedia(null)} />}
    </main>
  );
}

function MediaCard({ item, onTrack, onSelect }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    onTrack({ p1: item.param1 || '---', p2: item.param2 || '---', p3: item.param3 || '---' });
    if (item.type === 'video' && videoRef.current) videoRef.current.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    onTrack({ p1: '---', p2: '---', p3: '---' });
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
      onClick={() => onSelect(item)}
      className="group relative flex-shrink-0 w-full md:w-[45vw] aspect-video bg-zinc-950 border border-[var(--border-primary)] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-colors hover:border-[var(--color-accent)]"
    >
      {item.type === 'video' ? (
        <video ref={videoRef} src={item.src} loop muted playsInline controlsList="nodownload" className="w-full h-full object-contain md:object-cover filter grayscale contrast-125 brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 will-change-transform translate-z-0" />
      ) : (
        <img src={item.src} alt={item.title} className="w-full h-full object-contain md:object-cover filter grayscale contrast-125 brightness-75 transition-all duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 will-change-transform translate-z-0" />
      )}
      <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 mix-blend-overlay transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end font-mono text-xs text-white">
        <h3 className="font-cinzel text-2xl font-bold uppercase tracking-widest text-white">{item.title}</h3>
      </div>
    </div>
  );
}

function Lightbox({ activePhoto, onClose }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  }, [activePhoto]);

  return (
    <div className="fixed inset-0 z-[500] bg-[var(--bg-primary)] flex items-center justify-center p-4 md:p-12">
      <div className="absolute inset-0 bg-[var(--color-accent)] z-50 pointer-events-none shutter-close" />
      
      <div ref={containerRef} className="relative z-10 w-full max-w-5xl h-[70vh] flex items-center justify-center bg-black border border-white/10 shadow-2xl overflow-hidden">
        {activePhoto.type === 'video' ? (
          <video src={activePhoto.src} loop autoPlay muted playsInline controlsList="nodownload" className="w-full h-full object-contain max-h-full max-w-full p-4" />
        ) : (
          <img src={activePhoto.src} alt={activePhoto.title} className="w-full h-full object-contain max-h-full max-w-full p-4" />
        )}
        <button onClick={onClose} className="absolute top-4 right-6 z-20 font-mono text-xs tracking-widest text-[var(--color-accent)] bg-black/50 px-2 py-1 backdrop-blur-sm">[ ESCAPE_VIEW ]</button>
      </div>

      <div className="absolute bottom-4 md:bottom-10 inset-x-6 md:inset-x-16 z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pointer-events-none">
        <div>
          <span className="font-mono text-[9px] text-[var(--color-hud)] tracking-widest uppercase drop-shadow-md bg-black/80 px-1">— TITULUS REALITAS —</span>
          <h2 className="font-cinzel text-2xl md:text-5xl font-bold tracking-widest text-[var(--text-primary)] uppercase drop-shadow-lg">{activePhoto.title}</h2>
        </div>
        <div className="flex gap-6 font-mono border-t md:border-t-0 border-[var(--border-primary)] pt-2 md:pt-0 w-full md:w-auto bg-black/80 md:bg-transparent p-2 md:p-0">
          <div className="flex flex-col"><span className="text-[8px] text-white/40">[I] LUM</span><span className="text-xs font-bold text-[var(--color-hud)]">{activePhoto.param1 || '---'}</span></div>
          <div className="flex flex-col"><span className="text-[8px] text-white/40">[II] SCIS</span><span className="text-xs font-bold text-[var(--color-hud)]">{activePhoto.param2 || '---'}</span></div>
          <div className="flex flex-col"><span className="text-[8px] text-white/40">[III] TEMP</span><span className="text-xs font-bold text-[var(--color-hud)]">{activePhoto.param3 || '---'}</span></div>
        </div>
      </div>
    </div>
  );
}
