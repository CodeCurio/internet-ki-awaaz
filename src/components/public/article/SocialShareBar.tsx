'use client';

import { useState } from 'react';
import { Link2, Check, MessageCircle } from 'lucide-react';

interface SocialShareBarProps {
  url: string;
  title: string;
}

export function SocialShareBar({ url, title }: SocialShareBarProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-5 flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-3 bg-white px-3 rounded-lg shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">शेयर करें:</span>
        
        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700 text-xs font-semibold shadow-sm transition-transform active:scale-95"
          aria-label="व्हाट्सएप पर शेयर करें"
        >
          <MessageCircle size={14} />
          <span>व्हाट्सएप</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blue-700 p-2 text-white hover:bg-blue-800 transition-colors shadow-sm"
          aria-label="फेसबुक पर शेयर करें"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H7.9V12h2.6V9.8c0-2.56 1.52-3.98 3.87-3.98 1.12 0 2.3.2 2.3.2v2.53h-1.3c-1.28 0-1.68.8-1.68 1.62V12h2.86l-.46 2.88h-2.4v6.99A10 10 0 0 0 22 12z" />
          </svg>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-black p-2 text-white hover:bg-slate-800 transition-colors shadow-sm"
          aria-label="X पर शेयर करें"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.4l8.1-9.3L1 2h7l4.9 6z" />
          </svg>
        </a>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
      >
        {copied ? <Check size={14} className="text-emerald-600" /> : <Link2 size={14} />}
        {copied ? 'लिंक कॉपी हो गया!' : 'लिंक कॉपी करें'}
      </button>
    </div>
  );
}
