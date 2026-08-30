'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  videoId: string;
  thumbnailUrl: string | null;
  titleHi: string;
}

export function VideoEmbed({ videoId, thumbnailUrl, titleHi }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumb = thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="relative my-6 aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={titleHi}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      className="group relative my-6 block aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-md focus:outline-none focus:ring-4 focus:ring-red-600/50"
      aria-label={`वीडियो चलाएं: ${titleHi}`}
    >
      <img
        src={thumb}
        alt={titleHi}
        className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-700 text-white shadow-2xl transition-transform duration-200 group-hover:scale-110 group-hover:bg-red-600">
          <Play size={28} fill="white" className="ml-1" />
        </span>
      </span>
      <span className="absolute bottom-3 left-3 right-3 text-left text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow">
        ▶ {titleHi}
      </span>
    </button>
  );
}
