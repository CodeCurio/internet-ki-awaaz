'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Globe,
  Youtube,
  Facebook,
  Instagram,
  Clock,
  ShieldCheck,
  AlertCircle,
  Building,
  Radio,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { submitContactMessage } from '@/lib/actions/contact.actions';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [subject, setSubject] = useState('समाचार सुझाव / जनसमस्या');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || fullName.trim().length < 2) {
      setErrorMsg('कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!message || message.trim().length < 5) {
      setErrorMsg('कृपया संदेश अथवा समाचार का विवरण लिखें।');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await submitContactMessage({
      fullName,
      phoneNumber,
      email,
      city,
      subject,
      message,
    });

    setLoading(false);
    if (res.success) {
      setReferenceId(res.referenceId || `IKA-MSG-${Date.now().toString().slice(-4)}`);
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || 'संदेश भेजने में विफल। कृपया पुनः प्रयास करें।');
    }
  };

  const whatsappShareUrl = `https://wa.me/917905895936?text=${encodeURIComponent(
    `नमस्ते इंटरनेट की आवाज़ टीम,\nमैंने संपर्क फॉर्म सबमिट किया है।\nसंदर्भ आईडी: ${referenceId}\nनाम: ${fullName}\nमोबाइल: ${phoneNumber}\nविषय: ${subject}\nसंदेश: ${message}`
  )}`;

  return (
    <div className="min-h-screen py-8 bg-slate-50/60 selection:bg-red-700 selection:text-white" lang="hi">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header Hero */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-700/80 text-white text-xs font-bold uppercase tracking-wider backdrop-blur">
              <Radio size={14} className="text-amber-300 animate-pulse" />
              <span>24x7 संपादकीय डेस्क व नागरिक हेल्पलाइन</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              हमसे संपर्क करें — <span className="text-red-500">इंटरनेट की आवाज़</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              समाचार सुझाव, जनसमस्या, स्थानीय रिपोर्टिंग, वीडियो कवरेज अथवा संपादकीय सहयोग के लिए हमारी टीम से सीधे संपर्क करें।
            </p>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://wa.me/917905895936?text=नमस्ते%20इंटरनेट%20की%20आवाज़,%20मुझे%20समाचार%20साझा%20करना%20है।"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl p-5 transition-all shadow-sm flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <MessageCircle size={24} />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">व्हाट्सएप हेल्पलाइन</p>
              <p className="text-sm font-extrabold text-emerald-950">+91 79058 95936</p>
              <span className="text-[11px] text-emerald-700 font-semibold">1-क्लिक में चैट शुरू करें →</span>
            </div>
          </a>

          <a
            href="tel:07905895936"
            className="bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-2xl p-5 transition-all shadow-sm flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <p className="text-xs text-red-800 font-bold uppercase tracking-wider">सीधा फ़ोन संपर्क</p>
              <p className="text-sm font-extrabold text-red-950">07905895936</p>
              <span className="text-[11px] text-red-700 font-semibold">कॉल करने के लिए टैप करें →</span>
            </div>
          </a>

          <a
            href="mailto:editor@internetkiawaaz.in"
            className="bg-blue-50 hover:bg-blue-100/80 border border-blue-200 rounded-2xl p-5 transition-all shadow-sm flex items-center gap-4 group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">आधिकारिक ईमेल</p>
              <p className="text-sm font-extrabold text-blue-950">editor@internetkiawaaz.in</p>
              <span className="text-[11px] text-blue-700 font-semibold">ईमेल भेजें →</span>
            </div>
          </a>
        </div>

        {/* Main 2-Column: Headquarters & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Office & Social Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Building size={20} className="text-red-700" />
                  <span>मुख्यालय व संपादकीय पता</span>
                </h2>
              </div>

              <div className="space-y-4 text-xs text-slate-700">
                <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <MapPin size={18} className="text-red-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block text-sm mb-0.5">
                      इंटरनेट की आवाज़ (Internet Ki Awaaz)
                    </strong>
                    <p className="text-slate-600 leading-relaxed">
                      फ़ोर्विशगंज, पंत नगर, गोंडा, उत्तर प्रदेश 271001
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      Forvishganj, Pant Nagar, Gonda, UP 271001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Clock size={18} className="text-red-700 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">कार्य समय (Office Hours)</strong>
                    <p className="text-slate-600">सोमवार से शनिवार: प्रातः 09:00 बजे से सायं 08:00 बजे तक</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <Globe size={18} className="text-red-700 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block">आधिकारिक वेबसाइट</strong>
                    <a
                      href="http://www.internetkiawaaz.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 font-semibold hover:underline"
                    >
                      www.internetkiawaaz.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  आधिकारिक सोशल मीडिया नेटवर्क
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href="https://www.youtube.com/@InternetKiAwaaz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
                  >
                    <Youtube size={16} />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://www.facebook.com/Internetkiawaaz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                  >
                    <Facebook size={16} />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/internetkiawaaz/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200 transition-colors"
                  >
                    <Instagram size={16} />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & News Submission Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-lg font-extrabold text-slate-900">
                  संपादकीय टीम को संदेश या समाचार भेजें
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  अपना समाचार सुझाव अथवा जनसमस्या नीचे दिए गए फॉर्म के माध्यम से सीधे सबमिट करें।
                </p>
              </div>

              {submitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-5 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={36} />
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-emerald-200/80 text-emerald-900 font-mono text-xs font-extrabold">
                      संदर्भ संख्या: {referenceId}
                    </span>
                    <h3 className="text-lg font-extrabold text-emerald-950 mt-2">
                      आपका संदेश सफलतापूर्वक प्राप्त हुआ!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1 max-w-md mx-auto leading-relaxed">
                      धन्यवाद {fullName || ''}! आपकी सूचना हमारे संपादकीय डेस्क पर सुरक्षित रूप से दर्ज कर ली गई है। हमारी टीम आवश्यकतानुसार आपसे शीघ्र संपर्क करेगी।
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={whatsappShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition-colors"
                    >
                      <MessageCircle size={15} />
                      <span>व्हाट्सएप पर कॉपी भेजें</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFullName('');
                        setPhoneNumber('');
                        setEmail('');
                        setCity('');
                        setMessage('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors"
                    >
                      नया संदेश लिखें
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        आपका पूरा नाम *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Tripathi"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        मोबाइल / व्हाट्सएप नंबर *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        ईमेल पता (वैकल्पिक / Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        तहसील / शहर (Location)
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. गोंडा / कैसरगंज"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      संदेश का विषय (Subject)
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 bg-white font-medium"
                    >
                      <option value="समाचार सुझाव / जनसमस्या">समाचार सुझाव / जनसमस्या (News Tip / Civic Issue)</option>
                      <option value="ब्यूरो रिपोर्टिंग सहयोग">ब्यूरो रिपोर्टिंग सहयोग (Reporter Contribution)</option>
                      <option value="संपादकीय प्रतिक्रिया">संपादकीय प्रतिक्रिया (Editorial Feedback)</option>
                      <option value="तकनीकी सहायता">तकनीकी सहायता (Technical Support)</option>
                      <option value="अन्य">अन्य (General Inquiry)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      संदेश अथवा समाचार विवरण *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="समाचार का विवरण, स्थान और घटना की जानकारी विस्तार से लिखें..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>संदेश दर्ज हो रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>संदेश सबमिट करें (Submit Message)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Interactive Google Map */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin size={20} className="text-red-700" />
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
              गूगल मैप्स पर हमारा कार्यालय (Office Location Map)
            </h2>
          </div>

          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner bg-slate-100 aspect-video md:aspect-[21/9] max-h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3550.84031123892!2d81.9321124757347!3d27.12983927651838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3999f341c67aad71%3A0xb5fe058beafc3e34!2sINTERNET%20KI%20AWAAZ!5e0!3m2!1sen!2sin!4v1788087628624!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="इंटरनेट की आवाज़ कार्यालय गूगल मैप"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
