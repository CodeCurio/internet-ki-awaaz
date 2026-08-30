'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Clock, Calendar } from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';

const MOCK_SEARCH_RESULTS = [
  {
    id: 's-1',
    title_hi: 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ',
    slug: 'gonda-medical-college-super-speciality-inauguration',
    excerpt_hi: 'महाराजा देवी बख्श सिंह मेडिकल कॉलेज में आज नई आधुनिक सीटी स्कैन, एमआरआई और कार्डियोलॉजी विंग का उद्घाटन किया गया।',
    category_name: 'गोंडा आंचल',
    published_at: new Date().toISOString(),
  },
  {
    id: 's-2',
    title_hi: 'राजा देवी बख्श सिंह: जब गोंडा की धरती पर ब्रिटिश हुकूमत के छूटे पसीने',
    slug: 'raja-devi-bakhsh-singh-1857-revolution-gonda',
    excerpt_hi: '1857 के प्रथम स्वतंत्रता संग्राम में गोंडा नरेश के अदम्य साहस और ब्रिटिश सेना से ऐतिहासिक युद्ध की अनदेखी गाथा।',
    category_name: 'इतिहास व विरासत',
    published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 's-3',
    title_hi: 'कैसरगंज चीनी मिल ने बनाया पेराई का नया रिकॉर्ड, गन्ना किसानों के बकाये भुगतान का 95% निस्तारण',
    slug: 'kaiserganj-sugar-mill-crushing-season-record',
    excerpt_hi: 'पेराई सत्र के दौरान रिकॉर्ड उत्पादन और किसानों के खातों में डीबीटी के जरिए समय पर भुगतान सुनिश्चित किया गया।',
    category_name: 'सियासत',
    published_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<any[]>(MOCK_SEARCH_RESULTS);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!query.trim()) {
      setResults(MOCK_SEARCH_RESULTS);
      return;
    }
    const filtered = MOCK_SEARCH_RESULTS.filter(
      (item) =>
        item.title_hi.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt_hi.toLowerCase().includes(query.toLowerCase()) ||
        item.category_name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          समाचार खोजें
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          गोंडा, कैसरगंज, देवीपाटन मंडल और पूर्वांचल के सभी प्रकाशित समाचारों में खोजें
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="खोजें (उदा. मेडिकल कॉलेज, कैसरगंज, पृथ्वीनाथ)..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm shadow-sm"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            खोजें
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs text-slate-500">
          <span>
            {hasSearched ? `"${query}" के लिए परिणाम` : 'नवीनतम प्रकाशित समाचार'} ({results.length})
          </span>
          <span>हिंदी में खोज प्रणाली</span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-base text-slate-600 font-semibold mb-1">
              कोई समाचार नहीं मिला।
            </p>
            <p className="text-xs text-slate-400">
              कृपया अन्य कीवर्ड या श्रेणी नाम से खोज करने का प्रयास करें।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-red-600 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                    {post.category_name}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    {formatRelativeHindiTime(post.published_at)}
                  </span>
                </div>
                <Link href={`/news/${post.slug}`}>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug">
                    {post.title_hi}
                  </h2>
                </Link>
                {post.excerpt_hi && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-2">
                    {post.excerpt_hi}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
