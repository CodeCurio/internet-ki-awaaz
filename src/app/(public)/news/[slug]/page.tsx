import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createPublicServerClient } from '@/lib/supabase/server';
import { ArticleHeader } from '@/components/public/article/ArticleHeader';
import { ArticleBody } from '@/components/public/article/ArticleBody';
import { AuthorBylineCard } from '@/components/public/article/AuthorBylineCard';
import { SocialShareBar } from '@/components/public/article/SocialShareBar';
import { RelatedArticles } from '@/components/public/article/RelatedArticles';
import { VideoEmbed } from '@/components/public/article/VideoEmbed';
import { buildArticleJsonLd } from '@/lib/seo/json-ld';
import Link from 'next/link';

export const revalidate = 120; // 120s ISR

interface PageProps {
  params: { slug: string };
}

// Demo fallback article when looking up dynamic mock slugs
const MOCK_ARTICLES: Record<string, any> = {
  'gonda-medical-college-super-speciality-inauguration': {
    id: 'mock-lead',
    title_hi: 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ, देवीपाटन मंडल के लाखों मरीजों को मिलेगा उन्नत इलाज',
    title_en: 'Inauguration of Super Speciality Medical Wing in Gonda',
    subtitle_hi: 'महाराजा देवी बख्श सिंह मेडिकल कॉलेज में आज नई आधुनिक सीटी स्कैन, एमआरआई और कार्डियोलॉजी विंग का उद्घाटन किया गया।',
    slug: 'gonda-medical-college-super-speciality-inauguration',
    excerpt_hi: 'महाराजा देवी बख्श सिंह मेडिकल कॉलेज में आज नई आधुनिक सीटी स्कैन, एमआरआई और कार्डियोलॉजी विंग का उद्घाटन किया गया। अब लखनऊ और गोरखपुर के चक्कर लगाने से मिलेगी मुक्ति।',
    featured_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    featured_image_alt_hi: 'गोंडा मेडिकल कॉलेज सुपर स्पेशियलिटी विंग',
    is_video_first: false,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    view_count: 5410,
    reading_time_minutes: 4,
    category: { id: 'cat-1', name_hi: 'गोंडा आंचल', slug: 'gonda-aanchal' },
    author: {
      id: 'auth-1',
      full_name: 'Rakesh Tripathi',
      full_name_hi: 'राकेश त्रिपाठी',
      username: 'rakesh_tripathi',
      designation_hi: 'वरिष्ठ ब्यूरो चीफ',
      reporter_beat: 'स्वास्थ्य व प्रशासन',
    },
    body_html_cache: `
      <p><strong>गोंडा (इंटरनेट की आवाज़ ब्यूरो):</strong> उत्तर प्रदेश के देवीपाटन मंडल के अंतर्गत आने वाले गोंडा जिले के लिए आज का दिन चिकित्सा और जन-स्वास्थ्य के क्षेत्र में मील का पत्थर साबित हुआ। स्थानीय महाराजा देवी बख्श सिंह मेडिकल कॉलेज में नवनिर्मित अत्याधुनिक सुपर स्पेशियलिटी विंग और 128 स्लाइस सीटी स्कैन व आधुनिक एमआरआई यूनिट का विधिवत लोकार्पण किया गया।</p>
      
      <h2>लखनऊ और गोरखपुर की दौड़ से मिलेगी निजात</h2>
      <p>अब तक गंभीर बीमारियों, हृदय रोग और न्यूरो से जुड़ी आपातकालीन स्थितियों में मरीजों को 130 किलोमीटर दूर लखनऊ अथवा 150 किलोमीटर दूर गोरखपुर रेफर किया जाता था। इस यात्रा के दौरान कई बार क्रिटिकल समय नष्ट हो जाता था। नए सुपर स्पेशियलिटी ब्लॉक में 24 घंटे कार्डियक इमरजेंसी, कैथ लैब, 30 बिस्तरों वाली अत्याधुनिक आईसीयू और उन्नत डायलिसिस यूनिट क्रियाशील हो गई है।</p>

      <blockquote>
        "हमारा संकल्प है कि गोंडा, बलरामपुर, श्रावस्ती और बहराइच के अंतिम व्यक्ति तक विश्वस्तरीय चिकित्सा सुविधाएं बिना किसी आर्थिक बोझ के पहुंचें।"
      </blockquote>

      <h2>दवाओं और जांच की निःशुल्क व्यवस्था</h2>
      <p>अस्पताल प्रशासन ने पुष्टि की है कि राष्ट्रीय स्वास्थ्य मिशन और आयुष्मान भारत योजना के तहत सभी पात्र लाभार्थियों को शत-प्रतिशत निःशुल्क उपचार, जीवनरक्षक दवाएं एवं जांच की सुविधा प्राप्त होगी। मरीजों की सुविधा के लिए डिजिटल टोकन प्रणाली और ऑनलाइन रिपोर्टिंग पोर्टल भी शुरू कर दिया गया है।</p>

      <h2>स्थानीय नागरिकों में भारी उत्साह</h2>
      <p>गोंडा नगर और ग्रामीण अंचलों के सामाजिक कार्यकर्ताओं और प्रबुद्ध नागरिकों ने इस पहल का स्वागत करते हुए इसे क्षेत्र के लिए अभूतपूर्व सौगात बताया है।</p>
    `,
  },
};

async function getArticle(slug: string) {
  try {
    const supabase = await createPublicServerClient();
    const { data: post } = await supabase
      .from('posts')
      .select(`
        *,
        category:categories(id, name_hi, slug),
        author:profiles!posts_author_id_fkey(id, full_name, full_name_hi, username, avatar_url, designation_hi, reporter_beat)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (post) return post;
  } catch {
    // Supabase query error fallback
  }

  return MOCK_ARTICLES[slug] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getArticle(params.slug);

  if (!post) {
    return { title: 'लेख नहीं मिला | इंटरनेट की आवाज़' };
  }

  const title = post.seo_title_hi || post.title_hi;
  const description = post.seo_description_hi || post.excerpt_hi || '';
  const canonical = post.canonical_url || `https://internetkiawaaz.in/news/${post.slug}`;

  return {
    title: `${title} | इंटरनेट की आवाज़`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      images: post.featured_image_url ? [{ url: post.featured_image_url }] : [],
      locale: 'hi_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const post = await getArticle(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = buildArticleJsonLd(post);

  return (
    <article className="mx-auto max-w-3xl bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm" lang="hi">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Semantic Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-red-700 font-medium">होम</Link>
        <span>/</span>
        <Link href={`/category/${post.category.slug}`} className="hover:text-red-700 font-medium">
          {post.category.name_hi}
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">{post.title_hi}</span>
      </nav>

      {/* Article Headline & Meta */}
      <ArticleHeader
        titleHi={post.title_hi}
        subtitleHi={post.subtitle_hi}
        publishedAt={post.published_at}
        readingTimeMinutes={post.reading_time_minutes}
      />

      {/* Author Byline */}
      <AuthorBylineCard author={post.author} />

      {/* Social Sharing Bar */}
      <SocialShareBar
        url={`https://internetkiawaaz.in/news/${post.slug}`}
        title={post.title_hi}
      />

      {/* Featured Media: Video or Responsive Image */}
      {post.is_video_first && post.youtube_video_id ? (
        <VideoEmbed
          videoId={post.youtube_video_id}
          thumbnailUrl={post.youtube_thumbnail_url}
          titleHi={post.title_hi}
        />
      ) : post.featured_image_url ? (
        <figure className="my-6">
          <img
            src={post.featured_image_url}
            alt={post.featured_image_alt_hi || post.title_hi}
            className="w-full rounded-xl object-cover shadow-sm"
          />
          {post.featured_image_alt_hi && (
            <figcaption className="text-xs text-slate-500 text-center mt-2 italic">
              {post.featured_image_alt_hi}
            </figcaption>
          )}
        </figure>
      ) : null}

      {/* Article Prose Body */}
      <ArticleBody
        bodyJson={post.body_hi}
        bodyHtmlCache={post.body_html_cache}
      />

      {/* Bottom Share Bar */}
      <SocialShareBar
        url={`https://internetkiawaaz.in/news/${post.slug}`}
        title={post.title_hi}
      />

      {/* Related Stories Desk */}
      <RelatedArticles
        categoryId={post.category?.id}
        excludePostId={post.id}
      />
    </article>
  );
}
