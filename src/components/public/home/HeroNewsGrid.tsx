import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, Flame, PlayCircle } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';
import type { PostWithRelations } from '@/types/domain.types';

interface HeroNewsGridProps {
  leadStory?: PostWithRelations | null;
  secondaryStories?: PostWithRelations[];
  headlineStream?: PostWithRelations[];
}

// Fallback mockup data when database is fresh
const MOCK_LEAD: any = {
  id: 'lead-1',
  slug: 'gonda-medical-college-super-speciality-inauguration',
  title_hi: 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ, देवीपाटन मंडल के लाखों मरीजों को मिलेगा उन्नत इलाज',
  excerpt_hi: 'महाराजा देवी बख्श सिंह मेडिकल कॉलेज में आज नई आधुनिक सीटी स्कैन, एमआरआई और कार्डियोलॉजी विंग का उद्घाटन किया गया। अब लखनऊ और गोरखपुर के चक्कर लगाने से मिलेगी मुक्ति।',
  featured_image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
  published_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  view_count: 4520,
  reading_time_minutes: 4,
  category: { name_hi: 'गोंडा आंचल', slug: 'gonda-aanchal' },
  author: { full_name_hi: 'राकेश त्रिपाठी', designation_hi: 'वरिष्ठ ब्यूरो चीफ' },
  is_video_first: false,
};

const MOCK_SECONDARY: any[] = [
  {
    id: 'sec-1',
    slug: 'kaiserganj-sugar-mill-crushing-season-record',
    title_hi: 'कैसरगंज चीनी मिल ने बनाया पेराई का नया रिकॉर्ड, गन्ना किसानों के बकाये भुगतान का 95% निस्तारण',
    featured_image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop',
    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    view_count: 2180,
    category: { name_hi: 'सियासत', slug: 'siyasat' },
    author: { full_name_hi: 'अमित कुमार सिंह' },
    is_video_first: false,
  },
  {
    id: 'sec-2',
    slug: 'gonda-historic-prithvi-nathan-temple-renovation',
    title_hi: 'एशिया के सबसे बड़े शिवलिंग वाले पृथ्वीनाथ मंदिर का कायाकल्प, पर्यटन कॉरिडोर का काम अंतिम चरण में',
    featured_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
    published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    view_count: 3410,
    category: { name_hi: 'इतिहास व विरासत', slug: 'itihas-virasat' },
    author: { full_name_hi: 'डॉ. सत्येंद्र मिश्र' },
    is_video_first: false,
  },
  {
    id: 'sec-3',
    slug: 'purvanchal-flood-preparedness-gonda-drill',
    title_hi: 'सरयू और घाघरा की बाढ़ से निपटने के लिए गोंडा प्रशासन की मॉकड्रिल, 45 संवेदनशील गांवों में राहत चौकियां सक्रिय',
    featured_image_url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?q=80&w=600&auto=format&fit=crop',
    published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    view_count: 1890,
    category: { name_hi: 'जन-आवाज़', slug: 'jan-awaaz' },
    author: { full_name_hi: 'पवन वर्मा' },
    is_video_first: true,
  },
];

const MOCK_HEADLINES: any[] = [
  {
    id: 'head-1',
    slug: 'gonda-railway-junction-amrit-bharat-station',
    title_hi: 'अमृत भारत स्टेशन योजना के तहत गोंडा जंक्शन का पुनर्विकास, विश्वस्तरीय वेटिंग लाउंज तैयार',
    published_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    category: { name_hi: 'गोंडा आंचल', slug: 'gonda-aanchal' },
  },
  {
    id: 'head-2',
    slug: 'balrampur-sugar-mill-expansion-notice',
    title_hi: 'बलरामपुर चीनी मिल में एथेनॉल प्लांट की क्षमता में बढ़ोतरी, स्थानीय युवाओं को रोजगार का अवसर',
    published_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    category: { name_hi: 'सियासत', slug: 'siyasat' },
  },
  {
    id: 'head-3',
    slug: 'kaiserganj-rural-electrification-success',
    title_hi: 'कैसरगंज के 22 मजरों में सौर ऊर्जा से रोशन हुए घर, किसानों को सिंचाई में मिली बड़ी राहत',
    published_at: new Date(Date.now() - 3600000 * 9).toISOString(),
    category: { name_hi: 'जन-आवाज़', slug: 'jan-awaaz' },
  },
  {
    id: 'head-4',
    slug: 'shravasti-airport-flight-connectivity-update',
    title_hi: 'श्रावस्ती एयरपोर्ट से लखनऊ और वाराणसी के लिए सीधी उड़ानें जल्द होंगी शुरू',
    published_at: new Date(Date.now() - 3600000 * 14).toISOString(),
    category: { name_hi: 'गोंडा आंचल', slug: 'gonda-aanchal' },
  },
  {
    id: 'head-5',
    slug: 'gonda-sahitya-utsav-announcement-2026',
    title_hi: 'अवधी भाषा के संरक्षण के लिए गोंडा में त्रिदिवसीय अखिल भारतीय साहित्य उत्सव का आयोजन',
    published_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: { name_hi: 'साहित्य एवं मंच', slug: 'sahitya-manch' },
  },
];

export function HeroNewsGrid({ leadStory, secondaryStories, headlineStream }: HeroNewsGridProps) {
  const lead = leadStory || MOCK_LEAD;
  const secondary = secondaryStories && secondaryStories.length > 0 ? secondaryStories : MOCK_SECONDARY;
  const headlines = headlineStream && headlineStream.length > 0 ? headlineStream : MOCK_HEADLINES;

  return (
    <section className="mb-10">
      {/* 3-Tier Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tier 1: Lead Story (7 Cols on Desktop) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex-1 flex flex-col">
            <Link href={`/news/${lead.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-900">
              {lead.featured_image_url && (
                <img
                  src={lead.featured_image_url}
                  alt={lead.title_hi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Category Pill Over Image */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-red-700 text-white text-xs font-bold rounded shadow">
                  {lead.category?.name_hi || 'प्रमुख समाचार'}
                </span>
                {lead.is_video_first && (
                  <span className="flex items-center gap-1 px-2.5 py-1 bg-black/70 text-white text-xs font-medium rounded backdrop-blur">
                    <PlayCircle size={13} className="text-red-400" />
                    वीडियो
                  </span>
                )}
              </div>

              {/* Title & Meta Overlay at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug drop-shadow group-hover:text-red-300 transition-colors">
                  {lead.title_hi}
                </h2>
              </div>
            </Link>

            <div className="p-5 flex-1 flex flex-col justify-between">
              {lead.excerpt_hi && (
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
                  {lead.excerpt_hi}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">
                    {lead.author?.full_name_hi || lead.author?.full_name || 'विशेष संवाददाता'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1" suppressHydrationWarning>
                    <Clock size={13} />
                    {formatRelativeHindiTime(lead.published_at)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {lead.view_count !== undefined && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Eye size={13} />
                      {lead.view_count.toLocaleString('en-IN')}
                    </span>
                  )}
                  {lead.reading_time_minutes && (
                    <span className="text-slate-400">
                      {lead.reading_time_minutes} मिनट
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier 2: Secondary Stories Column (5 Cols on Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-red-700">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Flame size={18} className="text-red-600" />
              <span>प्रमुख सुर्खियां</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">अपडेटेड</span>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {secondary.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group flex gap-4 items-center"
              >
                <Link
                  href={`/news/${post.slug}`}
                  className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100"
                >
                  {post.featured_image_url && (
                    <img
                      src={post.featured_image_url}
                      alt={post.title_hi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  {post.is_video_first && (
                    <span className="absolute bottom-1 right-1 p-0.5 bg-red-700 text-white rounded">
                      <PlayCircle size={14} />
                    </span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider mb-1 block">
                    {post.category?.name_hi}
                  </span>
                  <Link href={`/news/${post.slug}`}>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                      {post.title_hi}
                    </h4>
                  </Link>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1" suppressHydrationWarning>
                    <Clock size={11} />
                    {formatRelativeHindiTime(post.published_at)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Tier 3: Dense Headlines Fast-Scan Rail */}
      <div className="mt-6 bg-slate-100 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            त्वरित दृष्टि — एक नज़र में अन्य खबरें
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {headlines.map((post, idx) => (
            <Link
              key={post.id || idx}
              href={`/news/${post.slug}`}
              className="flex items-start gap-2 text-xs text-slate-700 hover:text-red-700 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:border-red-300 transition-colors"
            >
              <span className="font-mono text-red-700 font-bold shrink-0 mt-0.5">
                0{idx + 1}.
              </span>
              <span className="line-clamp-2 leading-snug">{post.title_hi}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
