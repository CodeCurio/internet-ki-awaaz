import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { buildLocalBusinessJsonLd } from '@/lib/seo/json-ld';
import { Building2, CheckCircle, MapPin, Phone, MessageCircle, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 600;

interface DirectoryDetailPageProps {
  params: { slug: string };
}

const MOCK_LISTINGS_BY_SLUG: Record<string, any> = {
  'avadh-super-speciality-hospital-gonda': {
    id: 'd1',
    business_name_hi: 'अवध सुपर स्पेशियलिटी हॉस्पिटल एवं ट्रॉमा सेंटर',
    business_name_en: 'Avadh Super Speciality Hospital & Trauma Centre',
    slug: 'avadh-super-speciality-hospital-gonda',
    category_hi: 'चिकित्सा एवं अस्पताल',
    description_hi: 'अवध सुपर स्पेशियलिटी हॉस्पिटल गोंडा का एक प्रमुख निजी चिकित्सा संस्थान है। यहाँ 24 घंटे आपातकालीन सेवा, आधुनिक सीटी स्कैन, एमआरआई, डायलिसिस, 30 बिस्तरों वाला गहन चिकित्सा कक्ष (ICU) और विशेषज्ञ डॉक्टरों की टीम उपलब्ध है। आयुष्मान भारत योजना के अंतर्गत सभी पात्र मरीजों के लिए निःशुल्क परामर्श एवं उपचार उपलब्ध है।',
    address_hi: 'लखनऊ रोड, निकट नवीन गल्ला मंडी, गोंडा – 271001',
    locality: 'लखनऊ रोड, गोंडा',
    phone_number: '+91 94501 23456',
    whatsapp_number: '919450123456',
    cover_image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1200&auto=format&fit=crop',
    tier: 'featured',
    is_verified: true,
    rating: 4.8,
  },
};

export async function generateMetadata({ params }: DirectoryDetailPageProps): Promise<Metadata> {
  const listing = MOCK_LISTINGS_BY_SLUG[params.slug];
  if (!listing) return { title: 'लिस्टिंग नहीं मिली | इंटरनेट की आवाज़' };

  return {
    title: `${listing.business_name_hi} | गोंडा डायरेक्टरी | इंटरनेट की आवाज़`,
    description: listing.description_hi,
  };
}

export default async function DirectoryDetailPage({ params }: DirectoryDetailPageProps) {
  const supabase = await createClient();
  let listing: any = null;

  try {
    const { data } = await supabase
      .from('directory_listings')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_approved', true)
      .single();

    if (data) listing = data;
  } catch {
    // Fallback
  }

  if (!listing) {
    listing = MOCK_LISTINGS_BY_SLUG[params.slug];
  }

  if (!listing) {
    notFound();
  }

  const jsonLd = buildLocalBusinessJsonLd(listing);
  const whatsappUrl = listing.whatsapp_number
    ? `https://wa.me/${listing.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
        `नमस्ते, मैंने इंटरनेट की आवाज़ पोर्टल पर आपकी लिस्टिंग (${listing.business_name_hi}) देखी है।`
      )}`
    : null;

  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      {/* LocalBusiness Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-4 text-xs sm:text-sm text-slate-500 flex items-center gap-1.5">
        <Link href="/" className="hover:text-red-700">होम</Link>
        <span>/</span>
        <Link href="/directory" className="hover:text-red-700">गोंडा डायरेक्टरी</Link>
        <span>/</span>
        <span className="text-slate-700 font-semibold truncate">{listing.business_name_hi}</span>
      </nav>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {listing.cover_image_url && (
          <div className="relative aspect-[21/9] bg-slate-900 overflow-hidden">
            <img
              src={listing.cover_image_url}
              alt={listing.business_name_hi}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-xs font-bold text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              {listing.category_hi}
            </span>
            <div className="flex items-center gap-3">
              {listing.is_verified && (
                <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle size={14} className="text-emerald-600" />
                  इंटरनेट की आवाज़ सत्यापित
                </span>
              )}
              {listing.rating && (
                <span className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  <span>★ {listing.rating}</span>
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            {listing.business_name_hi}
          </h1>
          {listing.business_name_en && (
            <p className="text-sm font-medium text-slate-500 mb-6">{listing.business_name_en}</p>
          )}

          <div className="prose max-w-none text-slate-700 text-base leading-relaxed mb-8">
            <p>{listing.description_hi}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-3 mb-8">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              संपर्क एवं पता विवरण
            </h2>
            {listing.address_hi && (
              <p className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin size={16} className="text-red-600 shrink-0 mt-0.5" />
                <span>{listing.address_hi}</span>
              </p>
            )}
            {listing.phone_number && (
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <Phone size={16} className="text-slate-500 shrink-0" />
                <a href={`tel:${listing.phone_number}`} className="hover:text-red-700 font-medium">
                  {listing.phone_number}
                </a>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <MessageCircle size={18} />
                <span>व्हाट्सएप पर तुरंत संपर्क करें</span>
              </a>
            )}
            {listing.phone_number && (
              <a
                href={`tel:${listing.phone_number}`}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md"
              >
                <Phone size={18} />
                <span>सीधे कॉल करें</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
