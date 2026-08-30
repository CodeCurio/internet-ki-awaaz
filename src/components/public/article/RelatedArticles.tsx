import Link from 'next/link';
import { createPublicServerClient } from '@/lib/supabase/server';
import { Clock } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';
import type { PostWithRelations } from '@/types/domain.types';

const MOCK_RELATED: any[] = [
  {
    id: 'rel-1',
    slug: 'gonda-amrit-sarovar-revival-drive',
    title_hi: 'गोंडा जिले के 120 अमृत सरोवरों का जीर्णोद्धार पूरा, भूजल स्तर सुधारने की दिशा में बड़ी पहल',
    featured_image_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600&auto=format&fit=crop',
    published_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    category: { name_hi: 'गोंडा आंचल' },
  },
  {
    id: 'rel-2',
    slug: 'kaiserganj-krishi-vigyan-kendra-advisory',
    title_hi: 'कृषि विज्ञान केंद्र कैसरगंज द्वारा रबी फसलों के लिए मौसम आधारित विशेष सलाह जारी',
    featured_image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop',
    published_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    category: { name_hi: 'जन-आवाज़' },
  },
  {
    id: 'rel-3',
    slug: 'purvanchal-expressway-link-survey-status',
    title_hi: 'पूर्वांचल व बुंदेलखंड लिंक कॉरिडोर से गोंडा को जोड़ने के लिए भूमि सर्वेक्षण शुरू',
    featured_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
    published_at: new Date(Date.now() - 3600000 * 45).toISOString(),
    category: { name_hi: 'सियासत' },
  },
];

export async function RelatedArticles({
  categoryId,
  excludePostId,
}: {
  categoryId?: string;
  excludePostId?: string;
}) {
  let relatedPosts: any[] = [];

  try {
    const supabase = await createPublicServerClient();
    let query = supabase
      .from('posts')
      .select(`
        id,
        title_hi,
        slug,
        featured_image_url,
        published_at,
        category:categories(id, name_hi, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3);

    if (categoryId) query = query.eq('category_id', categoryId);
    if (excludePostId) query = query.neq('id', excludePostId);

    const { data } = await query;
    if (data && data.length > 0) {
      relatedPosts = data;
    }
  } catch {
    // Fallback
  }

  if (relatedPosts.length === 0) {
    relatedPosts = MOCK_RELATED;
  }

  return (
    <section className="mt-12 pt-8 border-t-2 border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-2.5 h-6 bg-red-700 rounded-sm"></span>
        <span>संबंधित एवं अन्य प्रमुख खबरें</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {relatedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
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
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                  {post.title_hi}
                </h4>
              </Link>
              <div className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>{post.category?.name_hi || 'समाचार'}</span>
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
