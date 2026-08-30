import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'वैधानिक घोषणा पत्र (Statutory Declaration) | इंटरनेट की आवाज़',
  description: 'इंटरनेट की आवाज़ — डिजिटल मीडिया स्वामित्व एवं संपादकीय घोषणा।',
};

export default function RniDeclarationPage() {
  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-4 border-b-2 border-red-700 pb-3">
          स्वामित्व एवं संपादकीय घोषणा (Editorial Declaration)
        </h1>

        <div className="prose max-w-none text-slate-800 leading-[1.9] space-y-4">
          <p>
            सूचना प्रौद्योगिकी (मध्यवर्ती संसथाओं के लिए दिशानिर्देश और डिजिटल मीडिया आचार संहिता) नियम, 2021 (Information Technology Rules 2021) के अनुपालन में यह घोषणा सार्वजनिक की जाती है:
          </p>

          <table className="w-full text-sm border-collapse my-6">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900 w-1/3">प्रकाशन का नाम</td>
                <td className="py-2.5 text-slate-700">इंटरनेट की आवाज़ (Internet Ki Awaaz)</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">प्रकाशन का स्वरूप</td>
                <td className="py-2.5 text-slate-700">डिजिटल न्यूज़ एवं करंट अफेयर्स पोर्टल</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">भाषा</td>
                <td className="py-2.5 text-slate-700">हिंदी (Devanagari Unicode UTF-8)</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">कार्यालय पता</td>
                <td className="py-2.5 text-slate-700">Forvishganj, Pant Nagar, Gonda, Uttar Pradesh 271001 (फ़ोर्विशगंज, पंत नगर, गोंडा)</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">संपर्क नंबर / हेल्पलाइन</td>
                <td className="py-2.5 text-slate-700">07905895936 / +91 79058 95936</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">आधिकारिक वेबसाइट</td>
                <td className="py-2.5 text-slate-700">http://www.internetkiawaaz.com/</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">प्रधान संपादक / प्रकाशक</td>
                <td className="py-2.5 text-slate-700">संपादकीय मंडल, इंटरनेट की आवाज़</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-2.5 font-bold text-slate-900">आधिकारिक ईमेल</td>
                <td className="py-2.5 text-slate-700">editor@internetkiawaaz.in</td>
              </tr>
            </tbody>
          </table>

          <p className="text-xs text-slate-500">
            * यह पोर्टल प्रेस काउंसिल ऑफ इंडिया और डिजिटल न्यूज़ पब्लिशर्स एसोसिएशन के तय नैतिक एवं पत्रकारिता मानकों का पूर्णतः पालन करता है।
          </p>
        </div>
      </div>
    </div>
  );
}
