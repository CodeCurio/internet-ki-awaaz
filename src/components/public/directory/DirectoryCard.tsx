import { Building2, CheckCircle, MapPin, Phone, MessageCircle, Star } from 'lucide-react';
import type { DirectoryListingRow } from '@/types/domain.types';

interface DirectoryCardProps {
  listing: DirectoryListingRow;
}

export function DirectoryCard({ listing }: DirectoryCardProps) {
  const whatsappUrl = listing.whatsapp_number
    ? `https://wa.me/${listing.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(
        `नमस्ते, मैंने इंटरनेट की आवाज़ पोर्टल पर आपकी लिस्टिंग (${listing.business_name_hi}) देखी है।`
      )}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      {listing.cover_image_url && (
        <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
          <img
            src={listing.cover_image_url}
            alt={listing.business_name_hi}
            className="w-full h-full object-cover"
          />
          {listing.tier === 'featured' && (
            <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded uppercase shadow">
              फीचर्ड
            </span>
          )}
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
              {listing.category_hi}
            </span>
            {listing.is_verified && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle size={13} className="text-emerald-600" />
                सत्यापित
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
            {listing.business_name_hi}
          </h3>
          {listing.business_name_en && (
            <p className="text-xs text-slate-400 font-medium mb-2">{listing.business_name_en}</p>
          )}

          {listing.description_hi && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {listing.description_hi}
            </p>
          )}

          <div className="space-y-1.5 text-xs text-slate-500 my-3 pt-3 border-t border-slate-100">
            {listing.address_hi && (
              <p className="flex items-start gap-1.5">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{listing.address_hi}{listing.locality ? `, ${listing.locality}` : ''}</span>
              </p>
            )}
            {listing.phone_number && (
              <p className="flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <a href={`tel:${listing.phone_number}`} className="hover:text-slate-900 font-medium">
                  {listing.phone_number}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm w-full justify-center"
            >
              <MessageCircle size={14} />
              <span>व्हाट्सएप पर संपर्क करें</span>
            </a>
          ) : listing.phone_number ? (
            <a
              href={`tel:${listing.phone_number}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors w-full justify-center"
            >
              <Phone size={14} />
              <span>कॉल करें</span>
            </a>
          ) : (
            <span className="text-xs text-slate-400">विवरण उपलब्ध है</span>
          )}

          {listing.rating !== null && listing.rating !== undefined && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded text-xs font-bold shrink-0">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span>{listing.rating.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
