'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Youtube, PlayCircle, Clock, Play, ExternalLink, Radio } from 'lucide-react';

const REAL_ALL_VIDEOS = [
  {
    id: 'Kk-itjV99aI',
    youtubeId: 'Kk-itjV99aI',
    titleHi: 'भाजपा विधायक पलटूराम का बिजली विभाग के जेई को गाली देने का ऑडियो वायरल | मुंह में पेशाब कर देता हूं.',
    views: '8,700 दृश्य',
    time: 'विशेष रिपोर्ट',
    duration: '06:24',
    thumbnail: 'https://i.ytimg.com/vi/Kk-itjV99aI/hqdefault.jpg',
  },
  {
    id: 'AVwRPFL4684',
    youtubeId: 'AVwRPFL4684',
    titleHi: 'थारू समाज के साथ होली के रंग में रंगे पूर्व सांसद बृजभूषण शरण सिंह का डांस करते हुए वीडियो वायरल',
    views: '5,800 दृश्य',
    time: 'वायरल वीडियो',
    duration: '02:00',
    thumbnail: 'https://i.ytimg.com/vi/AVwRPFL4684/hqdefault.jpg',
  },
  {
    id: 'ZptDGDqBJeE',
    youtubeId: 'ZptDGDqBJeE',
    titleHi: 'गोंडा में हाईकोर्ट अधिवक्ता हत्याकांड पर अबतक क्या क्या हुआ, भाजपा विधायक का क्यों हो रहा विरोध',
    views: '12,000 दृश्य',
    time: 'खोजी पड़ताल',
    duration: '06:57',
    thumbnail: 'https://i.ytimg.com/vi/ZptDGDqBJeE/hqdefault.jpg',
  },
  {
    id: 'ar-l4SfMOUw',
    youtubeId: 'ar-l4SfMOUw',
    titleHi: 'Gonda : UPSC Aspirants ने प्रेमिका के शौक पूरा करने के लिए कर दिया भाई का कत्ल',
    views: '7,200 दृश्य',
    time: 'क्राइम बुलेटिन',
    duration: '07:06',
    thumbnail: 'https://i.ytimg.com/vi/ar-l4SfMOUw/hqdefault.jpg',
  },
  {
    id: 'cIUgGSN0q8k',
    youtubeId: 'cIUgGSN0q8k',
    titleHi: 'UGC को लेकर गोंडा में सवर्ण आर्मी का विरोध प्रदर्शन नरेंद्र मोदी मुर्दाबाद के लगे नारे',
    views: '4,500 दृश्य',
    time: 'ग्राउंड रिपोर्ट',
    duration: '03:29',
    thumbnail: 'https://i.ytimg.com/vi/cIUgGSN0q8k/hqdefault.jpg',
  },
  {
    id: 'fWw157rbNu8',
    youtubeId: 'fWw157rbNu8',
    titleHi: 'UGC के नाम क्यों छिड़ा संग्राम ? भाजपा की उल्टी गिनती चालू नरेंद्र मोदी शर्म करें | UGC ACT 2026 |',
    views: '8,200 दृश्य',
    time: 'राजनीतिक बहस',
    duration: '22:12',
    thumbnail: 'https://i.ytimg.com/vi/fWw157rbNu8/hqdefault.jpg',
  },
  {
    id: 'iy11CwMKf5E',
    youtubeId: 'iy11CwMKf5E',
    titleHi: 'Avimukteshwaranand Saraswati ने कहां अखिलेश यादव ने भी मरवाई थी लाठी',
    views: '4,900 दृश्य',
    time: 'धार्मिक व राजनीतिक',
    duration: '03:40',
    thumbnail: 'https://i.ytimg.com/vi/iy11CwMKf5E/hqdefault.jpg',
  },
  {
    id: 'Xi43vuDkUBA',
    youtubeId: 'Xi43vuDkUBA',
    titleHi: 'गोंडा में फर्जी STF बनकर महंत से कीमती चांदी के सिक्के लूटना पड़ा भारी, पुलिस ने 6 को किया गिरफ्तार',
    views: '6,800 दृश्य',
    time: 'पुलिस खुलासा',
    duration: '03:16',
    thumbnail: 'https://i.ytimg.com/vi/Xi43vuDkUBA/hqdefault.jpg',
  },
  {
    id: 'n_Et-qsea0s',
    youtubeId: 'n_Et-qsea0s',
    titleHi: 'UPPSC के सामने आंदोलन कर रहे इस छात्र का गीत जिम्मेदारों को चुभ जायेगा | UPPSC PROTEST PRAYAGRAJ |',
    views: '9,500 दृश्य',
    time: 'छात्र आंदोलन',
    duration: '04:15',
    thumbnail: 'https://i.ytimg.com/vi/n_Et-qsea0s/hqdefault.jpg',
  },
  {
    id: '3VYhrw0hYNc',
    youtubeId: '3VYhrw0hYNc',
    titleHi: 'UPPSC Protest के पहले ही इस छात्र को क्यों ले गई पुलिस | UPPSC PROTEST | PRAYAGRAJ |',
    views: '11,000 दृश्य',
    time: 'प्रयागराज कवरेज',
    duration: '05:30',
    thumbnail: 'https://i.ytimg.com/vi/3VYhrw0hYNc/hqdefault.jpg',
  },
];

export default function VideoDeskPage() {
  const [activeVideo, setActiveVideo] = useState<any>(REAL_ALL_VIDEOS[0]);
  const channelUrl = 'https://www.youtube.com/@InternetKiAwaaz';
  const subscribeUrl = 'https://www.youtube.com/@InternetKiAwaaz?sub_confirmation=1';

  return (
    <div className="py-4 space-y-8" lang="hi">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white">होम</Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">वीडियो डेस्क</span>
          </nav>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <PlayCircle className="text-red-500" size={36} />
            <span>वीडियो डेस्क व ग्राउंड रिपोर्ट्स</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            इंटरनेट की आवाज़ के आधिकारिक यूट्यूब चैनल <span className="text-red-400 font-semibold">@InternetKiAwaaz</span> से सीधे जुड़े विशेष वीडियो बुलेटिन, जनसमस्याओं पर ग्राउंड रिपोर्ट्स और विशेष पड़ताल।
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg transition-all"
          >
            <Youtube size={20} />
            <span>यूट्यूब पर सब्सक्राइब करें</span>
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <span>चैनल विज़िट करें</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Featured Video Player */}
      {activeVideo && (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                वर्तमान में चल रहा वीडियो
              </span>
            </div>
            <span className="text-xs text-red-400 font-medium">{activeVideo.time}</span>
          </div>

          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              title={activeVideo.titleHi}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {activeVideo.titleHi}
            </h2>
            <a
              href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 shrink-0"
            >
              <span>यूट्यूब पर खोलें</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
          सभी वीडियो रिपोर्ट्स ({REAL_ALL_VIDEOS.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REAL_ALL_VIDEOS.map((video) => {
            const isCurrent = activeVideo?.id === video.id;
            return (
              <article
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer flex flex-col justify-between group ${
                  isCurrent ? 'border-red-600 ring-2 ring-red-600 shadow-md' : 'border-slate-200 hover:shadow-lg'
                }`}
              >
                <div className="block relative aspect-video bg-slate-900 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.titleHi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                    <span className="w-12 h-12 rounded-full bg-red-700/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-red-600 transition-transform">
                      <Play size={20} fill="white" className="ml-0.5" />
                    </span>
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h2 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                    {video.titleHi}
                  </h2>
                  <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span>{video.views}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      {video.time}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
