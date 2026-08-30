import { Clock, Calendar, BookmarkCheck } from 'lucide-react';
import { formatHindiDate } from '@/lib/utils';

interface ArticleHeaderProps {
  titleHi: string;
  subtitleHi?: string | null;
  publishedAt?: string | null;
  readingTimeMinutes?: number | null;
}

export function ArticleHeader({
  titleHi,
  subtitleHi,
  publishedAt,
  readingTimeMinutes,
}: ArticleHeaderProps) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-950 leading-[1.3] tracking-tight mb-3 font-devanagari">
        {titleHi}
      </h1>

      {subtitleHi && (
        <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-4">
          {subtitleHi}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 py-3 border-y border-slate-200">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} className="text-red-700" />
          <span>{formatHindiDate(publishedAt)}</span>
        </div>

        {readingTimeMinutes && (
          <>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-slate-400" />
              <span>{readingTimeMinutes} मिनट में पढ़ें</span>
            </div>
          </>
        )}

        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1 text-slate-600">
          <BookmarkCheck size={14} className="text-emerald-600" />
          <span>प्रमाणित समाचार</span>
        </div>
      </div>
    </header>
  );
}
