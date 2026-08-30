'use client';

import { useState } from 'react';
import { DirectoryCard } from '@/components/public/directory/DirectoryCard';
import { DirectoryFilterBar } from '@/components/public/directory/DirectoryFilterBar';
import { Building2, PlusCircle } from 'lucide-react';
import Link from 'next/link';

const MOCK_DIRECTORY_LISTINGS: any[] = [
  {
    id: 'd1',
    business_name_hi: 'अवध सुपर स्पेशियलिटी हॉस्पिटल एवं ट्रॉमा सेंटर',
    business_name_en: 'Avadh Super Speciality Hospital',
    slug: 'avadh-super-speciality-hospital-gonda',
    category_hi: 'चिकित्सा एवं अस्पताल',
    description_hi: '24 घंटे आपातकालीन सेवा, आधुनिक आईसीयू, सीटी स्कैन, डायलिसिस एवं विशेषज्ञ डॉक्टरों की टीम उपलब्ध।',
    address_hi: 'लखनऊ रोड, निकट नवीन गल्ला मंडी',
    locality: 'लखनऊ रोड, गोंडा',
    phone_number: '+91 94501 23456',
    whatsapp_number: '919450123456',
    cover_image_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600&auto=format&fit=crop',
    tier: 'featured',
    is_verified: true,
    rating: 4.8,
  },
  {
    id: 'd2',
    business_name_hi: 'श्री राम ऑटोमोबाइल्स (हीरो मोटोकॉर्प अधिकृत डीलर)',
    business_name_en: 'Shree Ram Automobiles',
    slug: 'shree-ram-automobiles-gonda',
    category_hi: 'ऑटोमोबाइल एवं शोरूम',
    description_hi: 'हीरो की सभी मोटरसाइकिलों की बिक्री, ओरिजिनल स्पेयर पार्ट्स और अत्याधुनिक सर्विस वर्कशॉप।',
    address_hi: 'फ़ोर्विशगंज चौक, पंत नगर',
    locality: 'फ़ोर्विशगंज, गोंडा',
    phone_number: '+91 98390 12345',
    whatsapp_number: '919839012345',
    cover_image_url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=600&auto=format&fit=crop',
    tier: 'verified',
    is_verified: true,
    rating: 4.9,
  },
  {
    id: 'd3',
    business_name_hi: 'सरस्वती विद्या मंदिर इंटर कॉलेज',
    business_name_en: 'Saraswati Vidya Mandir Inter College',
    slug: 'saraswati-vidya-mandir-gonda',
    category_hi: 'शिक्षा एवं संस्थान',
    description_hi: 'उत्कृष्ट संस्कारयुक्त शिक्षा, अनुभवी शिक्षक, आधुनिक कंप्यूटर व विज्ञान प्रयोगशालाएं।',
    address_hi: 'मालवीय नगर',
    locality: 'मालवीय नगर, गोंडा',
    phone_number: '+91 94150 98765',
    whatsapp_number: '919415098765',
    cover_image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=600&auto=format&fit=crop',
    tier: 'free_listing',
    is_verified: true,
    rating: 4.7,
  },
  {
    id: 'd4',
    business_name_hi: 'होटल रॉयल पैलेस एवं बैंक्वेट हॉल',
    business_name_en: 'Hotel Royal Palace & Banquet',
    slug: 'hotel-royal-palace-gonda',
    category_hi: 'होटल एवं रेस्टोरेंट',
    description_hi: 'विवाह, जन्मदिन और कॉर्पोरेट आयोजनों के लिए वातानुकूलित हॉल और लजीज व्यंजनों की उत्तम व्यवस्था।',
    address_hi: 'स्टेशन रोड, निकट गोंडा जंक्शन',
    locality: 'स्टेशन रोड, गोंडा',
    phone_number: '+91 91250 11223',
    whatsapp_number: '919125011223',
    cover_image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
    tier: 'featured',
    is_verified: true,
    rating: 4.6,
  },
  {
    id: 'd5',
    business_name_hi: 'गोंडा डायग्नोस्टिक एवं एमआरआई सेंटर',
    business_name_en: 'Gonda Diagnostic & MRI Centre',
    slug: 'gonda-diagnostic-mri-centre',
    category_hi: 'चिकित्सा एवं अस्पताल',
    description_hi: 'डिजिटल एक्स-रे, पैथोलॉजी लैब, 3D/4D अल्ट्रासाउंड और सटीक रिपोर्टिंग की सुविधा।',
    address_hi: 'अस्पताल रोड, कचहरी चौराहा',
    locality: 'कचहरी रोड, गोंडा',
    phone_number: '+91 94510 44556',
    whatsapp_number: '919451044556',
    cover_image_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop',
    tier: 'verified',
    is_verified: true,
    rating: 4.8,
  },
  {
    id: 'd6',
    business_name_hi: 'किसान एग्रो बीज एवं उर्वरक भंडार',
    business_name_en: 'Kisan Agro Seeds & Fertilizers',
    slug: 'kisan-agro-seeds-gonda',
    category_hi: 'कृषि एवं बीज भंडार',
    description_hi: 'प्रमाणित उच्च गुणवत्ता वाले संकर बीज, कीटनाशक, जैविक खाद और कृषि विशेषज्ञों द्वारा निःशुल्क परामर्श।',
    address_hi: 'कर्नलगंज रोड, तरबगंज मोड़',
    locality: 'तरबगंज मोड़, गोंडा',
    phone_number: '+91 97920 88990',
    whatsapp_number: '919792088990',
    cover_image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop',
    tier: 'free_listing',
    is_verified: false,
    rating: 4.5,
  },
];

export default function DirectoryPage() {
  const [listings, setListings] = useState(MOCK_DIRECTORY_LISTINGS);
  const [filteredListings, setFilteredListings] = useState(MOCK_DIRECTORY_LISTINGS);

  const categories = Array.from(new Set(listings.map((l) => l.category_hi)));
  const localities = Array.from(new Set(listings.map((l) => l.locality).filter(Boolean))) as string[];

  const handleFilterChange = ({ query, category, locality }: { query: string; category: string; locality: string }) => {
    let result = [...listings];
    if (query.trim()) {
      result = result.filter(
        (item) =>
          item.business_name_hi.toLowerCase().includes(query.toLowerCase()) ||
          item.category_hi.toLowerCase().includes(query.toLowerCase()) ||
          item.description_hi.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) {
      result = result.filter((item) => item.category_hi === category);
    }
    if (locality) {
      result = result.filter((item) => item.locality === locality);
    }
    setFilteredListings(result);
  };

  return (
    <div className="py-4" lang="hi">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <nav aria-label="Breadcrumb" className="mb-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Link href="/" className="hover:text-white">होम</Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">गोंडा डायरेक्टरी</span>
          </nav>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Building2 className="text-amber-400" size={32} />
            <span>गोंडा व्यापार एवं सेवा डायरेक्टरी</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            गोंडा, कैसरगंज और आसपास के प्रमुख व्यवसायों, अस्पतालों, डॉक्टरों, स्कूलों और सेवाओं की सत्यापित संपर्क डायरेक्टरी।
          </p>
        </div>

        <Link
          href="/contact"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg transition-all self-start md:self-auto shrink-0"
        >
          <PlusCircle size={20} />
          <span>अपनी लिस्टिंग जोड़ें</span>
        </Link>
      </div>

      {/* Interactive Filter Bar */}
      <DirectoryFilterBar
        categories={categories}
        localities={localities}
        onFilterChange={handleFilterChange}
      />

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <DirectoryCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
