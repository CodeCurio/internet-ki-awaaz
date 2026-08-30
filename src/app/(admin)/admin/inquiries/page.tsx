import { Metadata } from 'next';
import { getContactSubmissions } from '@/lib/actions/contact.actions';
import { InquiriesManager } from '@/components/admin/inquiries/InquiriesManager';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'नागरिक संदेश व शिकायतें | इंटरनेट की आवाज़ CMS',
};

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div className="space-y-6" lang="hi">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare size={24} className="text-red-700" />
            <span>नागरिक संदेश, सुझाव व हेल्पलाइन</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            वेबसाइट संपर्क फॉर्म एवं नागरिक हेल्पलाइन से प्राप्त समस्त समाचार सुझाव, जनसमस्याएं और प्रतिक्रियाएं।
          </p>
        </div>
      </div>

      {/* Main Table & Manager */}
      <InquiriesManager initialSubmissions={submissions as any[]} />
    </div>
  );
}
