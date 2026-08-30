import Link from 'next/link';
import Image from 'next/image';
import {
  Youtube,
  Facebook,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Radio,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 mt-auto border-t-4 border-red-700 relative overflow-hidden">
      {/* Top Ambient Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-40 bg-red-700/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-40 bg-amber-600/5 blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Contact Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-red-600/80 bg-slate-800 shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/logo.png"
                  alt="इंटरनेट की आवाज़"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                  <span className="text-red-600">इंटरनेट</span> की आवाज़
                </h2>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  Digital Media & News Network
                </p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              उत्तर प्रदेश के गोंडा, कैसरगंज, देवीपाटन मंडल एवं समग्र पूर्वांचल का स्वतंत्र, निष्पक्ष और जन-सरोकारों को समर्पित अग्रणी हाइपर-लोकल डिजिटल समाचार नेटवर्क।
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-red-500 shrink-0 mt-0.5" />
                <span>फ़ोर्विशगंज, पंत नगर, गोंडा, उत्तर प्रदेश 271001</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-red-500 shrink-0" />
                <a
                  href="tel:07905895936"
                  className="hover:text-white font-semibold transition-colors"
                >
                  07905895936 / +91 79058 95936
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-red-500 shrink-0" />
                <span>editor@internetkiawaaz.in</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Globe size={15} className="text-red-500 shrink-0" />
                <a
                  href="http://www.internetkiawaaz.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  www.internetkiawaaz.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Editorial Desks (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2.5">
              प्रमुख समाचार डेस्क (Categories)
            </h3>

            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/category/siyasat"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>सियासत के सिरमौर (राजनीति)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/category/gonda-aanchal"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>गोंडा आंचल (स्थानीय हलचल)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/category/itihas-virasat"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>इतिहास व विरासत (अवध धरोहर)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/category/jan-awaaz"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>जन-आवाज़ / जन-समस्याएं</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sahitya-manch"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>साहित्य, संस्कृति एवं कला मंच</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/video-desk"
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronRight size={13} className="text-red-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>वीडियो बुलेटिन व ग्राउंड रिपोर्ट्स</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional & Legal Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2.5">
              संस्था व नीतियां
            </h3>

            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <span>हमारे बारे में (About)</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                  <span>संपर्क करें (Contact)</span>
                </Link>
              </li>
              <li>
                <Link href="/static/rni-declaration" className="text-slate-400 hover:text-white transition-colors">
                  RNI घोषणा पत्र
                </Link>
              </li>
              <li>
                <Link href="/static/grievance-redressal" className="text-slate-400 hover:text-white transition-colors">
                  शिकायत निवारण अधिकारी
                </Link>
              </li>
              <li>
                <Link href="/static/privacy-policy" className="text-slate-400 hover:text-white transition-colors">
                  गोपनीयता नीति (Privacy)
                </Link>
              </li>
              <li>
                <Link href="/static/terms-of-service" className="text-slate-400 hover:text-white transition-colors">
                  नियम व शर्तें (Terms)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp Helpline & Social (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-l-2 border-red-600 pl-2.5">
              नागरिक हेल्पलाइन व सोशल नेटवर्क
            </h3>

            {/* Direct WhatsApp Action Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-2.5 backdrop-blur shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <MessageCircle size={16} />
                <span>व्हाट्सएप न्यूज़ हेल्पलाइन</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                समाचार सुझाव, वीडियो फुटेज अथवा जनसमस्या साझा करने हेतु सीधे संपर्क करें।
              </p>
              <a
                href="https://wa.me/917905895936?text=नमस्ते%20इंटरनेट%20की%20आवाज़,%20मुझे%20समाचार%20साझा%20करना%20है।"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow"
              >
                <span>+91 79058 95936 पर लिखें</span>
                <ArrowRight size={13} />
              </a>
            </div>

            {/* Social Channels */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                फॉलो करें:
              </p>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.youtube.com/@InternetKiAwaaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow"
                  aria-label="यूट्यूब चैनल"
                >
                  <Youtube size={16} />
                </a>
                <a
                  href="https://www.facebook.com/Internetkiawaaz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow"
                  aria-label="फेसबुक पेज"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="https://www.instagram.com/internetkiawaaz/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all shadow"
                  aria-label="इंस्टाग्राम"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer & Statutory Disclaimers */}
      <div className="bg-slate-950 py-5 px-4 sm:px-6 border-t border-slate-800/90 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-0.5">
            <p className="text-slate-300 font-medium">
              © {new Date().getFullYear()} इंटरनेट की आवाज़ (Internet Ki Awaaz). समस्त अधिकार सुरक्षित।
            </p>
            <p className="text-[11px] text-slate-500">
              मान्यता प्राप्त डिजिटल समाचार मंच • गोंडा, उत्तर प्रदेश (भारत)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 text-xs">
            <Link href="/about" className="hover:text-white transition-colors">हमारे बारे में</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">संपर्क करें</Link>
            <span>•</span>
            <Link href="/static/rni-declaration" className="hover:text-white transition-colors">घोषणा पत्र</Link>
            <span>•</span>
            <Link href="/static/grievance-redressal" className="hover:text-white transition-colors">शिकायत निवारण</Link>
            <span>•</span>
            <Link href="/static/privacy-policy" className="hover:text-white transition-colors">गोपनीयता</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
