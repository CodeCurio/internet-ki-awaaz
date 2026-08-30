'use client';

import { useState, useTransition } from 'react';
import {
  MessageSquare,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  Trash2,
  ExternalLink,
  MessageCircle,
  Eye,
  X,
  Sparkles,
  Filter,
} from 'lucide-react';
import { updateSubmissionStatus, deleteSubmission } from '@/lib/actions/contact.actions';
import { useRouter } from 'next/navigation';

export interface SubmissionItem {
  id: string;
  reference_id: string;
  full_name: string;
  phone_number: string;
  email?: string | null;
  city?: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'in_review' | 'resolved';
  created_at: string;
}

interface Props {
  initialSubmissions: SubmissionItem[];
}

export function InquiriesManager({ initialSubmissions }: Props) {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<SubmissionItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = submissions.filter((item) => {
    const matchesSearch =
      item.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone_number.includes(searchQuery) ||
      item.reference_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const inReviewCount = submissions.filter((s) => s.status === 'in_review').length;
  const resolvedCount = submissions.filter((s) => s.status === 'resolved').length;

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'in_review' | 'resolved') => {
    startTransition(async () => {
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      if (activeModalItem && activeModalItem.id === id) {
        setActiveModalItem({ ...activeModalItem, status: newStatus });
      }
      await updateSubmissionStatus(id, newStatus);
      router.refresh();
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('क्या आप इस संदेश को हटाना चाहते हैं?')) return;
    startTransition(async () => {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (activeModalItem?.id === id) setActiveModalItem(null);
      await deleteSubmission(id);
      router.refresh();
    });
  };

  const cleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">कुल प्राप्त संदेश</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">लंबित (Pending)</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock3 size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">समीक्षाधीन (In Review)</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{inReviewCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">सुलझाया गया (Resolved)</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="नाम, मोबाइल, संदर्भ आईडी खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { key: 'all', label: 'सभी' },
            { key: 'pending', label: 'लंबित' },
            { key: 'in_review', label: 'समीक्षाधीन' },
            { key: 'resolved', label: 'सुलझाया' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                selectedStatus === tab.key
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <MessageSquare size={36} className="mx-auto text-slate-300" />
            <p className="font-semibold text-sm">कोई संदेश प्राप्त नहीं हुआ</p>
            <p className="text-xs text-slate-400">वेबसाइट पर संपर्क फॉर्म सबमिट होते ही यहाँ दिखाई देगा।</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">दिनांक व आईडी</th>
                  <th className="py-3 px-4">प्रेषक का नाम</th>
                  <th className="py-3 px-4">संपर्क व स्थान</th>
                  <th className="py-3 px-4">विषय व संदेश</th>
                  <th className="py-3 px-4">स्थिति</th>
                  <th className="py-3 px-4 text-right">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const rawPhone = cleanPhone(item.phone_number);
                  const formattedDate = new Date(item.created_at).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Date & ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-900 block">
                          {item.reference_id}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar size={11} />
                          <span>{formattedDate}</span>
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">{item.full_name}</span>
                        {item.email && (
                          <span className="text-[11px] text-slate-400">{item.email}</span>
                        )}
                      </td>

                      {/* Contact & City */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${rawPhone}`}
                            className="font-mono text-red-700 font-bold hover:underline flex items-center gap-1"
                          >
                            <Phone size={12} />
                            <span>{item.phone_number}</span>
                          </a>

                          <a
                            href={`https://wa.me/91${rawPhone}?text=${encodeURIComponent(
                              `नमस्ते ${item.full_name}, इंटरनेट की आवाज़ टीम की ओर से आपके संदेश (आईडी: ${item.reference_id}) के संबंध में:`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title="व्हाट्सएप पर उत्तर दें"
                          >
                            <MessageCircle size={13} />
                          </a>
                        </div>
                        {item.city && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-slate-400" />
                            <span>{item.city}</span>
                          </span>
                        )}
                      </td>

                      {/* Subject & Message Snippet */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">
                          {item.subject}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.message}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={item.status}
                          disabled={isPending}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none ${
                            item.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : item.status === 'in_review'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="pending">लंबित (Pending)</option>
                          <option value="in_review">समीक्षाधीन (In Review)</option>
                          <option value="resolved">सुलझाया (Resolved)</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveModalItem(item)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="पूरा विवरण देखें"
                        >
                          <Eye size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                          title="हटाएं"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  {activeModalItem.reference_id}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  नागरिक संदेश का विवरण
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block font-semibold">प्रेषक का नाम:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{activeModalItem.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">स्थान / शहर:</span>
                  <span className="font-bold text-slate-800">{activeModalItem.city || 'गोंडा'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">मोबाइल नंबर:</span>
                  <a href={`tel:${activeModalItem.phone_number}`} className="font-bold text-red-700 hover:underline">
                    {activeModalItem.phone_number}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">ईमेल:</span>
                  <span className="font-medium text-slate-800">{activeModalItem.email || 'उपलब्ध नहीं'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">विषय (Subject):</span>
                <span className="font-bold text-slate-900 text-sm bg-slate-100/80 px-3 py-1.5 rounded-xl block">
                  {activeModalItem.subject}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold mb-1">पूरा संदेश / जनसमस्या विवरण:</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {activeModalItem.message}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
              <a
                href={`https://wa.me/91${cleanPhone(activeModalItem.phone_number)}?text=${encodeURIComponent(
                  `नमस्ते ${activeModalItem.full_name}, इंटरनेट की आवाज़ संपादकीय टीम की ओर से आपके संदेश (संदर्भ: ${activeModalItem.reference_id}) पर प्रतिक्रिया:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-colors"
              >
                <MessageCircle size={14} />
                <span>व्हाट्सएप पर उत्तर दें</span>
              </a>

              <div className="flex items-center gap-2">
                <select
                  value={activeModalItem.status}
                  onChange={(e) => handleStatusChange(activeModalItem.id, e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:outline-none"
                >
                  <option value="pending">लंबित (Pending)</option>
                  <option value="in_review">समीक्षाधीन (In Review)</option>
                  <option value="resolved">सुलझाया (Resolved)</option>
                </select>

                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                >
                  बंद करें
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
