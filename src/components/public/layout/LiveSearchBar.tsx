'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Loader2, Clock, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';

const TRENDING_KEYWORDS = [
  'गोंडा',
  'कैसरगंज',
  'सियासत',
  'बृजभूषण',
  'UGC',
  'अधिवक्ता',
  'मेडिकल कॉलेज',
  'पृथ्वीनाथ मंदिर',
];

export function LiveSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error('Search fetch error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/news/${results[selectedIndex].slug}`);
        setIsOpen(false);
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
      }
    }
  };

  const handleChipClick = (kw: string) => {
    setQuery(kw);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-[360px] xl:w-[400px]">
      {/* Search Input Box */}
      <div
        className={`relative flex items-center bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 rounded-full border transition-all shadow-xs ${
          isOpen
            ? 'border-red-600 ring-2 ring-red-100 dark:ring-red-950/40 bg-white dark:bg-slate-800'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
        }`}
      >
        <div className="pl-3.5 pr-1.5 text-slate-400 dark:text-slate-500">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-red-600 dark:text-red-400" />
          ) : (
            <Search size={16} className={isOpen ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="समाचार, मुद्दे व क्षेत्र खोजें..."
          className="w-full py-1.5 pr-9 text-xs text-slate-900 dark:text-slate-100 bg-transparent placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          aria-label="समाचार खोजें"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="खोज साफ़ करें"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Live Dropdown Overlay */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-150" lang="hi">
          {/* Section 1: Trending Suggestions when query is empty */}
          {!query.trim() && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <TrendingUp size={14} className="text-red-600" />
                <span>ट्रेंडिंग सर्च कीवर्ड्स</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleChipClick(kw)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-medium transition-colors border border-slate-200/80 cursor-pointer"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Loading State */}
          {query.trim() && loading && (
            <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-red-600" />
              <span>खोज परिणाम लोड हो रहे हैं...</span>
            </div>
          )}

          {/* Section 3: Matching Live Results */}
          {query.trim() && !loading && results.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100">
                <span>शीर्ष परिणाम ({results.length})</span>
                <span className="text-[10px] text-slate-400 font-mono">Enter दबाकर चयन करें</span>
              </div>
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
                {results.map((post, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <Link
                      key={post.id || idx}
                      href={`/news/${post.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-start gap-3 p-3 transition-colors ${
                        isSelected ? 'bg-red-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      {post.featured_image_url && (
                        <div className="relative w-14 h-11 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                          <img
                            src={post.featured_image_url}
                            alt={post.title_hi}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {post.category?.name_hi && (
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.2 rounded">
                              {post.category.name_hi}
                            </span>
                          )}
                          {post.published_at && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock size={10} />
                              {formatRelativeHindiTime(post.published_at)}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-700">
                          {post.title_hi}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Search All Footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-red-700 hover:text-red-800 font-bold transition-colors cursor-pointer"
                >
                  <span>"{query}" के लिए सभी परिणाम देखें</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Section 4: No Results State */}
          {query.trim() && !loading && results.length === 0 && (
            <div className="p-6 text-center space-y-2">
              <Sparkles size={24} className="text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">
                "{query}" के लिए कोई समाचार नहीं मिला
              </p>
              <p className="text-[11px] text-slate-400">
                कृपया कीवर्ड की वर्तनी जांचें अथवा नीचे दिए ट्रेंडिंग विषयों में से चुनें:
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {TRENDING_KEYWORDS.slice(0, 5).map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleChipClick(kw)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    #{kw}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
