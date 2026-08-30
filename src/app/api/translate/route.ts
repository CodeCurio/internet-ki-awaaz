import { NextRequest, NextResponse } from 'next/server';

const CACHE = new Map<string, { hindi: string; english: string; slug: string }>();

const COMMON_DICTIONARY: Record<string, string> = {
  politics: 'सियासत',
  political: 'राजनीति',
  politician: 'राजनेता',
  election: 'चुनाव',
  elections: 'चुनाव',
  health: 'स्वास्थ्य',
  hospital: 'अस्पताल',
  medical: 'चिकित्सा व मेडिकल',
  doctor: 'डॉक्टर',
  crime: 'अपराध व क्राइम',
  police: 'पुलिस प्रशासन',
  education: 'शिक्षा',
  school: 'विद्यालय',
  college: 'कॉलेज',
  university: 'विश्वविद्यालय',
  development: 'विकास कार्य',
  business: 'व्यापार व कारोबार',
  market: 'बाज़ार',
  history: 'इतिहास व विरासत',
  heritage: 'विरासत',
  literature: 'साहित्य एवं मंच',
  culture: 'संस्कृति',
  sports: 'खेल कूद',
  cricket: 'क्रिकेट',
  weather: 'मौसम',
  environment: 'पर्यावरण',
  agriculture: 'कृषि व किसान',
  farmer: 'किसान',
  farmers: 'किसान',
  sugar: 'चीनी मिल',
  railway: 'रेलवे जंक्शन',
  train: 'ट्रेन व रेलवे',
  road: 'सड़क व परिवहन',
  court: 'अदालत व न्याय',
  advocate: 'अधिवक्ता',
  lawyer: 'वकील',
  national: 'राष्ट्रीय',
  international: 'अंतरराष्ट्रीय',
  state: 'राज्य',
  district: 'ज़िला',
  village: 'ग्राम पंचायत',
  city: 'नगर निकाय',
  gonda: 'गोंडा',
  kaiserganj: 'कैसरगंज',
  tarabganj: 'तरबगंज',
  mankapur: 'मनकापुर',
  colonelganj: 'करनैलगंज',
  balrampur: 'बलरामपुर',
  bahraich: 'बहराइच',
  ayodhya: 'अयोध्या',
  lucknow: 'लखनऊ',
  uttarpradesh: 'उत्तर प्रदेश',
  up: 'उत्तर प्रदेश',
  india: 'भारत',
  breaking: 'ताज़ा ख़बर',
  news: 'समाचार',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('text')?.trim() || '';
  const from = searchParams.get('from'); // 'en' | 'hi' | 'auto'
  const to = searchParams.get('to');     // 'en' | 'hi'

  if (!raw) {
    return NextResponse.json({ hindi: '', english: '', slug: '', translated: '' });
  }

  const isHindiInput = /[\u0900-\u097F]/.test(raw);
  const sourceLang = from || (isHindiInput ? 'hi' : 'en');
  const targetLang = to || (isHindiInput ? 'en' : 'hi');

  const cacheKey = `${sourceLang}-${targetLang}-${raw.toLowerCase()}`;
  if (CACHE.has(cacheKey)) {
    return NextResponse.json(CACHE.get(cacheKey));
  }

  let hindiText = isHindiInput ? raw : '';
  let englishText = !isHindiInput ? raw : '';
  let translatedText = '';

  // 1. Check direct dictionary match for single words (English -> Hindi)
  const lower = raw.toLowerCase().trim();
  const compactLower = lower.replace(/\s+/g, '');
  if (!isHindiInput && (COMMON_DICTIONARY[lower] || COMMON_DICTIONARY[compactLower])) {
    const matchedHindi = COMMON_DICTIONARY[lower] || COMMON_DICTIONARY[compactLower];
    const slug = lower.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
    const result = {
      hindi: matchedHindi,
      english: raw,
      translated: matchedHindi,
      slug,
    };
    CACHE.set(cacheKey, result as any);
    return NextResponse.json(result);
  }

  // 2. Multi-strategy translation:
  // Strategy A: Google Translate API (Handles full sentences, bios, phrases, and bidirectional)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const gTranslateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(raw)}`;
    const res = await fetch(gTranslateUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const fullTranslation = data[0].map((item: any) => item[0]).join('');
        if (fullTranslation && fullTranslation.trim().length > 0) {
          translatedText = fullTranslation.trim();
          if (isHindiInput) {
            englishText = translatedText;
          } else {
            hindiText = translatedText;
          }
        }
      }
    }
  } catch (err) {
    // Continue to next strategy
  }

  // Strategy B: For English-to-Hindi names/proper nouns if Google Translate kept it English or as fallback
  if (!isHindiInput && (!hindiText || hindiText === raw)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(raw)}&itc=hi-t-i0-und&num=2`,
        { signal: controller.signal }
      );
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data && data[0] === 'SUCCESS' && Array.isArray(data[1])) {
          const translatedWords = data[1].map((item: any) => item[1]?.[0] || item[0]);
          hindiText = translatedWords.join(' ');
          translatedText = hindiText;
        }
      }
    } catch {
      // Ignored
    }
  }

  const slug = (englishText || raw)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

  const result = {
    hindi: hindiText || raw,
    english: englishText || raw,
    translated: translatedText || (isHindiInput ? englishText : hindiText) || raw,
    slug,
  };

  CACHE.set(cacheKey, result as any);
  return NextResponse.json(result);
}
