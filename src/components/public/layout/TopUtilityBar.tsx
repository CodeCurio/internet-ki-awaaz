'use client';

import { useState, useEffect } from 'react';
import { formatHindiTimeClock } from '@/lib/utils';
import { CloudSun, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function TopUtilityBar() {
  const [mounted, setMounted] = useState(false);
  const [clock, setClock] = useState<{ dayDate: string; timeString: string }>({
    dayDate: '',
    timeString: '',
  });

  useEffect(() => {
    setMounted(true);
    setClock(formatHindiTimeClock(new Date()));
    const interval = setInterval(() => {
      setClock(formatHindiTimeClock(new Date()));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 tracking-wide select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Realtime Hindi IST Clock */}
        <div className="flex items-center gap-2" suppressHydrationWarning>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-200 notranslate" translate="no" suppressHydrationWarning>
            {mounted && clock.dayDate
              ? `${clock.dayDate} • ${clock.timeString}`
              : 'इंटरनेट की आवाज़ • लाइव डिजिटल समाचार मंच'}
          </span>
        </div>

        {/* Center: Gonda Weather Badge (Desktop) */}
        <div
          className="hidden md:flex items-center gap-2 text-slate-300 bg-slate-800/80 py-0.5 px-3 rounded-full border border-slate-700/50 shadow-inner notranslate"
          translate="no"
          suppressHydrationWarning
        >
          <CloudSun size={14} className="text-amber-400" />
          <span suppressHydrationWarning className="notranslate" translate="no">
            गोंडा, उत्तर प्रदेश: <strong>३१°C</strong> (साफ मौसम)
          </span>
        </div>

        {/* Right: Helpline & Staff Login */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="tel:07905895936"
            className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors font-medium text-xs bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/60 notranslate"
            translate="no"
            suppressHydrationWarning
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span suppressHydrationWarning>हेल्पलाइन: <strong>07905895936</strong></span>
          </a>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium hover:underline text-xs notranslate"
            translate="no"
            suppressHydrationWarning
          >
            <ShieldCheck size={14} className="text-red-400" />
            <span suppressHydrationWarning>स्टाफ लॉगिन</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
