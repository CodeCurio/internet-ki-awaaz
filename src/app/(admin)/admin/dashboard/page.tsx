import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  FileText,
  Clock,
  Building2,
  Zap,
  TrendingUp,
  Award,
  AlertTriangle,
  PlusCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch Post Metrics
  let publishedCount = 42;
  let inReviewCount = 3;
  let staffCount = 4;
  let activeBreakingCount = 3;

  try {
    const { count: pub } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published');
    const { count: rev } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'in_review');
    const { count: stf } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true);
    const { count: brk } = await supabase.from('breaking_news').select('*', { count: 'exact', head: true }).eq('is_active', true);

    if (pub !== null) publishedCount = pub;
    if (rev !== null) inReviewCount = rev;
    if (stf !== null) staffCount = stf;
    if (brk !== null) activeBreakingCount = brk;
  } catch {
    // Demo fallback
  }

  const topArticles = [
    {
      id: '1',
      title: 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ',
      views: '5,410',
      category: 'गोंडा आंचल',
      slug: 'gonda-medical-college-super-speciality-inauguration',
    },
    {
      id: '2',
      title: 'कैसरगंज चीनी मिल ने बनाया पेराई का नया रिकॉर्ड',
      views: '3,280',
      category: 'सियासत',
      slug: 'kaiserganj-sugar-mill-crushing-season-record',
    },
    {
      id: '3',
      title: 'राजा देवी बख्श सिंह: जब गोंडा की धरती पर ब्रिटिश हुकूमत के छूटे पसीने',
      views: '2,940',
      category: 'इतिहास व विरासत',
      slug: 'raja-devi-bakhsh-singh-1857-revolution-gonda',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
            संपादकीय नियंत्रण कक्ष (Editorial Command Center)
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            नमस्ते, मुख्य संपादक!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            गोंडा व पूर्वांचल डेस्क पर आज का प्रकाशन एवं कार्यप्रवाह समीक्षा।
          </p>
        </div>

        <Link
          href="/admin/posts/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-lg transition-colors shrink-0"
        >
          <PlusCircle size={16} />
          <span>नया लेख तैयार करें</span>
        </Link>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Publishing Pulse */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">कुल प्रकाशित लेख</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <FileText size={18} />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900">{publishedCount}</p>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>सक्रिय व लाइव</span>
            </p>
          </div>
        </div>

        {/* Card 2: Review Queue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">समीक्षा कतार (In Review)</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock size={18} />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900">{inReviewCount}</p>
            <p className="text-xs text-amber-700 font-semibold mt-1">
              संपादकीय अनुमोदन लंबित
            </p>
          </div>
        </div>

        {/* Card 3: Active Staff */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">सक्रिय स्टाफ व रिपोर्टर्स</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Building2 size={18} />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-slate-900">{staffCount}</p>
            <p className="text-xs text-blue-700 font-semibold mt-1">
              संपादकीय टीम सदस्य
            </p>
          </div>
        </div>

        {/* Card 4: Active Breaking Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">सक्रिय ब्रेकिंग अलर्ट्स</span>
            <span className="p-2 bg-red-50 text-red-700 rounded-xl">
              <Zap size={18} />
            </span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-red-700">{activeBreakingCount}</p>
            <p className="text-xs text-red-600 font-semibold mt-1">
              लाइव टिकर पर सक्रिय
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Top 5 Articles & Operational Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Articles (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <span>सर्वाधिक पढ़े गए समाचार (Top Articles)</span>
            </h2>
            <Link href="/admin/posts" className="text-xs text-red-700 hover:underline font-semibold">
              सभी देखें →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {topArticles.map((article, index) => (
              <div key={article.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {article.title}
                    </h3>
                    <span className="text-[11px] text-red-700 font-semibold">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold shrink-0">
                  <Eye size={13} />
                  <span>{article.views} दृश्य</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ad Health & Review Priority (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600" />
              <span>संपादकीय समीक्षा कतार</span>
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                <p className="font-bold text-amber-900 line-clamp-1">
                  कैसरगंज में सड़क चौड़ीकरण परियोजना पर रिपोर्ट
                </p>
                <p className="text-slate-500 mt-1">अमित कुमार सिंह • 2 घंटे पूर्व</p>
                <Link
                  href="/admin/posts"
                  className="mt-2 inline-block text-xs font-bold text-red-700 hover:underline"
                >
                  समीक्षा करें एवं प्रकाशित करें →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
