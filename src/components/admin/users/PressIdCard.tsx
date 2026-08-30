'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Download, Printer, Shield, CheckCircle2, QrCode, Phone, MapPin, Droplet, User, Award } from 'lucide-react';
import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface PressIdCardProps {
  user: Partial<ProfileRow>;
  onClose?: () => void;
}

export function PressIdCard({ user, onClose }: PressIdCardProps) {
  const cardFrontRef = useRef<HTMLDivElement>(null);
  const cardBackRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const fullName = user.full_name || 'Staff Member';
  const fullNameHi = user.full_name_hi || fullName;
  const roleName = user.role === 'super_admin' 
    ? 'प्रधान संपादक (Chief Editor)' 
    : user.role === 'editor' 
    ? 'संपादक (Editor)' 
    : user.role === 'reporter' 
    ? 'मान्यता प्राप्त संवाददाता (Press Reporter)' 
    : 'योगदानकर्ता (Staff Contributor)';

  const designation = user.designation_hi || user.designation || 'संवाददाता / प्रतिनिधि';
  const cardNo = user.id_card_number || `IKA-PRESS-2026-${(user.id || '0042').slice(0, 4).toUpperCase()}`;
  const bloodGroup = user.blood_group || 'O+';
  const issueDate = user.date_of_joining || '2026-01-01';
  const validUntil = user.valid_until || '2027-12-31';
  const phone = user.phone_number || '+91 79058 95936';
  const beat = user.reporter_beat || 'देवीपाटन मंडल / गोंडा';
  const avatar = user.avatar_url || '/logo.png';

  const downloadPdf = async () => {
    if (!cardFrontRef.current || !cardBackRef.current) return;
    setDownloading(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const canvasFront = await html2canvas(cardFrontRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const canvasBack = await html2canvas(cardBackRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgDataFront = canvasFront.toDataURL('image/png');
      const imgDataBack = canvasBack.toDataURL('image/png');

      // Standard ID-1 / CR80 card size: 85.6mm x 54mm (Landscape) or 54mm x 85.6mm (Portrait)
      // We will place both Front and Back on a clean single A4 / custom Card Page
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add Title
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(185, 28, 28);
      pdf.text('INTERNET KI AWAAZ - OFFICIAL PRESS IDENTITY CREDENTIAL', 105, 20, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Card Holder: ${fullName} | ID: ${cardNo} | Valid Until: ${validUntil}`, 105, 26, { align: 'center' });

      // Add Card Front (Width: 65mm, Height: 100mm)
      pdf.addImage(imgDataFront, 'PNG', 35, 35, 65, 103);

      // Add Card Back (Width: 65mm, Height: 100mm)
      pdf.addImage(imgDataBack, 'PNG', 110, 35, 65, 103);

      // Cutout Guidelines & Instructions
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text('✂ Cut along the outer border and laminate. Official Press Media Pass.', 105, 145, { align: 'center' });
      pdf.text('For online verification visit: https://internetkiawaaz.in/verify', 105, 150, { align: 'center' });

      pdf.save(`Press-ID-Card-${cardNo}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('पीडीएफ बनाने में त्रुटि हुई। कृपया प्रिंट विकल्प का उपयोग करें।');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Award className="text-amber-400" size={18} />
            <span>डिजिटल प्रेस पहचान पत्र (Official Press ID Card)</span>
          </h3>
          <p className="text-xs text-slate-400">
            आईडी नंबर: <span className="font-mono text-amber-300 font-bold">{cardNo}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadPdf}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download size={14} />
            <span>{downloading ? 'पीडीएफ तैयार हो रही है...' : 'PDF डाउनलोड करें'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Printer size={14} />
            <span>प्रिंट करें</span>
          </button>
        </div>
      </div>

      {/* ID Card Previews: Front & Back */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center bg-slate-100 p-6 rounded-2xl border border-slate-200">
        {/* ================= FRONT SIDE ================= */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            अग्र भाग (Front Side)
          </span>

          <div
            ref={cardFrontRef}
            id="press-card-front"
            className="w-[280px] h-[440px] bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-300 flex flex-col relative text-slate-800 select-none"
            style={{ fontFamily: 'sans-serif' }}
          >
            {/* Top Press Header */}
            <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-900 text-white text-center py-2.5 px-3 relative border-b-2 border-amber-400">
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-full bg-white p-0.5 relative shrink-0 shadow">
                  <Image src="/logo.png" alt="Logo" fill className="object-cover rounded-full" />
                </div>
                <h4 className="font-extrabold text-sm tracking-tight leading-none text-white">
                  इंटरनेट की आवाज़
                </h4>
              </div>
              <p className="text-[7.5px] font-bold uppercase tracking-widest text-amber-200">
                DIGITAL NEWS NETWORK & MEDIA
              </p>
              <div className="mt-1 bg-amber-400 text-slate-950 font-black text-[9px] py-0.5 px-2 rounded-sm uppercase tracking-wider inline-block shadow-sm">
                PRESS IDENTITY CARD
              </div>
            </div>

            {/* Photo & Identity Section */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center">
              {/* Photo Frame */}
              <div className="relative w-24 h-28 rounded-lg overflow-hidden border-2 border-red-700 shadow-md bg-slate-100 mb-2">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={40} />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-red-700 text-white text-[8px] font-bold py-0.5 uppercase">
                  PRESS
                </div>
              </div>

              {/* Name & Title */}
              <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-0.5">
                {fullNameHi}
              </h3>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                {fullName}
              </p>
              <p className="text-[11px] font-extrabold text-red-700 mt-1">
                {designation}
              </p>
              <p className="text-[9px] text-slate-500 font-semibold">
                बीट: {beat}
              </p>

              {/* ID Badge Row */}
              <div className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-left text-[9px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">आईडी क्र. / ID:</span>
                  <span className="font-mono font-bold text-slate-900">{cardNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">रक्त समूह / Blood:</span>
                  <span className="font-bold text-red-700">{bloodGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">वैधता / Valid Till:</span>
                  <span className="font-bold text-emerald-700">{validUntil}</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar with Signature & Seal */}
            <div className="bg-slate-100 border-t border-slate-200 px-3 py-2 flex items-center justify-between text-[8px]">
              <div className="text-center">
                <div className="w-12 border-b border-slate-400 mb-0.5 mx-auto font-serif italic text-[8px] text-slate-600">
                  A.K. Singh
                </div>
                <span className="text-slate-500 font-bold block">प्राधिकृत हस्ताक्षर</span>
              </div>

              {/* Official Seal Badge */}
              <div className="w-9 h-9 rounded-full border-2 border-dashed border-red-700 flex flex-col items-center justify-center text-red-800 text-[6px] font-black leading-none uppercase p-0.5 text-center">
                <span>PRESS</span>
                <span>SEAL</span>
              </div>

              <div className="text-center">
                <div className="w-8 h-8 bg-slate-900 text-white rounded p-0.5 flex items-center justify-center mx-auto">
                  <QrCode size={26} />
                </div>
                <span className="text-[7px] text-slate-500 font-mono">VERIFY</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            पृष्ठ भाग (Back Side)
          </span>

          <div
            ref={cardBackRef}
            id="press-card-back"
            className="w-[280px] h-[440px] bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-300 flex flex-col relative text-slate-800 select-none p-4 justify-between"
            style={{ fontFamily: 'sans-serif' }}
          >
            {/* Header */}
            <div className="text-center border-b border-slate-200 pb-2">
              <h5 className="font-extrabold text-xs text-red-700 uppercase">
                संपादकीय एवं प्रशासनिक कार्यालय
              </h5>
              <p className="text-[8px] text-slate-500 font-medium">
                फ़ोर्विशगंज, पंत नगर, गोंडा, उत्तर प्रदेश 271001
              </p>
            </div>

            {/* Terms / Statutory Declaration */}
            <div className="space-y-2 text-[8px] text-slate-700 text-justify leading-relaxed">
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 font-medium text-[8px]">
                <strong>घोषणा पत्र:</strong> यह कार्ड &apos;इंटरनेट की आवाज़&apos; के अधिकृत पत्रकार/स्टाफ का पहचान पत्र है। समस्त नागरिक व पुलिस प्रशासन से समाचार संकलन में यथोचित सहयोग की प्रार्थना है।
              </div>

              <div className="space-y-1 text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Phone size={10} className="text-red-600 shrink-0" />
                  <span><strong>हेल्पलाइन:</strong> 07905895936 / +91 79058 95936</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone size={10} className="text-red-600 shrink-0" />
                  <span><strong>आपातकालीन संपर्क:</strong> {user.emergency_contact || phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin size={10} className="text-red-600 shrink-0" />
                  <span><strong>पता:</strong> {user.address || 'गोंडा, उत्तर प्रदेश'}</span>
                </p>
              </div>

              <div className="border-t border-slate-200 pt-1.5 text-[7.5px] text-slate-500">
                * कार्ड खो जाने पर तत्काल कार्यालय को सूचित करें। कार्ड का दुरुपयोग दण्डनीय अपराध है।
              </div>
            </div>

            {/* Barcode & Verification */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center">
              <div className="font-mono text-[10px] font-black tracking-widest text-slate-800 mb-0.5">
                ||||| | |||| ||| |||||| |||| | ||
              </div>
              <p className="text-[7.5px] font-mono text-slate-500">
                {cardNo} • WWW.INTERNETKIAWAAZ.IN
              </p>
            </div>

            {/* Bottom Disclaimer */}
            <div className="text-center text-[7.5px] text-slate-400 font-medium border-t border-slate-200 pt-1">
              © {new Date().getFullYear()} इंटरनेट की आवाज़ मीडिया नेटवर्क • ऑल राइट्स रिजर्व्ड
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
