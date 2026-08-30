'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Youtube, ChevronRight, ExternalLink, Radio, CheckCircle, Flame, Eye } from 'lucide-react';

export const REAL_CHANNEL_VIDEOS = [
  {
    id: 'Kk-itjV99aI',
    youtubeId: 'Kk-itjV99aI',
    titleHi: 'भाजपा विधायक पलटूराम का बिजली विभाग के जेई को गाली देने का ऑडियो वायरल | मुंह में पेशाब कर देता हूं.',
    duration: '06:24',
    views: '8.7K+ दृश्य',
    time: 'विशेष रिपोर्ट',
    thumbnail: 'https://i.ytimg.com/vi/Kk-itjV99aI/hqdefault.jpg',
  },
  {
    id: 'AVwRPFL4684',
    youtubeId: 'AVwRPFL4684',
    titleHi: 'थारू समाज के साथ होली के रंग में रंगे पूर्व सांसद बृजभूषण शरण सिंह का डांस करते हुए वीडियो वायरल',
    duration: '02:00',
    views: '5.8K+ दृश्य',
    time: 'वायरल वीडियो',
    thumbnail: 'https://i.ytimg.com/vi/AVwRPFL4684/hqdefault.jpg',
  },
  {
    id: 'ZptDGDqBJeE',
    youtubeId: 'ZptDGDqBJeE',
    titleHi: 'गोंडा में हाईकोर्ट अधिवक्ता हत्याकांड पर अबतक क्या क्या हुआ, भाजपा विधायक का क्यों हो रहा विरोध',
    duration: '06:57',
    views: '12K+ दृश्य',
    time: 'खोजी पड़ताल',
    thumbnail: 'https://i.ytimg.com/vi/ZptDGDqBJeE/hqdefault.jpg',
  },
  {
    id: 'ar-l4SfMOUw',
    youtubeId: 'ar-l4SfMOUw',
    titleHi: 'Gonda : UPSC Aspirants ने प्रेमिका के शौक पूरा करने के लिए कर दिया भाई का कत्ल',
    duration: '07:06',
    views: '7.2K+ दृश्य',
    time: 'क्राइम बुलेटिन',
    thumbnail: 'https://i.ytimg.com/vi/ar-l4SfMOUw/hqdefault.jpg',
  },
  {
    id: 'cIUgGSN0q8k',
    youtubeId: 'cIUgGSN0q8k',
    titleHi: 'UGC को लेकर गोंडा में सवर्ण आर्मी का विरोध प्रदर्शन नरेंद्र मोदी मुर्दाबाद के लगे नारे',
    duration: '03:29',
    views: '4.5K+ दृश्य',
    time: 'ग्राउंड रिपोर्ट',
    thumbnail: 'https://i.ytimg.com/vi/cIUgGSN0q8k/hqdefault.jpg',
  },
  {
    id: 'Xi43vuDkUBA',
    youtubeId: 'Xi43vuDkUBA',
    titleHi: 'गोंडा में फर्जी STF बनकर महंत से कीमती चांदी के सिक्के लूटना पड़ा भारी, पुलिस ने 6 को किया गिरफ्तार',
    duration: '03:16',
    views: '6.8K+ दृश्य',
    time: 'पुलिस खुलासा',
    thumbnail: 'https://i.ytimg.com/vi/Xi43vuDkUBA/hqdefault.jpg',
  },
];

export function VideoDeskCarousel({ videos }: { videos?: any[] }) {
  const channelUrl = 'https://www.youtube.com/@InternetKiAwaaz';
  const subscribeUrl = 'https://www.youtube.com/@InternetKiAwaaz?sub_confirmation=1';
  
  const videoList = videos && videos.length > 0 ? videos : REAL_CHANNEL_VIDEOS;
  const [selectedVideo, setSelectedVideo] = useState<any>(videoList[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="my-10 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl overflow-hidden" lang="hi">
      {/* Header with YouTube Channel Profile Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/30 shrink-0">
            <Youtube size={28} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>वीडियो डेस्क</span>
                <span className="text-red-500">Live</span>
              </h2>
              <span className="text-[11px] font-semibold bg-red-950/80 border border-red-800/80 px-2.5 py-0.5 rounded-full text-red-200 flex items-center gap-1">
                <CheckCircle size={12} className="text-red-400" />
                <span>@InternetKiAwaaz</span>
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                12.3K+ सब्सक्राइबर्स
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              इंटरनेट की आवाज़ यूट्यूब चैनल की विशेष ग्राउंड रिपोर्ट्स, लाइव बुलेटिन एवं खोजी पत्रकारिता
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/20 hover:scale-105 cursor-pointer"
          >
            <Youtube size={16} />
            <span>सब्सक्राइब करें</span>
          </a>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-full transition-colors border border-slate-700"
          >
            <span>यूट्यूब चैनल</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Embedded YouTube Channel Stage & Playlist Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 items-stretch">
        
        {/* Left: Main Embedded YouTube Video Player (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-900/90 rounded-2xl border border-slate-800 p-4">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1&rel=0`}
                title={selectedVideo.titleHi || selectedVideo.title_hi}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            ) : (
              <div
                onClick={() => setIsPlaying(true)}
                className="relative w-full h-full group cursor-pointer"
              >
                <img
                  src={selectedVideo.thumbnail || selectedVideo.youtube_thumbnail_url}
                  alt={selectedVideo.titleHi || selectedVideo.title_hi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600/90 text-white text-[11px] font-bold tracking-wide backdrop-blur">
                      <Radio size={12} className="animate-pulse" />
                      विशेष रिपोर्ट
                    </span>
                    <span className="bg-black/70 text-slate-200 text-xs px-2 py-0.5 rounded font-mono">
                      {selectedVideo.duration || '08:00'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                      <Play size={24} fill="white" className="ml-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-red-400 font-semibold mb-0.5">अभी प्ले करें</p>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
                        {selectedVideo.titleHi || selectedVideo.title_hi}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
            <span className="flex items-center gap-2">
              <Eye size={14} className="text-red-400" />
              <span>{selectedVideo.views || '25K+'} व्यूज • {selectedVideo.time || 'ताज़ा'}</span>
            </span>
            <a
              href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId || 'dQw4w9WgXcQ'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1"
            >
              <span>यूट्यूब ऐप में खोलें</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Right: Channel Profile Card & Selectable Playlist (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/60 rounded-2xl border border-slate-800 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
              <Flame size={15} className="text-amber-400" />
              <span>चैनल की प्रमुख वीडियो रिपोर्ट्स</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">४ रिपोर्ट्स</span>
          </div>

          {/* Video List */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-1">
            {videoList.map((video) => {
              const isCurrent = selectedVideo.id === video.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => {
                    setSelectedVideo(video);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 cursor-pointer ${
                    isCurrent
                      ? 'bg-red-950/60 border border-red-700/80 shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <div className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden bg-black">
                    <img
                      src={video.thumbnail || video.youtube_thumbnail_url}
                      alt={video.titleHi || video.title_hi}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play size={14} fill="white" className="text-white" />
                    </span>
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[10px] font-mono px-1 rounded text-slate-200">
                      {video.duration || 'वीडियो'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold line-clamp-2 leading-tight ${isCurrent ? 'text-white' : 'text-slate-200'}`}>
                      {video.titleHi || video.title_hi}
                    </h4>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>{video.views}</span>
                      <span>{video.time}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Direct Channel Embed Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Link
              href="/video-desk"
              className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1"
            >
              <span>संपूर्ण वीडियो लाइब्रेरी</span>
              <ChevronRight size={14} />
            </Link>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
            >
              <span>youtube.com/@InternetKiAwaaz</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

