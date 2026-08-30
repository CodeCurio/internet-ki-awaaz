'use client';

import { Facebook, ExternalLink, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';

interface FacebookPageFeedProps {
  className?: string;
}

export function FacebookPageFeed({ className = '' }: FacebookPageFeedProps) {
  const fbPageUrl = 'https://www.facebook.com/Internetkiawaaz/';
  const encodedFbUrl = encodeURIComponent(fbPageUrl);
  const embedIframeUrl = `https://www.facebook.com/plugins/page.php?href=${encodedFbUrl}&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId`;

  return (
    <section className={`bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm ${className}`} lang="hi">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Facebook size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
              <span>फ़ेसबुक लाइव फ़ीड</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Official Page
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              इंटरनेट की आवाज़ के आधिकारिक फेसबुक पेज से ताज़ा पोस्ट्स और अपडेट्स
            </p>
          </div>
        </div>

        <a
          href={fbPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          <ThumbsUp size={14} />
          <span>पेज फ़ॉलो करें</span>
          <ExternalLink size={12} className="ml-1 opacity-80" />
        </a>
      </div>

      {/* Embedded Facebook Timeline Frame */}
      <div className="w-full flex justify-center bg-slate-50 rounded-xl border border-slate-200/80 p-2 overflow-hidden min-h-[500px]">
        <iframe
          src={embedIframeUrl}
          width="100%"
          height="500"
          style={{ border: 'none', overflow: 'hidden' }}
          scrolling="no"
          frameBorder="0"
          allowFullScreen={true}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          title="Internet Ki Awaaz Facebook Page Timeline Feed"
          className="w-full max-w-[500px] h-[500px] rounded-lg"
        ></iframe>
      </div>

      {/* Bottom Engagement Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <span className="flex items-center gap-1">
          <MessageSquare size={13} className="text-blue-600" />
          <span>ताज़ा चर्चा और टिप्पणियों में भाग लें</span>
        </span>
        <a
          href={fbPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
        >
          <Share2 size={13} />
          <span>facebook.com/Internetkiawaaz</span>
        </a>
      </div>
    </section>
  );
}
