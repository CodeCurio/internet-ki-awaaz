import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'नियम व शर्तें (Terms of Service) | इंटरनेट की आवाज़',
  description: 'इंटरनेट की आवाज़ पोर्टल के उपयोग की नियम व शर्तें।',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-4 border-b-2 border-red-700 pb-3">
          नियम एवं शर्तें (Terms of Service)
        </h1>

        <div className="prose max-w-none text-slate-800 leading-[1.9] space-y-4">
          <p>
            इंटरनेट की आवाज़ (https://internetkiawaaz.in) पर उपलब्ध सामग्री का उपयोग करने से पूर्व कृपया इन नियमों एवं शर्तों को ध्यानपूर्वक पढ़ें।
          </p>

          <h2>1. बौद्धिक संपदा अधिकार (Copyright)</h2>
          <p>
            इस पोर्टल पर प्रकाशित सभी समाचार, लेख, तस्वीरें, वीडियो और ऑडियो सामग्री इंटरनेट की आवाज़ की बौद्धिक संपदा हैं। बिना पूर्व लिखित अनुमति के किसी भी सामग्री का अनधिकृत पुनरुत्पादन या व्यावसायिक उपयोग प्रतिबंधित है।
          </p>

          <h2>2. सामग्री की सत्यता एवं दायित्व</h2>
          <p>
            हम अपने समाचारों और तथ्यों की पुष्टि के लिए हर संभव प्रयास करते हैं। राय और विचार स्तंभों में व्यक्त विचार संबंधित लेखकों के निजी विचार हैं।
          </p>

          <h2>3. क्षेत्राधिकार (Jurisdiction)</h2>
          <p>
            इस पोर्टल के उपयोग अथवा किसी भी विधिक विवाद की स्थिति में न्यायिक क्षेत्राधिकार केवल गोंडा (उत्तर प्रदेश) स्थित न्यायालय होगा।
          </p>
        </div>
      </div>
    </div>
  );
}
