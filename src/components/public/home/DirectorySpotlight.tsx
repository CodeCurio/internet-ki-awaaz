import Link from 'next/link';
import { Building2, CheckCircle, ChevronRight, Phone, MapPin } from 'lucide-react';
import type { DirectoryListingRow } from '@/types/domain.types';

const MOCK_SPOTLIGHT: any[] = [
  {
    id: 'dir-1',
    business_name_hi: 'अवध सुपर स्पेशियलिटी हॉस्पिटल',
    category_hi: 'चिकित्सा एवं अस्पताल',
    locality: 'लखनऊ रोड, गोंडा',
    phone_number: '+91 94501 23456',
    whatsapp_number: '919450123456',
    is_verified: true,
    rating: 4.8,
  },
  {
    id: 'dir-2',
    business_name_hi: 'श्री राम ऑटोमोबाइल्स (हीरो मोटोकॉर्प)',
    category_hi: 'ऑटोमोबाइल एवं सर्विस',
    locality: 'फ़ोर्विशगंज चौक, गोंडा',
    phone_number: '+91 98390 12345',
    whatsapp_number: '919839012345',
    is_verified: true,
    rating: 4.9,
  },
  {
    id: 'dir-3',
    business_name_hi: 'सरस्वती विद्या मंदिर इंटर कॉलेज',
    category_hi: 'शिक्षा संस्थान',
    locality: 'मालवीय नगर, गोंडा',
    phone_number: '+91 94150 98765',
    whatsapp_number: '919415098765',
    is_verified: true,
    rating: 4.7,
  },
];

export function DirectorySpotlight({ listings }: { listings?: DirectoryListingRow[] }) {
  const items = listings && listings.length > 0 ? listings : MOCK_SPOTLIGHT;

  return (
    <section className="my-10 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Building2 size={22} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              गोंडा व्यापार एवं सेवा डायरेक्टरी
            </h2>
            <p className="text-xs text-slate-400">
              स्थानीय व्यापारियों, अस्पतालों, डॉक्टरों एवं सेवाओं की सत्यापित सूची
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/directory"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors shadow-sm"
          >
            <span>अपनी दुकान/संस्थान जोड़ें</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/90 rounded-xl p-5 border border-slate-800 hover:border-amber-500/50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.category_hi}
                </span>
                {item.is_verified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle size={12} />
                    सत्यापित
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-slate-100 mb-2">
                {item.business_name_hi}
              </h3>

              {item.locality && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                  <MapPin size={13} className="text-slate-500 shrink-0" />
                  <span>{item.locality}</span>
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              {item.whatsapp_number ? (
                <a
                  href={`https://wa.me/${item.whatsapp_number}?text=${encodeURIComponent(
                    `नमस्ते, मैंने इंटरनेट की आवाज़ पर आपकी लिस्टिंग देखी है।`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  व्हाट्सएप पर संपर्क करें
                </a>
              ) : item.phone_number ? (
                <a
                  href={`tel:${item.phone_number}`}
                  className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
                >
                  <Phone size={12} />
                  <span>{item.phone_number}</span>
                </a>
              ) : null}

              {item.rating && (
                <span className="text-xs font-bold text-amber-400">
                  ★ {item.rating}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
