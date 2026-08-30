import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Target,
  Users,
  Award,
  ShieldCheck,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Radio,
  Building,
  Landmark,
  Scroll,
  Megaphone,
  BookOpen,
  Wheat,
  PlayCircle,
  Eye,
  FileCheck,
  Scale,
  MessageCircle,
  Clock,
  Send,
  HelpCircle,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'हमारे बारे में (About Us) | इंटरनेट की आवाज़',
  description: 'इंटरनेट की आवाज़ — गोंडा, कैसरगंज, देवीपाटन मंडल एवं समग्र पूर्वांचल का प्रमुख स्वतंत्र, निष्पक्ष और जन-सरोकारों को समर्पित डिजिटल समाचार नेटवर्क।',
};

// 1. Coverage Desks
const COVERAGE_DESKS = [
  {
    icon: Landmark,
    title: 'सियासत के सिरमौर',
    desc: 'विधानसभा, लोकसभा, पंचायती राज एवं स्थानीय प्रशासनिक नीतियों का गहन विश्लेषण व बेबाक राजनीतिक रिपोर्टिंग।',
    href: '/category/siyasat',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    icon: MapPin,
    title: 'गोंडा आंचल व मंडल',
    desc: 'गोंडा शहर, कैसरगंज, तरबगंज, मनकापुर, करनैलगंज, बलरामपुर, बहराइच व श्रावस्ती की जमीनी हलचल और समस्याएं।',
    href: '/category/gonda-aanchal',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    icon: Scroll,
    title: 'इतिहास व अवध विरासत',
    desc: '1857 स्वतंत्रता संग्राम के महानायक राजा देवी बख्श सिंह, स्वामीनारायण छपिया धाम, पृथ्वीनाथ मंदिर व अवध की गौरवशाली धरोहर।',
    href: '/category/itihas-virasat',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    icon: Megaphone,
    title: 'जन-आवाज़ / नागरिक मुद्दे',
    desc: 'टूटी सड़कें, बिजली-पानी, सरकारी अस्पतालों की स्थिति, जलभराव और आम जनता की समस्याओं को प्रशासन तक पहुंचाना।',
    href: '/category/jan-awaaz',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    icon: BookOpen,
    title: 'साहित्य, संस्कृति एवं कला',
    desc: 'क्षेत्रीय लोककला, कवि सम्मेलन, अवधी भाषा, साहित्यिक मंच, संगीत, युवा प्रतिभाओं व सांस्कृतिक उत्सवों का मंचन।',
    href: '/category/sahitya-manch',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    icon: PlayCircle,
    title: 'वीडियो बुलेटिन व लाइव ग्राउंड कवरेज',
    desc: 'घटनास्थल से सीधे लाइव वीडियो रिपोर्ट्स, जनसंवाद, साक्षात्कार और यूट्यूब पर प्रसारित विशेष खोजी बुलेटिन।',
    href: '/video-desk',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

// 2. Editorial Values
const EDITORIAL_VALUES = [
  {
    icon: Target,
    title: 'निष्पक्षता (Impartiality)',
    desc: 'किसी भी राजनीतिक दल, धर्म, जाति अथवा व्यावसायिक समूह के पक्षपात से परे केवल तथ्यों पर आधारित सत्य रिपोर्टिंग।',
    tag: 'शून्य पूर्वाग्रह',
  },
  {
    icon: ShieldCheck,
    title: 'सत्यनिष्ठा व दोहरा सत्यापन (Integrity)',
    desc: 'प्रत्येक सूचना को प्रकाशित करने से पूर्व दो स्वतंत्र प्रमाणिक स्रोतों (Double Verification) से जांचने की अनिवार्य नीति।',
    tag: 'तथ्य-जांच',
  },
  {
    icon: Users,
    title: 'जन-जवाबदेही (Public Accountability)',
    desc: 'सरकारी विभागों, निर्वाचित प्रतिनिधियों और सार्वजनिक संस्थाओं को जनता के प्रति जवाबदेह बनाना हमारा प्राथमिक कर्तव्य है।',
    tag: 'जन-सरोकार',
  },
  {
    icon: Scale,
    title: 'स्वतंत्रता व निर्भीकता (Independence)',
    desc: 'बिना किसी दबाव या प्रभाव के सच को सामने लाना और जनहित के मुद्दों पर निडरता से लिखना।',
    tag: 'निर्भीक पत्रकारिता',
  },
];

// 3. Editorial Team Members
const EDITORIAL_TEAM = [
  {
    role: 'प्रधान संपादक / संस्थापक',
    nameHi: 'संपादकीय मंडल प्रमुख',
    nameEn: 'Editorial Board & Bureau Head',
    beat: 'गोंडा • देवीपाटन मंडल मुख्यालय',
    idCard: 'IKA-PRESS-2026-HQ',
    desc: '20+ वर्षों का क्षेत्रीय व राष्ट्रीय पत्रकारिता अनुभव। खोजी पत्रकारिता एवं ग्रामीण सरोकारों के विशेषज्ञ।',
    iconColor: 'bg-red-700 text-white',
  },
  {
    role: 'वरिष्ठ ब्यूरो चीफ',
    nameHi: 'पूर्वांचल विशेष डेस्क',
    nameEn: 'Senior Bureau Chief - Eastern UP',
    beat: 'कैसरगंज • बहराइच • लखनऊ लिंक',
    idCard: 'IKA-PRESS-2026-BUR1',
    desc: 'राजनीतिक विश्लेषण, विधायी रिपोर्टिंग और विकासात्मक परियोजनाओं के जमीनी मूल्यांकन के प्रभारी।',
    iconColor: 'bg-blue-700 text-white',
  },
  {
    role: 'तहसील व ग्राउंड संवाददाता नेटवर्क',
    nameHi: 'क्षेत्रीय रिपोर्टर्स दल (25+ ग्राउंड पत्रकार)',
    nameEn: 'Field Correspondents Network',
    beat: 'तरबगंज • मनकापुर • करनैलगंज • छपिया',
    idCard: 'IKA-PRESS-NETWORK',
    desc: 'गांव-गांव व कस्बों से त्वरित लाइव अपडेट्स, वीडियो बाइट्स एवं नागरिक समस्याओं का संकलन।',
    iconColor: 'bg-emerald-700 text-white',
  },
  {
    role: 'डिजिटल वीडियो व सोशल मीडिया डेस्क',
    nameHi: 'मल्टीमीडिया एवं फैक्ट-चेक टीम',
    nameEn: 'Digital Media & Verification Lead',
    beat: 'यूट्यूब • फेसबुक • इंस्टाग्राम • वेब पोर्टल',
    idCard: 'IKA-PRESS-DIGITAL',
    desc: '24x7 ब्रेकिंग न्यूज़ अलर्ट्स, वीडियो प्रोडक्शन, यूट्यूब बुलेटिन और लाइव टिकर प्रबंधन।',
    iconColor: 'bg-amber-600 text-white',
  },
];

// 4. Why Trust Us Pillars
const TRUST_POINTS = [
  {
    icon: Radio,
    title: '100% ऑन-ग्राउंड रिपोर्टिंग',
    desc: 'कमरे में बैठकर नहीं, बल्कि घटना स्थल पर जाकर स्थानीय नागरिकों से संवाद कर तैयार किए गए प्रमाणिक समाचार।',
  },
  {
    icon: ShieldCheck,
    title: 'फेक न्यूज़ पर ज़ीरो टॉलरेंस',
    desc: 'सोशल मीडिया पर वायरल भ्रामक दावों का तकनीकी व जमीनी फैक्ट-चेक करने के बाद ही प्रसारण।',
  },
  {
    icon: MessageCircle,
    title: 'सीधी नागरिक हेल्पलाइन',
    desc: 'व्हाट्सएप व मोबाइल पर हर नागरिक के लिए अपनी समस्या सीधे संपादक तक पहुंचाने की 24 घंटे खुली सुविधा।',
  },
  {
    icon: FileCheck,
    title: 'संवैधानिक व नैतिक अनुपालन',
    desc: 'भारतीय प्रेस परिषद (Press Council of India) की पत्रकारिता आचार संहिता एवं आईटी नियमों का पूर्ण पालन।',
  },
];

// 5. Fact-checking Policies
const FACT_CHECK_STEPS = [
  {
    step: '01',
    title: 'प्राथमिक स्रोत सत्यापन (Primary Sourcing)',
    desc: 'प्रत्यक्षदर्शियों, संबंधित प्रशासनिक अधिकारियों, पुलिस रिकॉर्ड अथवा आधिकारिक दस्तावेज़ों से मूल तथ्य की पुष्टि।',
  },
  {
    step: '02',
    title: 'पक्ष-विपक्ष एवं राइट-टू-रिप्लाई (Right to Reply)',
    desc: 'किसी भी आरोप या विवादित खबर में संबंधित सभी पक्षों का अधिकृत बयान शामिल करने का निष्पक्ष अवसर प्रदान करना।',
  },
  {
    step: '03',
    title: 'त्रुटि सुधार व स्पष्टीकरण नीति (Corrections Policy)',
    desc: 'यदि किसी खबर में अनजाने में कोई तथ्यात्मक त्रुटि होती है, तो उसे तुरंत स्पष्टीकरण नोट के साथ पारदर्शी ढंग से सुधारा जाता है।',
  },
  {
    step: '04',
    title: 'गोपनीय स्रोतों की सुरक्षा (Source Confidentiality)',
    desc: 'व्हिसलब्लोअर और जनता के संवेदनशील स्रोतों की पहचान की पूर्ण गोपनीयता बनाए रखने की गारंटी।',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-8 bg-slate-50/70 selection:bg-red-700 selection:text-white" lang="hi">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION — ABOUT THE NEWS CHANNEL */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-14 border border-slate-800 shadow-2xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-700/90 text-white text-xs font-extrabold uppercase tracking-wider shadow-md backdrop-blur">
              <Sparkles size={14} className="text-amber-300 animate-pulse" />
              <span>उत्तर प्रदेश व पूर्वांचल का अग्रणी डिजिटल समाचार नेटवर्क</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              इंटरनेट की आवाज़ — <span className="text-red-500">ख़बर, ज्ञान और जन-सरोकार का मंच</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              <strong>इंटरनेट की आवाज़ (Internet Ki Awaaz)</strong> उत्तर प्रदेश के गोंडा, कैसरगंज, देवीपाटन मंडल (बलरामपुर, बहराइच, श्रावस्ती) और समग्र पूर्वांचल का एक स्वतंत्र, निष्पक्ष और निर्भीक हाइपर-लोकल डिजिटल मीडिया संस्थान है। हम केवल समाचार नहीं देते, बल्कि आम जनमानस की बुनियादी समस्याओं को शासन और प्रशासन के शीर्ष पटल तक मजबूती से पहुंचाते हैं।
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xl transition-all hover:scale-[1.02]"
              >
                <span>संपादकीय टीम से संपर्क करें</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href="https://www.youtube.com/@InternetKiAwaaz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
              >
                <Youtube size={16} className="text-red-500" />
                <span>YouTube: @InternetKiAwaaz</span>
              </a>

              <a
                href="https://wa.me/917905895936?text=नमस्ते%20इंटरनेट%20की%20आवाज़"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-600 transition-colors"
              >
                <MessageCircle size={16} />
                <span>व्हाट्सएप हेल्पलाइन</span>
              </a>
            </div>
          </div>
        </section>

        {/* Quick Numbers Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-red-700">1,00,000+</p>
            <p className="text-xs text-slate-600 font-semibold mt-1">डिजिटल पाठक व दर्शक</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-slate-900">25+</p>
            <p className="text-xs text-slate-600 font-semibold mt-1">तहसील व ग्राउंड रिपोर्टर्स</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-emerald-700">24x7</p>
            <p className="text-xs text-slate-600 font-semibold mt-1">लाइव ब्रेकिंग न्यूज़ कवरेज</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
            <p className="text-3xl font-extrabold text-amber-700">100%</p>
            <p className="text-xs text-slate-600 font-semibold mt-1">सत्यापित व निष्पक्ष तथ्य</p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. OUR STORY — हमारी कहानी */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Scroll size={16} />
              <span>सफ़रनामा व स्थापना</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              हमारी कहानी (Our Story) — ज़मीनी पत्रकारिता से डिजिटल क्रांति तक
            </h2>
          </div>

          <div className="prose max-w-none text-slate-700 leading-relaxed text-sm space-y-4">
            <p className="text-base font-medium text-slate-900">
              जब मुख्यधारा की मीडिया का ध्यान केवल महानगरों तक सीमित था, तब गोंडा, कैसरगंज, तरबगंज और देवीपाटन मंडल के सुदूर ग्रामीण क्षेत्रों के नागरिकों की आवाज़ को मंच देने के लिए <strong>"इंटरनेट की आवाज़"</strong> की नींव रखी गई।
            </p>
            <p>
              स्थानीय स्तर पर भ्रष्टाचार, प्रशासनिक शिथिलता, स्वास्थ्य सेवाओं की बदहाली, और किसानों की समस्याओं को बेबाकी से उजागर करने के संकल्प के साथ हमने अपनी यात्रा प्रारंभ की। हमने पारंपरिक अखबारों की सीमाओं से आगे बढ़कर आधुनिक डिजिटल युग के अनुरूप यूट्यूब वीडियो रिपोर्ट्स, लाइव ग्राउंड बुलेटिन और सोशल मीडिया के माध्यम से प्रत्येक गांव तक अपनी पहुंच बनाई।
            </p>
            <p>
              आज <strong>इंटरनेट की आवाज़</strong> पूर्वांचल के लाखों नागरिकों, युवाओं, किसानों और प्रबुद्धजनों का सबसे भरोसेमंद सूचना स्रोत बन चुका है। हमारा कार्यालय गोंडा के पंत नगर (फ़ोर्विशगंज) में स्थित है, जहाँ से हमारी संपादकीय टीम दिन-रात निर्भीक पत्रकारिता का संचालन करती है।
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3 & 4. OUR MISSION & OUR VISION */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission */}
          <div className="bg-gradient-to-br from-red-50 to-white border-2 border-red-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-700 text-white flex items-center justify-center shadow-md mb-4">
                <Target size={26} />
              </div>
              <span className="text-xs font-extrabold text-red-700 uppercase tracking-widest block mb-1">
                हमारा ध्येय (Mission)
              </span>
              <h3 className="text-2xl font-extrabold text-slate-950 mb-3">
                हमारा मिशन (Our Mission)
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                सत्य, निष्पक्षता और मानवीय सरोकार पर आधारित प्रमाणिक समाचार प्रस्तुत करना। आम नागरिक को निर्भय होकर अपनी समस्याएं उठाने का सशक्त मंच प्रदान करना और लोकतांत्रिक मूल्यों एवं प्रशासनिक पारदर्शिता को सुदृढ़ बनाना।
              </p>
            </div>
            <div className="pt-2 border-t border-red-100 flex items-center gap-2 text-xs font-bold text-red-800">
              <CheckCircle2 size={16} />
              <span>सत्यमेव जयते • जनहित सर्वोपरि</span>
            </div>
          </div>

          {/* Vision */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md mb-4">
                <Compass size={26} />
              </div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest block mb-1">
                हमारा विज़न (Vision)
              </span>
              <h3 className="text-2xl font-extrabold text-white mb-3">
                हमारा विज़न (Our Vision)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                पूर्वांचल और अवध का सर्वाधिक सम्मानित, तकनीकी रूप से अग्रणी और विश्वसनीय हाइपर-लोकल डिजिटल मीडिया नेटवर्क बनना, जो आधुनिक तकनीक के माध्यम से अंतिम पंक्ति में खड़े व्यक्ति की आवाज़ को राष्ट्रीय स्तर पर स्थापित कर सके।
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles size={16} />
              <span>आधुनिक डिजिटल तकनीक • सशक्त क्षेत्रीय पत्रकारिता</span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. WHAT WE COVER — हम क्या कवर करते हैं */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Radio size={16} />
              <span>संपादकीय श्रेणियां व कवरेज दायरा</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              हम क्या कवर करते हैं (What We Cover)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              जनता के प्रत्येक पहलू, राजनीति से लेकर अवध की संस्कृति तक हमारा बहुआयामी कवरेज।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COVERAGE_DESKS.map((desk, idx) => {
              const Icon = desk.icon;
              return (
                <Link
                  key={idx}
                  href={desk.href}
                  className={`p-6 rounded-2xl border transition-all hover:shadow-md hover:scale-[1.01] flex flex-col justify-between ${desk.color}`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center mb-3.5">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {desk.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {desk.desc}
                    </p>
                  </div>
                  <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center gap-1 text-xs font-bold text-slate-900">
                    <span>डेस्क देखें</span>
                    <ArrowRight size={13} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. OUR EDITORIAL VALUES — हमारे संपादकीय मूल्य */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-8">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Scale size={16} />
              <span>संपादकीय आचार संहिता</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              हमारे संपादकीय मूल्य (Our Editorial Values)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              इन 4 आधारभूत स्तंभों पर हमारी हर रिपोर्ट और बुलेटिन संचालित होती है।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDITORIAL_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 backdrop-blur space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-red-700/80 text-white flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                      {val.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{val.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. OUR JOURNALISTS / EDITORIAL TEAM — हमारी संपादकीय टीम */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Users size={16} />
              <span>संपादकीय मंडल व संवाददाता</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              हमारी पत्रकारिता टीम (Our Journalists & Editorial Team)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              अनुभवी संपादकों और निष्ठावान फील्ड संवाददाताओं का सशक्त नेटवर्क।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EDITORIAL_TEAM.map((member, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider block">
                        {member.role}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                        {member.nameHi}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{member.nameEn}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-[10px] font-bold shrink-0">
                      {member.idCard}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mb-3">
                    <MapPin size={13} className="text-red-700" />
                    <span>बीट: {member.beat}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {member.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>सत्यापित प्रेस पहचान पत्र धारक</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. WHY TRUST US — हमें क्यों चुनें */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-red-700 via-red-800 to-red-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="border-b border-red-600 pb-4">
            <div className="flex items-center gap-2 text-red-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Award size={16} />
              <span>पाठकों का अटूट विश्वास</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              हमें क्यों चुनें? (Why Trust Us)
            </h2>
            <p className="text-xs text-red-100 mt-1">
              क्यों लाखों पाठक प्रतिदिन अपनी खबरों के लिए 'इंटरनेट की आवाज़' पर भरोसा करते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_POINTS.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-white text-red-800 flex items-center justify-center shadow-md">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-sm text-white">{pt.title}</h3>
                  <p className="text-xs text-red-100 leading-relaxed">{pt.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. EDITORIAL & FACT-CHECKING POLICY — तथ्य-जांच नीति */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-red-700 text-xs font-bold uppercase tracking-wider mb-1">
              <FileCheck size={16} />
              <span>सत्यता की गारंटी</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              संपादकीय एवं तथ्य-जांच नीति (Editorial & Fact-Checking Policy)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              इंटरनेट की आवाज़ की 4-चरणीय कठोर सत्यापन प्रक्रिया।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FACT_CHECK_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-red-700 text-white font-extrabold font-mono text-sm flex items-center justify-center shadow-sm">
                    {step.step}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900">{step.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-12">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <HelpCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>शिकायत एवं सुधार प्रकोष्ठ (Grievance Redressal):</strong> यदि आपको प्रकाशित किसी भी सामग्री पर कोई आपत्ति अथवा तथ्यात्मक त्रुटि प्रतीत होती है, तो आप हमारे शिकायत निवारण अधिकारी को <a href="mailto:editor@internetkiawaaz.in" className="font-bold text-red-700 underline">editor@internetkiawaaz.in</a> पर सूचित कर सकते हैं। हम 24 घंटे के भीतर समीक्षा कर आवश्यक कार्रवाई सुनिश्चित करते हैं।
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. CONTACT / GET IN TOUCH — संपर्क व संवाद */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Phone size={16} />
              <span>24x7 खुला संवाद</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              हमसे संपर्क करें (Contact / Get in Touch)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              समाचार सुझाव, ब्यूरो रिपोर्टिंग सहयोग अथवा जनसमस्या साझा करने हेतु उपलब्ध माध्यम।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center text-white">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">संपादकीय मुख्यालय</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                फ़ोर्विशगंज, पंत नगर, गोंडा, उत्तर प्रदेश 271001 (Forvishganj, Pant Nagar, Gonda, UP)
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">नागरिक न्यूज़ हेल्पलाइन</h3>
              <p className="text-xs text-slate-300">
                व्हाट्सएप व कॉलिंग:{' '}
                <a href="tel:07905895936" className="text-emerald-400 font-bold hover:underline">
                  +91 79058 95936 / 07905895936
                </a>
              </p>
              <a
                href="https://wa.me/917905895936?text=नमस्ते%20इंटरनेट%20की%20आवाज़"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[11px] text-emerald-400 font-semibold hover:underline"
              >
                सीधे व्हाट्सएप पर चैट करें →
              </a>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Mail size={20} />
              </div>
              <h3 className="font-bold text-sm text-white">ईमेल एवं वेब पोर्टल</h3>
              <p className="text-xs text-slate-300">
                ईमेल: <span className="text-blue-400 font-mono">editor@internetkiawaaz.in</span>
              </p>
              <p className="text-xs text-slate-300">
                वेबसाइट: <span className="text-blue-400 font-mono">www.internetkiawaaz.com</span>
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">सोशल नेटवर्क:</span>
              <a
                href="https://www.youtube.com/@InternetKiAwaaz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Youtube size={14} />
                <span>YouTube</span>
              </a>
              <a
                href="https://www.facebook.com/Internetkiawaaz/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Facebook size={14} />
                <span>Facebook</span>
              </a>
              <a
                href="https://www.instagram.com/internetkiawaaz/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Instagram size={14} />
                <span>Instagram</span>
              </a>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-lg transition-all"
            >
              <span>संपूर्ण संपर्क पेज व गूगल मैप देखें</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
