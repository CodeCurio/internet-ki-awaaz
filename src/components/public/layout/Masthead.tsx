import Link from 'next/link';
import Image from 'next/image';
import { Flame, Youtube, Facebook, Instagram } from 'lucide-react';
import { LiveSearchBar } from './LiveSearchBar';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Masthead() {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-4 sm:px-6 relative shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-colors duration-200" lang="hi">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Brand Logo + Wordmark & Tagline */}
        <div className="flex items-center self-start lg:self-auto">
          <Link href="/" className="inline-flex items-center gap-3.5 group focus:outline-none">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800">
              <Image
                src="/logo.png"
                alt="इंटरनेट की आवाज़ लोगो"
                fill
                sizes="56px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="text-left" suppressHydrationWarning>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-500 transition-colors leading-tight notranslate" translate="no" suppressHydrationWarning>
                <span className="text-red-700 dark:text-red-500 notranslate" translate="no" suppressHydrationWarning>इंटरनेट</span> की आवाज़
              </h1>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 tracking-wide mt-0.5" suppressHydrationWarning>
                ख़बर, ज्ञान और जन-सरोकार का डिजिटल मंच
              </p>
              <p className="text-[9px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-400 mt-0.5">
                Forvishganj, Gonda • Devi Patan Mandal • Uttar Pradesh
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Social Media Icons + Language Switcher + Theme Toggle + Search + Video Bulletin */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-3.5 w-full lg:w-auto">
          {/* Social Media Cluster */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 px-2 py-1 rounded-full shadow-inner">
            <a
              href="https://www.youtube.com/@InternetKiAwaaz"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white flex items-center justify-center transition-all shadow-xs border border-slate-200/60 dark:border-slate-600"
              aria-label="यूट्यूब पर फ़ॉलो करें"
              title="YouTube: @InternetKiAwaaz"
            >
              <Youtube size={15} />
            </a>
            <a
              href="https://www.facebook.com/Internetkiawaaz/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white flex items-center justify-center transition-all shadow-xs border border-slate-200/60 dark:border-slate-600"
              aria-label="फ़ेसबुक पर फ़ॉलो करें"
              title="Facebook: @Internetkiawaaz"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://www.instagram.com/internetkiawaaz/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-700 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 text-pink-600 dark:text-pink-400 hover:text-white dark:hover:text-white flex items-center justify-center transition-all shadow-xs border border-slate-200/60 dark:border-slate-600"
              aria-label="इंस्टाग्राम पर फ़ॉलो करें"
              title="Instagram: @internetkiawaaz"
            >
              <Instagram size={15} />
            </a>
          </div>

          {/* Language Translate Selector */}
          <LanguageSwitcher />

          {/* Day / Night Theme Switch */}
          <ThemeToggle />

          {/* Advanced In-Navbar Live Search Bar */}
          <LiveSearchBar />

          {/* Video Bulletin Action */}
          <Link
            href="/video-desk"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-all shadow-xs hover:shadow hover:scale-105 shrink-0"
          >
            <Flame size={14} className="text-amber-300 animate-pulse" />
            <span>वीडियो बुलेटिन</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
