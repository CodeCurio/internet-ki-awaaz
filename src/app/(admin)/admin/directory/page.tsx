import { createClient } from '@/lib/supabase/server';
import { Building2, CheckCircle, XCircle, Phone, MapPin, Star } from 'lucide-react';
import { approveDirectoryListing, rejectDirectoryListing } from '@/lib/actions/directory.actions';

export const dynamic = 'force-dynamic';

const MOCK_ADMIN_DIRECTORY = [
  {
    id: 'd1',
    business_name_hi: 'अवध सुपर स्पेशियलिटी हॉस्पिटल',
    category_hi: 'चिकित्सा एवं अस्पताल',
    locality: 'लखनऊ रोड, गोंडा',
    phone_number: '+91 94501 23456',
    is_approved: true,
    is_verified: true,
    tier: 'featured',
    rating: 4.8,
  },
  {
    id: 'd2',
    business_name_hi: 'श्री राम ऑटोमोबाइल्स',
    category_hi: 'ऑटोमोबाइल',
    locality: 'फ़ोर्विशगंज, गोंडा',
    phone_number: '+91 98390 12345',
    is_approved: true,
    is_verified: true,
    tier: 'verified',
    rating: 4.9,
  },
  {
    id: 'd3',
    business_name_hi: 'गोंडा मॉडर्न पब्लिक स्कूल (सबमिशन)',
    category_hi: 'शिक्षा संस्थान',
    locality: 'मनकापुर रोड, गोंडा',
    phone_number: '+91 98399 55443',
    is_approved: false,
    is_verified: false,
    tier: 'free_listing',
    rating: 4.5,
  },
];

export default async function AdminDirectoryPage() {
  const supabase = await createClient();
  let listings = MOCK_ADMIN_DIRECTORY;

  try {
    const { data }: any = await supabase.from('directory_listings').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) listings = data;
  } catch {
    // Fallback
  }

  const pendingListings = listings.filter((l) => !l.is_approved);
  const approvedListings = listings.filter((l) => l.is_approved);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            गोंडा डायरेक्टरी समीक्षा व सत्यापन
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            स्थानीय व्यापारिक सबमिशन का अनुमोदन, सत्यापन बैज और लिस्टिंग प्रबंधन।
          </p>
        </div>
      </div>

      {/* Review Queue for Pending Submissions */}
      {pendingListings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              समीक्षा हेतु लंबित सबमिशन ({pendingListings.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingListings.map((item) => (
              <div key={item.id} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                    {item.category_hi}
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">नया सबमिशन</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.business_name_hi}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{item.locality}</span>
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <Phone size={13} className="text-slate-400" />
                    <span>{item.phone_number}</span>
                  </p>
                </div>
                <div className="pt-3 border-t border-amber-200/80 flex items-center gap-2">
                  <form
                    action={async () => {
                      'use server';
                      await approveDirectoryListing(item.id, true);
                    }}
                    className="flex-1"
                  >
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <CheckCircle size={14} />
                      <span>स्वीकृत व सत्यापित करें</span>
                    </button>
                  </form>
                  <form
                    action={async () => {
                      'use server';
                      await rejectDirectoryListing(item.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle size={14} />
                      <span>अस्वीकार</span>
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider">
          स्वीकृत व लाइव डायरेक्टरी लिस्टिंग्स ({approvedListings.length})
        </div>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-bold">
              <th className="py-3 px-4">प्रतिष्ठान का नाम</th>
              <th className="py-3 px-4">श्रेणी</th>
              <th className="py-3 px-4">इलाका</th>
              <th className="py-3 px-4">फ़ोन</th>
              <th className="py-3 px-4">सत्यापन स्थिति</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {approvedListings.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                  {item.business_name_hi}
                </td>
                <td className="py-3 px-4 text-slate-700">{item.category_hi}</td>
                <td className="py-3 px-4 text-slate-600">{item.locality}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{item.phone_number}</td>
                <td className="py-3 px-4">
                  {item.is_verified ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle size={12} />
                      सत्यापित
                    </span>
                  ) : (
                    <span className="text-slate-400">सामान्य</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
