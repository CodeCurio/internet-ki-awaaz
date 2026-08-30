import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Clock, ChevronRight, Landmark, MapPin, Scroll, Megaphone, BookOpen, PlayCircle, Building2 } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';

export const revalidate = 300; // 5 min ISR

interface CategoryPageProps {
  params: { slug: string };
}

const CATEGORY_META: Record<string, { name_hi: string; desc_hi: string; icon: any }> = {
  'siyasat': { name_hi: 'सियासत', desc_hi: 'गोंडा, कैसरगंज और उत्तर प्रदेश की राजनीतिक हलचल और चुनावी समीकरण', icon: Landmark },
  'gonda-aanchal': { name_hi: 'गोंडा आंचल', desc_hi: 'गोंडा जिले की स्थानीय घटनाएं, जन समस्याएं और प्रशासनिक समीक्षा', icon: MapPin },
  'itihas-virasat': { name_hi: 'इतिहास व विरासत', desc_hi: 'गोंडा और देवीपाटन मंडल का गौरवशाली अतीत, धरोहर एवं ऐतिहासिक स्थल', icon: Scroll },
  'jan-awaaz': { name_hi: 'जन-आवाज़', desc_hi: 'जन सरोकार, आम जन की आवाज और समाज को प्रेरित करने वाले व्यक्तित्व', icon: Megaphone },
  'sahitya-manch': { name_hi: 'साहित्य एवं मंच', desc_hi: 'अवधी व हिंदी साहित्य, कवि सम्मेलन, सांस्कृतिक मंच और कला', icon: BookOpen },
  'video-desk': { name_hi: 'वीडियो डेस्क', desc_hi: 'इंटरनेट की आवाज़ के विशेष वीडियो बुलेटिन और ग्राउंड रिपोर्ट्स', icon: PlayCircle },
};

const MOCK_CATEGORY_POSTS: Record<string, any[]> = {
  'siyasat': [
    {
      id: 's-1',
      title_hi: 'कैसरगंज लोकसभा: विकास कार्यों का लेखा-जोखा और जनता की उम्मीदें',
      slug: 'kaiserganj-lok-sabha-constituency-ground-report',
      excerpt_hi: 'सड़क, बिजली और स्वास्थ्य के मुद्दों पर स्थानीय जनता और जनप्रतिनिधियों के बीच सीधा संवाद।',
      featured_image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 3).toISOString(),
      author: { full_name_hi: 'अमित कुमार सिंह' },
    },
    {
      id: 's-2',
      title_hi: 'गोंडा की 1214 ग्राम पंचायतों के विकास बजट में 20% की वृद्धि',
      slug: 'gonda-panchayat-budget-allocation-analysis',
      excerpt_hi: 'ग्रामीण सड़कों के निर्माण और पेयजल परियोजनाओं के लिए नए फंड जारी।',
      featured_image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      author: { full_name_hi: 'राकेश त्रिपाठी' },
    },
  ],
  'gonda-aanchal': [
    {
      id: 'g-1',
      title_hi: 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ',
      slug: 'gonda-medical-college-super-speciality-inauguration',
      excerpt_hi: 'महाराजा देवी बख्श सिंह मेडिकल कॉलेज में आधुनिक सीटी स्कैन व एमआरआई यूनिट शुरू।',
      featured_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      author: { full_name_hi: 'राकेश त्रिपाठी' },
    },
  ],
  'itihas-virasat': [
    {
      id: 'i-1',
      title_hi: 'राजा देवी बख्श सिंह: जब गोंडा की धरती पर ब्रिटिश हुकूमत के छूटे पसीने',
      slug: 'raja-devi-bakhsh-singh-1857-revolution-gonda',
      excerpt_hi: '1857 के प्रथम स्वतंत्रता संग्राम में गोंडा नरेश के अदम्य साहस की अनदेखी दास्तां।',
      featured_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      author: { full_name_hi: 'डॉ. सत्येंद्र मिश्र' },
    },
  ],
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = CATEGORY_META[params.slug];
  const title = cat ? `${cat.name_hi} समाचार` : 'श्रेणी';

  return {
    title: `${title} | इंटरनेट की आवाज़`,
    description: cat?.desc_hi || 'गोंडा और पूर्वांचल की ताज़ा खबरें।',
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const meta = CATEGORY_META[params.slug];
  const supabase = await createClient();

  let posts: any[] = [];
  let categoryName = meta?.name_hi || params.slug;
  let categoryDesc = meta?.desc_hi || 'इस श्रेणी के अंतर्गत प्रकाशित ताज़ा समाचार।';

  try {
    const { data: catData }: any = await supabase
      .from('categories')
      .select('id, name_hi, description_hi')
      .eq('slug', params.slug)
      .single();

    if (catData) {
      categoryName = catData.name_hi;
      if (catData.description_hi) categoryDesc = catData.description_hi;

      const { data: postsData }: any = await supabase
        .from('posts')
        .select(`
          id, title_hi, slug, excerpt_hi, featured_image_url, published_at, is_video_first,
          author:profiles!posts_author_id_fkey(full_name_hi, full_name)
        `)
        .eq('category_id', catData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (postsData && postsData.length > 0) {
        posts = postsData;
      }
    }
  } catch {
    // Fallback
  }

  if (posts.length === 0) {
    posts = MOCK_CATEGORY_POSTS[params.slug] || [
      {
        id: 'fallback-1',
        title_hi: `${categoryName} डेस्क पर नई खबरें अपडेट की जा रही हैं`,
        slug: 'gonda-medical-college-super-speciality-inauguration',
        excerpt_hi: categoryDesc,
        featured_image_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop',
        published_at: new Date().toISOString(),
        author: { full_name_hi: 'संपादकीय डेस्क' },
      },
    ];
  }

  const isSepia = params.slug === 'itihas-virasat';

  return (
    <div className={`py-4 ${isSepia ? 'bg-amber-50/40 p-4 sm:p-8 rounded-2xl border border-amber-200' : ''}`}>
      {/* Category Header */}
      <div className="border-b-2 border-red-700 pb-4 mb-8">
        <nav aria-label="Breadcrumb" className="mb-2 text-xs text-slate-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-red-700">होम</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{categoryName}</span>
        </nav>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          {categoryName}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          {categoryDesc}
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className={`rounded-2xl border overflow-hidden transition-all hover:shadow-md group flex flex-col justify-between ${
              isSepia ? 'bg-white/90 border-amber-200' : 'bg-white border-slate-200'
            }`}
          >
            {post.featured_image_url && (
              <Link href={`/news/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={post.featured_image_url}
                  alt={post.title_hi}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    isSepia ? 'sepia-[0.25]' : ''
                  }`}
                />
              </Link>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/news/${post.slug}`}>
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                    {post.title_hi}
                  </h2>
                </Link>
                {post.excerpt_hi && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt_hi}
                  </p>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>{post.author?.full_name_hi || post.author?.full_name || 'विशेष संवाददाता'}</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {formatRelativeHindiTime(post.published_at)}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
