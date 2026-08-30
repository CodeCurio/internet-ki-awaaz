'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Landmark, MapPin, Scroll, Megaphone, BookOpen, PlayCircle } from 'lucide-react';

const CATEGORY_ITEMS = [
  { name: 'होम', slug: '', href: '/', icon: Home },
  { name: 'सियासत', slug: 'siyasat', href: '/category/siyasat', icon: Landmark },
  { name: 'गोंडा आंचल', slug: 'gonda-aanchal', href: '/category/gonda-aanchal', icon: MapPin },
  { name: 'इतिहास व विरासत', slug: 'itihas-virasat', href: '/category/itihas-virasat', icon: Scroll },
  { name: 'जन-आवाज़', slug: 'jan-awaaz', href: '/category/jan-awaaz', icon: Megaphone },
  { name: 'साहित्य एवं मंच', slug: 'sahitya-manch', href: '/category/sahitya-manch', icon: BookOpen },
  { name: 'वीडियो डेस्क', slug: 'video-desk', href: '/video-desk', icon: PlayCircle },
];

const STATIC_NAV_LINKS = [
  { name: 'हमारे बारे में', href: '/about' },
  { name: 'संपर्क करें', href: '/contact' },
];

export function StickyNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-40 bg-slate-900 text-white transition-shadow duration-200 border-y border-slate-800 ${
        isScrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Desktop Horizontal Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 overflow-x-auto no-scrollbar">
            {CATEGORY_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-red-700 text-white shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Static Links (About & Contact) */}
          <div className="hidden lg:flex items-center space-x-2 shrink-0 pl-3 border-l border-slate-800 text-xs font-bold">
            {STATIC_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-red-700/80 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile Header Bar */}
          <div className="flex items-center justify-between w-full lg:hidden">
            <span className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              इंटरनेट की आवाज़
            </span>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              aria-label={mobileMenuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-6 space-y-1 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          {CATEGORY_ITEMS.map((item) => {
            const isActive =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-red-700 text-white'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-3 mt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <Link
              href="/about"
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-center text-xs font-bold transition-colors"
            >
              हमारे बारे में (About)
            </Link>
            <Link
              href="/contact"
              className="px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-center text-xs font-bold transition-colors"
            >
              संपर्क करें (Contact)
            </Link>
          </div>

          <div className="pt-2 flex justify-around text-[11px] text-slate-400">
            <Link href="/static/privacy-policy" className="hover:text-white">गोपनीयता नीति</Link>
            <span>•</span>
            <Link href="/static/terms-of-service" className="hover:text-white">नियम व शर्तें</Link>
            <span>•</span>
            <Link href="/static/grievance-redressal" className="hover:text-white">शिकायत निवारण</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
