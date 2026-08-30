import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | इंटरनेट की आवाज़',
  description: 'इंटरनेट की आवाज़ की गोपनीयता नीति।',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-6" lang="hi">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mb-4 border-b-2 border-red-700 pb-3">
          गोपनीयता नीति (Privacy Policy)
        </h1>

        <div className="prose max-w-none text-slate-800 leading-[1.9] space-y-4">
          <p>
            इंटरनेट की आवाज़ (https://internetkiawaaz.in) पर आपके व्यक्तिगत डेटा और गोपनीयता का सम्मान करना हमारी सर्वोच्च प्राथमिकता है। यह नीति बताती है कि जब आप हमारी वेबसाइट और सेवाओं का उपयोग करते हैं तो हम आपकी जानकारी का किस प्रकार प्रबंधन करते हैं।
          </p>

          <h2>1. एकत्रित की जाने वाली जानकारी</h2>
          <p>
            हम अपने पाठकों से केवल वही जानकारी प्राप्त करते हैं जो सेवा प्रदान करने के लिए आवश्यक हो, जैसे संपर्क फॉर्म भरते समय आपका नाम, ईमेल अथवा डायरेक्टरी लिस्टिंग दर्ज कराते समय व्यावसायिक विवरण।
          </p>

          <h2>2. डेटा की सुरक्षा एवं उपयोग</h2>
          <p>
            हम आपका व्यक्तिगत डेटा किसी भी तीसरे पक्ष के साथ व्यावसायिक लाभ हेतु साझा या विक्रय नहीं करते हैं। एकत्रित डेटा का उपयोग केवल संपादकीय पत्राचार और पोर्टल की सुरक्षा व प्रदर्शन सुधार के लिए किया जाता है।
          </p>

          <h2>3. कुकीज़ (Cookies)</h2>
          <p>
            पोर्टल के तकनीकी प्रदर्शन और उपयोगकर्ताओं को बेहतर अनुभव प्रदान करने के लिए बुनियादी कुकीज़ का उपयोग किया जा सकता है।
          </p>
        </div>
      </div>
    </div>
  );
}
