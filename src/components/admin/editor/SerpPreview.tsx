'use client';

interface SerpPreviewProps {
  seoTitleHi: string;
  seoDescriptionHi: string;
  slug: string;
}

function truncateByGlyphs(text: string, maxGlyphs: number): string {
  const glyphs = Array.from(text);
  if (glyphs.length <= maxGlyphs) return text;
  return glyphs.slice(0, maxGlyphs).join('') + '…';
}

function CharCounter({ value, limit }: { value: string; limit: number }) {
  const length = Array.from(value || '').length;
  const ratio = length / limit;
  const colorClass =
    ratio > 1 ? 'text-red-600 font-bold' : ratio > 0.85 ? 'text-amber-600 font-semibold' : 'text-emerald-600';

  return (
    <span className={`text-[11px] font-mono ${colorClass}`}>
      {length} / {limit} अक्षर
    </span>
  );
}

export function SerpPreview({ seoTitleHi, seoDescriptionHi, slug }: SerpPreviewProps) {
  const cleanSlug = slug || 'sample-news-slug';
  const url = `internetkiawaaz.in › news › ${cleanSlug}`;
  const titleDisplay = seoTitleHi || 'लेख का एसईओ शीर्षक यहाँ दिखाई देगा';
  const descDisplay =
    seoDescriptionHi || 'लेख का संक्षिप्त मेटा विवरण यहाँ गूगल सर्च रिजल्ट्स में दिखाई देगा।';

  return (
    <div className="space-y-4">
      {/* Desktop Preview */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">गूगल डेस्कटॉप प्रीव्यू (Desktop SERP)</span>
          <CharCounter value={seoTitleHi} limit={60} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-3.5 h-3.5 rounded-full bg-red-700 text-white text-[8px] flex items-center justify-center font-bold">
              IKA
            </span>
            <span className="truncate">{url}</span>
          </div>
          <h4 className="text-base text-blue-800 hover:underline cursor-pointer font-medium leading-snug line-clamp-1">
            {truncateByGlyphs(titleDisplay, 60)} | इंटरनेट की आवाज़
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {truncateByGlyphs(descDisplay, 155)}
          </p>
        </div>
      </div>

      {/* Mobile Preview */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">गूगल मोबाइल प्रीव्यू (Mobile SERP)</span>
          <CharCounter value={seoDescriptionHi} limit={155} />
        </div>
        <div className="max-w-[340px] rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
            <span className="w-3 h-3 rounded-full bg-red-700 text-white text-[7px] flex items-center justify-center font-bold">
              IKA
            </span>
            <span className="truncate">{url}</span>
          </div>
          <h4 className="text-sm text-blue-800 font-medium leading-snug line-clamp-2">
            {truncateByGlyphs(titleDisplay, 65)}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {truncateByGlyphs(descDisplay, 120)}
          </p>
        </div>
      </div>
    </div>
  );
}
