'use client';

import { Facebook, Instagram, ExternalLink, ThumbsUp, Heart, MessageSquare, Share2, Video } from 'lucide-react';
import Image from 'next/image';

interface SocialFeedsHubProps {
  className?: string;
}

export function SocialFeedsHub({ className = '' }: SocialFeedsHubProps) {
  const fbPageUrl = 'https://www.facebook.com/Internetkiawaaz/';
  const encodedFbUrl = encodeURIComponent(fbPageUrl);
  const fbEmbedUrl = `https://www.facebook.com/plugins/page.php?href=${encodedFbUrl}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  const igProfileUrl = 'https://www.instagram.com/internetkiawaaz/';
  const igEmbedUrl = 'https://www.instagram.com/internetkiawaaz/embed/';

  return (
    <section className={`space-y-4 ${className}`} lang="hi">
      {/* Section Headline */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-red-700">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"></span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            सोशल मीडिया लाइव हब
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-medium">Facebook & Instagram Realtime Streams</span>
      </div>

      {/* Side-by-Side Dual Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* ================= COLUMN 1: FACEBOOK PAGE FEED ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Facebook size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                    <span>फ़ेसबुक लाइव फ़ीड</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Official Page
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ताज़ा पोस्ट्स, जन-मुद्दे और क्षेत्रीय हलचल
                  </p>
                </div>
              </div>

              <a
                href={fbPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shrink-0"
              >
                <ThumbsUp size={13} />
                <span>पेज फ़ॉलो करें</span>
                <ExternalLink size={11} className="opacity-80" />
              </a>
            </div>

            {/* Facebook Iframe Container */}
            <div className="w-full flex justify-center bg-slate-50 rounded-xl border border-slate-200/80 p-2 overflow-hidden h-[500px]">
              <iframe
                src={fbEmbedUrl}
                width="100%"
                height="500"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Internet Ki Awaaz Facebook Feed"
                className="w-full max-w-[500px] h-[500px] rounded-lg"
              ></iframe>
            </div>
          </div>

          {/* Facebook Footer Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MessageSquare size={13} className="text-blue-600" />
              <span>ताज़ा टिप्पणियों में भाग लें</span>
            </span>
            <a
              href={fbPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Share2 size={13} />
              <span>fb.com/Internetkiawaaz</span>
            </a>
          </div>
        </div>

        {/* ================= COLUMN 2: INSTAGRAM PAGE & REELS FEED ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Instagram size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                    <span>इंस्टाग्राम रील्स व फ़ोटो</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200">
                      @internetkiawaaz
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ग्राउंड रील्स, विजुअल स्टोरीज़ और ब्रेकिंग अपडेट्स
                  </p>
                </div>
              </div>

              <a
                href={igProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Heart size={13} />
                <span>फ़ॉलो करें</span>
                <ExternalLink size={11} className="opacity-80" />
              </a>
            </div>

            {/* Instagram Profile & Embed Container */}
            <div className="w-full bg-slate-50 rounded-xl border border-slate-200/80 p-2 overflow-hidden h-[500px] flex flex-col">
              <iframe
                src={igEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="auto"
                frameBorder="0"
                allowFullScreen={true}
                title="Internet Ki Awaaz Instagram Feed"
                className="w-full h-full rounded-lg bg-white"
              ></iframe>
            </div>
          </div>

          {/* Instagram Footer Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Video size={13} className="text-pink-600" />
              <span>वायरल रील्स और स्टोरीज़ देखें</span>
            </span>
            <a
              href={igProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Instagram size={13} />
              <span>instagram.com/internetkiawaaz</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
