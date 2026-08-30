import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { User, Shield, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeHindiTime } from '@/lib/utils';

export const revalidate = 300;

interface AuthorPageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  return {
    title: `${params.username} | लेखक प्रोफ़ाइल | इंटरनेट की आवाज़`,
  };
}

export default async function AuthorProfilePage({ params }: AuthorPageProps) {
  const supabase = await createClient();

  let author: any = {
    full_name_hi: 'राकेश त्रिपाठी',
    username: params.username,
    designation_hi: 'वरिष्ठ ब्यूरो चीफ एवं खोजी पत्रकार',
    bio_hi: 'गोंडा, कैसरगंज और पूर्वांचल में पिछले 12 वर्षों से खोजी पत्रकारिता, ग्रामीण विकास और स्वास्थ्य क्षेत्र की जमीनी रिपोर्टिंग।',
    reporter_beat: 'राजनीति, स्वास्थ्य एवं प्रशासनिक मामले',
  };

  try {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', params.username)
      .single();

    if (data) author = data;
  } catch {
    // Fallback
  }

  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      {/* Author Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
        <div className="w-24 h-24 rounded-full bg-red-100 text-red-700 font-extrabold text-3xl flex items-center justify-center border-2 border-red-200 shrink-0">
          {author.full_name_hi?.charAt(0) || 'र'}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {author.full_name_hi || author.full_name || author.username}
            </h1>
            <span className="flex items-center gap-1 text-xs bg-red-50 text-red-700 font-bold px-2.5 py-0.5 rounded-full border border-red-200">
              <Shield size={12} />
              सत्यापित रिपोर्टर
            </span>
          </div>

          <p className="text-xs font-semibold text-slate-500 mb-3">
            {author.designation_hi} {author.reporter_beat ? `• ${author.reporter_beat}` : ''}
          </p>

          {author.bio_hi && (
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              {author.bio_hi}
            </p>
          )}

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <BookOpen size={14} className="text-red-700" />
              <span>45+ प्रकाशित रिपोर्ट्स</span>
            </span>
          </div>
        </div>
      </div>

      {/* Author Articles Stream */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b-2 border-red-700 pb-2">
          <span className="w-2 h-5 bg-red-700 rounded-sm"></span>
          <span>{author.full_name_hi || author.username} द्वारा प्रकाशित लेख</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <article className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full">
                गोंडा आंचल
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} />
                2 दिन पहले
              </span>
            </div>
            <Link href="/news/gonda-medical-college-super-speciality-inauguration">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2">
              महाराजा देवी बख्श सिंह मेडिकल कॉलेज में आज नई आधुनिक सीटी स्कैन, एमआरआई और कार्डियोलॉजी विंग का उद्घाटन किया गया।
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
