import type { Metadata } from 'next';
import { ShieldCheck, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'शिकायत निवारण (Grievance Redressal) | इंटरनेट की आवाज़',
  description: 'डिजिटल मीडिया नियम 2021 के तहत शिकायत निवारण अधिकारी का विवरण।',
};

export default function GrievanceRedressalPage() {
  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-4 border-b-2 border-red-700 pb-3">
          शिकायत निवारण तंत्र (Grievance Redressal Mechanism)
        </h1>

        <div className="prose max-w-none text-slate-800 leading-[1.9] space-y-4">
          <p>
            सूचना प्रौद्योगिकी (मध्यवर्ती संसथाओं के लिए दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 के नियम 11 के तहत पाठकों और नागरिकों की शिकायतों के त्वरित समाधान हेतु शिकायत निवारण अधिकारी की नियुक्ति की गई है:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 my-6 space-y-3 not-prose">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-red-700" />
              <span>शिकायत निवारण अधिकारी (Grievance Officer)</span>
            </h2>
            <p className="text-sm text-slate-700">
              <strong>पदनाम:</strong> नोडल ग्रीवेंस ऑफिसर, इंटरनेट की आवाज़<br />
              <strong>पता:</strong> Forvishganj, Pant Nagar, Gonda, Uttar Pradesh 271001 (फ़ोर्विशगंज, पंत नगर, गोंडा)<br />
              <strong>हेल्पलाइन / फोन:</strong> 07905895936 / +91 79058 95936<br />
              <strong>ईमेल:</strong> grievance@internetkiawaaz.in / editor@internetkiawaaz.in<br />
              <strong>समय:</strong> सोमवार से शनिवार (पूर्वाह्न 10:00 से अपराह्न 5:00 बजे तक)
            </p>
          </div>

          <h2>शिकायत दर्ज कराने की प्रक्रिया</h2>
          <ol>
            <li>शिकायतकर्ता को ईमेल में विवादित लेख/वीडियो का शीर्षक, यूआरएल (URL) और प्रकाशन की तिथि स्पष्ट रूप से लिखनी होगी।</li>
            <li>शिकायत का आधार (तथ्यात्मक त्रुटि, मानहानि, गोपनीयता उल्लंघन आदि) का स्पष्ट उल्लेख होना अनिवार्य है।</li>
            <li>नियमों के अनुसार हमारी टीम <strong>24 घंटे के भीतर</strong> शिकायत की प्राप्ति सूचना भेजेगी और <strong>15 दिनों के भीतर</strong> यथोचित निवारण सुनिश्चित करेगी।</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
