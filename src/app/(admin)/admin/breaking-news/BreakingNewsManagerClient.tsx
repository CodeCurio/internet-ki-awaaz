'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Clock,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Send,
  ExternalLink,
  Flame,
  FileText,
  Timer,
  RefreshCw,
} from 'lucide-react';
import {
  publishBreakingNews,
  deleteBreakingNews,
  deactivateBreakingNews,
} from '@/lib/actions/breaking-news.actions';
import { createClient } from '@/lib/supabase/client';
import type { BreakingPriority } from '@/types/database.types';

interface BreakingNewsManagerClientProps {
  initialItems: any[];
  availablePosts: any[];
}

export function BreakingNewsManagerClient({
  initialItems,
  availablePosts,
}: BreakingNewsManagerClientProps) {
  const [items, setItems] = useState<any[]>(initialItems || []);
  const [selectedPostId, setSelectedPostId] = useState<string>('');
  const [headlineHi, setHeadlineHi] = useState('');
  const [priority, setPriority] = useState<BreakingPriority>('high');
  const [durationValue, setDurationValue] = useState<number>(6); // hours
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [now, setNow] = useState(Date.now());

  // Sync state whenever server re-renders initialItems
  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  // Fetch live active non-expired admin breaking news from API and subscribe to Realtime
  useEffect(() => {
    const fetchAdminBreaking = async () => {
      try {
        const res = await fetch('/api/breaking-news?admin=true');
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.items)) {
            setItems(data.items);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchAdminBreaking();

    try {
      const supabase = createClient();
      const channel = supabase
        .channel('admin-breaking-news-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'breaking_news' },
          () => {
            fetchAdminBreaking();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignored
    }
  }, []);

  // Update clock every minute for remaining time calculations
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // When user picks an article, prefill headline
  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId);
    if (!postId) return;
    const post = availablePosts.find((p) => p.id === postId);
    if (post) {
      setHeadlineHi(post.title_hi);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headlineHi.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await publishBreakingNews({
        headlineHi,
        linkedPostId: selectedPostId || undefined,
        priority,
        expiresInHours: durationValue,
      });

      if (res.success && res.item) {
        setHeadlineHi('');
        setSelectedPostId('');
        setFeedback({ msg: 'ताज़ा ख़बर टिकर पर सफलतापूर्वक लाइव कर दी गई है!', type: 'success' });
        const checkRes = await fetch('/api/breaking-news?admin=true');
        if (checkRes.ok) {
          const data = await checkRes.json();
          if (data && Array.isArray(data.items)) setItems(data.items);
        }
      } else {
        setFeedback({ msg: res.error || 'त्रुटि हुई', type: 'error' });
      }
    } catch (err: any) {
      setFeedback({ msg: err.message || 'त्रुटि हुई', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDelete = async (id: string, linkedPostId?: string) => {
    if (!confirm('क्या आप निश्चित रूप से इस ताज़ा ख़बर को हटाना चाहते हैं?')) return;

    setDeletingId(id);
    try {
      const res = await deleteBreakingNews(id, linkedPostId);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setFeedback({ msg: 'ताज़ा ख़बर टिकर से हटा दी गई।', type: 'success' });
        const checkRes = await fetch('/api/breaking-news?admin=true');
        if (checkRes.ok) {
          const data = await checkRes.json();
          if (data && Array.isArray(data.items)) setItems(data.items);
        }
      } else {
        alert(res.error || 'हटाने में विफल');
      }
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    } finally {
      setDeletingId(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const formatRemainingTime = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return 'समाप्त (Expired)';

    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} घंटे ${minutes} मिनट शेष`;
    }
    return `${minutes} मिनट शेष`;
  };

  return (
    <div className="space-y-6" lang="hi">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Zap className="text-red-700 fill-red-700" size={24} />
            <span>ब्रेकिंग न्यूज़ कंट्रोल रूम (Breaking News Engine)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            वेबसाइट के शीर्ष पर लाइव स्क्रॉल होने वाली ताज़ा खबरों का प्रकाशन करें। तय समय समाप्त होते ही यह स्वचालित रूप से हट जाएगी।
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in-50 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Grid: Left Compose Form, Right Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols) - Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handlePublish}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Flame className="text-red-600" size={18} />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                नई ताज़ा ख़बर जारी करें
              </h2>
            </div>

            {/* 1. Pick from Existing Post (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                किसी प्रकाशित लेख से जोड़ें (वैकल्पिक)
              </label>
              <select
                value={selectedPostId}
                onChange={(e) => handleSelectPost(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">-- स्वतंत्र कस्टम हेडलाइन दर्ज करें --</option>
                {availablePosts.map((p) => (
                  <option key={p.id} value={p.id}>
                    📰 {p.title_hi.slice(0, 55)}...
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ताज़ा ख़बर हेडलाइन (Hindi Headline) *
              </label>
              <textarea
                rows={3}
                value={headlineHi}
                onChange={(e) => setHeadlineHi(e.target.value)}
                placeholder="उदा. गोंडा: सरयू नदी के जलस्तर में वृद्धि, कर्नलगंज व तरबगंज में प्रशासन अलर्ट..."
                className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 leading-snug"
                required
              ></textarea>
            </div>

            {/* 3. Priority & Time Span */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  प्राथमिकता स्तर (Priority)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as BreakingPriority)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                >
                  <option value="critical">🔴 अति महत्वपूर्ण (Critical)</option>
                  <option value="high">🟠 उच्च (High Alert)</option>
                  <option value="medium">🟡 मध्यम (Medium)</option>
                  <option value="low">⚪ सामान्य (Low)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  सक्रिय रहने की अवधि (Time Span)
                </label>
                <select
                  value={durationValue}
                  onChange={(e) => setDurationValue(parseFloat(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                >
                  <option value={0.5}>30 मिनट</option>
                  <option value={1}>1 घंटा</option>
                  <option value={2}>2 घंटे</option>
                  <option value={4}>4 घंटे</option>
                  <option value={6}>6 घंटे (डिफ़ॉल्ट)</option>
                  <option value={12}>12 घंटे</option>
                  <option value={24}>24 घंटे</option>
                  <option value={48}>48 घंटे</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || !headlineHi.trim()}
              className="w-full py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={14} />
              )}
              <span>{submitting ? 'जारी किया जा रहा है...' : 'तुरंत टिकर पर लाइव करें'}</span>
            </button>
          </form>
        </div>

        {/* Right Column (7 Cols) - Active Live Alerts */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Zap size={16} className="text-red-700" />
              <span>वर्तमान में लाइव टिकर अलर्ट्स</span>
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{items.length} अलर्ट्स सक्रिय</span>
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isDeleting = deletingId === item.id;
              const isCritical = item.priority === 'critical';
              const remainingStr = formatRemainingTime(item.expires_at);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {item.is_fallback_latest ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-200 flex items-center gap-1">
                            <span>⚡ स्वतः प्रसारित (नवीनतम लेख)</span>
                          </span>
                        ) : (
                          <>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                                isCritical
                                  ? 'bg-red-700 text-white animate-pulse'
                                  : item.priority === 'high'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {isCritical ? 'अति महत्वपूर्ण' : item.priority}
                            </span>

                            <span className="text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1 border border-red-100">
                              <Timer size={12} />
                              <span>{remainingStr}</span>
                            </span>
                          </>
                        )}
                      </div>

                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {item.headline_hi}
                      </p>

                      {item.linked_post && (
                        <div className="flex items-center gap-1 text-[11px] text-blue-700 font-semibold pt-0.5">
                          <FileText size={12} />
                          <span>लिंक्ड आर्टिकल: </span>
                          <Link
                            href={`/news/${item.linked_post.slug}`}
                            target="_blank"
                            className="underline hover:text-blue-900 flex items-center gap-0.5"
                          >
                            <span>{item.linked_post.title_hi.slice(0, 45)}...</span>
                            <ExternalLink size={10} />
                          </Link>
                        </div>
                      )}
                    </div>

                    {!item.is_fallback_latest && (
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, item.linked_post_id)}
                        disabled={isDeleting}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer shrink-0"
                        title="हटाएं (Remove)"
                      >
                        {isDeleting ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Zap size={32} className="mx-auto text-slate-300" />
                <p className="text-xs font-semibold">
                  वर्तमान में कोई ताज़ा ख़बर टिकर पर सक्रिय नहीं है।
                </p>
                <p className="text-[11px] text-slate-400">
                  बाईं ओर दिए गए फॉर्म से नई हेडलाइन जारी करें या ब्लॉग सूची से किसी लेख को ब्रेकिंग बनाएं।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
