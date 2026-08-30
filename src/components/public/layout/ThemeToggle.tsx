'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('ika-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ika-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ika-theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-xs border ${
        isDark
          ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700 hover:text-amber-200'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-red-700'
      }`}
      aria-label={isDark ? 'दिन का मोड चालू करें (Light Mode)' : 'रात्रि का मोड चालू करें (Dark Mode)'}
      title={isDark ? 'दिन का मोड चालू करें (Light Mode)' : 'रात्रि का मोड चालू करें (Dark Mode)'}
    >
      {isDark ? (
        <Sun size={17} className="rotate-0 transition-transform duration-300" />
      ) : (
        <Moon size={17} className="-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
