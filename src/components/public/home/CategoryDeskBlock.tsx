import Link from 'next/link';
import { ChevronRight, Clock, Landmark, Scroll, Megaphone, BookOpen } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';
import type { PostWithRelations } from '@/types/domain.types';

interface CategoryDeskBlockProps {
  titleHi: string;
  slug: string;
  variant?: 'standard' | 'sepia' | 'politics_rail' | 'opinion';
  posts?: PostWithRelations[];
}

export function CategoryDeskBlock({ titleHi, slug, variant = 'standard', posts = [] }: CategoryDeskBlockProps) {
  if (posts.length === 0) return null;

  // Variant 1: Sepia Toned Heritage Block ("गोंडा का असली इतिहास")
  if (variant === 'sepia') {
    return (
      <section className="my-10 bg-amber-50/70 border-2 border-amber-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-200 text-amber-900 rounded-lg shadow-inner">
              <Scroll size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-amber-950 font-serif tracking-tight">{titleHi}</h2>
              <p className="text-xs text-amber-800">प्राचीन धरोहर, ऐतिहासिक दस्तावेज एवं गौरवशाली गाथाएं</p>
            </div>
          </div>
          <Link
            href={`/category/${slug}`}
            className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-700 bg-amber-200/60 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>सभी देखें</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-white/90 backdrop-blur rounded-xl border border-amber-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
            >
              {post.featured_image_url && (
                <Link href={`/news/${post.slug}`} className="block relative aspect-video overflow-hidden bg-amber-100">
                  <img
                    src={post.featured_image_url}
                    alt={post.title_hi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 sepia-[0.25]"
                  />
                </Link>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/news/${post.slug}`}>
                    <h3 className="text-base font-bold text-amber-950 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug">
                      {post.title_hi}
                    </h3>
                  </Link>
                  {post.excerpt_hi && (
                    <p className="text-xs text-amber-900/80 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt_hi}
                    </p>
                  )}
                </div>
                <div className="text-[11px] text-amber-800/70 mt-4 pt-2 border-t border-amber-100 flex items-center gap-1" suppressHydrationWarning>
                  <Clock size={11} />
                  {formatRelativeHindiTime(post.published_at)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Variant 2: Horizontal Rail ("सियासत के सिरमौर")
  if (variant === 'politics_rail') {
    return (
      <section className="my-10 bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-600 text-white rounded-lg">
              <Landmark size={20} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{titleHi}</h2>
              <p className="text-xs text-slate-400">चुनावी समीकरण, सियासी विश्लेषण और जमीनी राजनीति</p>
            </div>
          </div>
          <Link
            href={`/category/${slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
          >
            <span>सभी देखें</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.slice(0, 4).map((post) => (
            <article
              key={post.id}
              className="bg-slate-800/90 rounded-xl border border-slate-700/60 overflow-hidden hover:border-red-600 transition-colors group flex flex-col"
            >
              {post.featured_image_url && (
                <Link href={`/news/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={post.featured_image_url}
                    alt={post.title_hi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <Link href={`/news/${post.slug}`}>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                    {post.title_hi}
                  </h3>
                </Link>
                <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1" suppressHydrationWarning>
                  <Clock size={11} />
                  {formatRelativeHindiTime(post.published_at)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    );
  }

  // Variant 3: Standard 4-Column Grid
  return (
    <section className="my-10">
      <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-red-700">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-6 bg-red-700 rounded-sm"></span>
          <span>{titleHi}</span>
        </h2>
        <Link
          href={`/category/${slug}`}
          className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-900 transition-colors"
        >
          <span>और पढ़ें</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {posts.slice(0, 4).map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
          >
            {post.featured_image_url && (
              <Link href={`/news/${post.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100">
                <img
                  src={post.featured_image_url}
                  alt={post.title_hi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            )}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <Link href={`/news/${post.slug}`}>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                  {post.title_hi}
                </h3>
              </Link>
              <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>{post.author?.full_name_hi || post.author?.full_name}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {formatRelativeHindiTime(post.published_at)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
