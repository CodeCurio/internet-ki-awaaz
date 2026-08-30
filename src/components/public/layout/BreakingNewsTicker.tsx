'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { BreakingNewsRow } from '@/types/domain.types';

export function BreakingNewsTicker({ initialItems }: { initialItems?: any[] }) {
  const [items, setItems] = useState<any[]>(initialItems || []);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // Fetch live active non-expired breaking news from API
  useEffect(() => {
    const fetchLiveBreaking = async () => {
      try {
        const res = await fetch('/api/breaking-news');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.items)) {
            setItems(data.items);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchLiveBreaking();
  }, []);

  // Supabase Realtime channel for instant alerts
  useEffect(() => {
    try {
      const supabase = createClient();
      const channel = supabase
        .channel('breaking-news-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'breaking_news' },
          async () => {
            const res = await fetch('/api/breaking-news');
            if (res.ok) {
              const data = await res.json();
              if (data.items) setItems(data.items);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignored
    }
  }, []);

  if (items.length === 0) return null;

  const displayItems =
    items.length === 1
      ? [items[0], items[0], items[0], items[0]]
      : items.length === 2
      ? [...items, ...items, ...items]
      : [...items, ...items];

  return (
    <div className="bg-red-700 text-white overflow-hidden flex items-stretch border-b border-red-800 shadow-inner" lang="hi">
      {/* Static "Breaking" Tag on Left */}
      <div className="bg-red-800 px-3.5 py-2 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider z-10 shrink-0 shadow-md">
        <Zap size={14} className="text-yellow-300 fill-yellow-300 animate-bounce" />
        <span className="text-white">ताज़ा ख़बर</span>
      </div>

      {/* Ticker Content Marquee */}
      <div className="flex-1 overflow-hidden relative flex items-center py-2">
        <div className="animate-ticker space-x-12 px-4 whitespace-nowrap">
          {displayItems.map((item, idx) => {
            const isCritical = item.priority === 'critical';
            const linkHref = item.linked_post?.slug
              ? `/news/${item.linked_post.slug}`
              : item.linked_post_id
              ? `/news/${item.linked_post_id}`
              : null;

            return (
              <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium">
                {isCritical && (
                  <span className="px-1.5 py-0.5 bg-yellow-400 text-red-900 font-extrabold text-[10px] rounded uppercase animate-pulse">
                    अति महत्वपूर्ण
                  </span>
                )}
                {linkHref ? (
                  <Link
                    href={linkHref}
                    className="hover:underline hover:text-yellow-200 transition-colors cursor-pointer"
                  >
                    {item.headline_hi}
                  </Link>
                ) : (
                  <span>{item.headline_hi}</span>
                )}
                <span className="text-red-400 select-none font-bold">•</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
