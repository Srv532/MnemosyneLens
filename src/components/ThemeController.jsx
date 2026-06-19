'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeController() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-1 font-mono text-[9px] uppercase tracking-widest pointer-events-auto shadow-2xl">
      <span className="text-theme-secondary mb-1 drop-shadow-md bg-panel px-2 py-1">[ SYS_THEME_OVERRIDE ]</span>
      <div className="flex gap-2">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1.5 border transition-colors backdrop-blur-md ${
              theme === t 
                ? 'border-accent bg-accent text-white font-bold shadow-[0_0_15px_rgba(255,0,43,0.5)]' 
                : 'border-theme text-theme bg-panel hover:text-accent hover:border-accent'
            }`}
          >
            {t === 'dark' ? 'MATRIX' : t === 'light' ? 'MONOLITH' : 'SULPHUR'}
          </button>
        ))}
      </div>
    </div>
  );
}
