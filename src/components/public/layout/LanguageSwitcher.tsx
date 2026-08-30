'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, Check, ChevronDown, Languages } from 'lucide-react';

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी', sub: 'Hindi', flag: '🇮🇳' },
  { code: 'en', label: 'English', sub: 'अंग्रेज़ी', flag: '🇬🇧' },
  { code: 'ur', label: 'اردو', sub: 'Urdu', flag: '🇮🇳' },
  { code: 'bho', label: 'भोजपुरी', sub: 'Bhojpuri', flag: '🇮🇳' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('hi');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check google translate cookie
    const cookies = document.cookie.split(';');
    const googTransCookie = cookies.find((c) => c.trim().startsWith('googtrans='));
    if (googTransCookie) {
      const val = googTransCookie.split('=')[1]?.trim();
      const targetLang = val?.split('/')[2];
      if (targetLang && ['hi', 'en', 'ur', 'bho'].includes(targetLang)) {
        setCurrentLang(targetLang);
      }
    }

    // Initialize Google Translate Script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'hi',
              includedLanguages: 'hi,en,ur,bho,bn,mr,gu,ta,te',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    if (langCode === 'hi') {
      // Reset to original Hindi
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      window.location.reload();
    } else {
      // Set google translation cookie for target language
      document.cookie = `googtrans=/hi/${langCode}; path=/;`;
      document.cookie = `googtrans=/hi/${langCode}; path=/; domain=` + window.location.hostname;
      window.location.reload();
    }
  };

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left notranslate" translate="no" ref={dropdownRef}>
      {/* Hidden container for Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      {/* Main Switcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
        aria-label="भाषा बदलें / Translate Language"
        title="भाषा बदलें / Translate Language"
      >
        <Languages size={15} className="text-red-600 dark:text-red-400 shrink-0" />
        <span className="font-semibold">{selectedLangObj.label}</span>
        <ChevronDown size={13} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Language Selector Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            भाषा चुनें (Select Language)
          </div>

          <div className="p-1 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <div className="text-left">
                      <span className="block font-semibold">{lang.label}</span>
                      <span className="text-[10px] text-slate-400 block -mt-0.5">{lang.sub}</span>
                    </div>
                  </div>
                  {isSelected && <Check size={14} className="text-red-600 dark:text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
