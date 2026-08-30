'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Home,
  ArrowLeft,
  Search,
  Compass,
  Landmark,
  PlayCircle,
  Building2,
  Scroll,
  Radio,
  PhoneCall,
  MessageCircle,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const quickLinks = [
    {
      titleHi: 'मुख्य पृष्ठ (Home)',
      descHi: 'ताज़ा व प्रमुख समाचार',
      href: '/',
      icon: Home,
      color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/80',
    },
    {
      titleHi: 'सियासत (Politics)',
      descHi: 'राजनीतिक हलचल व चुनावी समीकरण',
      href: '/category/siyasat',
      icon: Landmark,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/80',
    },
    {
      titleHi: 'वीडियो डेस्क (Video Desk)',
      descHi: 'यूट्यूब बुलेटिन व ग्राउंड रिपोर्ट्स',
      href: '/video-desk',
      icon: PlayCircle,
      color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/80',
    },
    {
      titleHi: 'गोंडा डायरेक्टरी (Directory)',
      descHi: 'अस्पताल, डॉक्टर, सेवाएं व संस्थान',
      href: '/directory',
      icon: Building2,
      color: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/80',
    },
    {
      titleHi: 'इतिहास व विरासत (Heritage)',
      descHi: 'गोंडा व देवीपाटन का गौरवशाली इतिहास',
      href: '/category/itihas-virasat',
      icon: Scroll,
      color: 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100/80',
    },
    {
      titleHi: 'संपर्क व नागरिक सहायता',
      descHi: 'संपादकीय हेल्पलाइन व समाचार सुझाव',
      href: '/contact',
      icon: PhoneCall,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-red-700 selection:text-white" lang="hi">
      {/* Top Mini Brand Bar */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-red-700 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              आ
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight block leading-none">
                इंटरनेट की आवाज़
              </span>
              <span className="text-[10px] text-red-700 font-semibold tracking-wider uppercase font-mono">
                Internet Ki Awaaz News Desk
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Home size={14} />
            <span className="hidden sm:inline">मुख्य पृष्ठ</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Experience */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 flex flex-col items-center text-center">
        {/* News Flash Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100/80 border border-red-200 text-red-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm animate-pulse">
          <Radio size={14} className="text-red-700" />
          <span>त्रुटि कोड 404 • पृष्ठ उपलब्ध नहीं है (Page Not Found)</span>
        </div>

        {/* 404 Visual Motif */}
        <div className="relative mb-6">
          <span className="text-8xl sm:text-9xl font-black text-slate-200/80 select-none tracking-tighter block font-mono">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-red-700 text-white flex items-center justify-center shadow-2xl shadow-red-600/30 rotate-6 hover:rotate-0 transition-transform">
              <FileQuestion size={44} className="animate-bounce" />
            </div>
          </div>
        </div>

        {/* Headline & Explanation */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight max-w-2xl leading-snug mb-3">
          माफ़ कीजिए! आप जिस पृष्ठ या समाचार को खोज रहे हैं, वह उपलब्ध नहीं है।
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-8">
          हो सकता है कि यह समाचार हटा दिया गया हो, उसका लिंक बदल गया हो अथवा आपने कोई गलत URL दर्ज कर दिया हो।
        </p>

        {/* Direct Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-lg mb-10 relative flex items-center group"
        >
          <div className="relative w-full shadow-lg rounded-2xl overflow-hidden border border-slate-300 focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/30 transition-all bg-white flex items-center">
            <Search size={18} className="text-slate-400 ml-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="गोंडा समाचार, राजनीति, लेख अथवा डायरेक्टरी खोजें..."
              className="w-full px-3 py-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="m-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow transition-colors cursor-pointer shrink-0"
            >
              खोजें
            </button>
          </div>
        </form>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Home size={16} />
            <span>मुख्य पृष्ठ पर जाएं (Go to Homepage)</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>पिछला पृष्ठ (Go Back)</span>
          </button>
        </div>

        {/* Explore Other Desks Section */}
        <div className="w-full text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Compass size={18} className="text-red-700" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              इंटरनेट की आवाज़ के प्रमुख अनुभाग व डेस्क (Popular Desks)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`p-4 rounded-2xl border transition-all shadow-sm flex items-start gap-3.5 group ${item.color}`}
                >
                  <div className="p-2 rounded-xl bg-white/80 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                      {item.titleHi}
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {item.descHi}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Editorial Help Desk Banner */}
        <div className="w-full mt-10 p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0">
              <HelpCircle size={22} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">क्या आप किसी विशिष्ट समाचार या सूचना की तलाश में हैं?</p>
              <p className="text-[11px] text-slate-400">हमारी 24x7 संपादकीय व नागरिक हेल्पलाइन डेस्क से सीधे संपर्क करें।</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://wa.me/917905895936?text=नमस्ते%20इंटरनेट%20की%20आवाज़,%20मुझे%20सहायता%20चाहिए।"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-colors"
            >
              <MessageCircle size={14} />
              <span>WhatsApp हेल्पलाइन</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <span>संपर्क फ़ॉर्म</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} इंटरनेट की आवाज़ (Internet Ki Awaaz). सर्वाधिकार सुरक्षित।</p>
      </footer>
    </div>
  );
}
