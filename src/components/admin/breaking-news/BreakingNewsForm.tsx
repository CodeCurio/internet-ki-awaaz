'use client';

import { useState } from 'react';
import { publishBreakingNews } from '@/lib/actions/breaking-news.actions';
import { Zap, Send, CheckCircle, AlertCircle } from 'lucide-react';
import type { BreakingPriority } from '@/types/database.types';

export function BreakingNewsForm() {
  const [headlineHi, setHeadlineHi] = useState('');
  const [priority, setPriority] = useState<BreakingPriority>('medium');
  const [expiresInHours, setExpiresInHours] = useState(6);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    const res = await publishBreakingNews({
      headlineHi,
      priority,
      expiresInHours,
    });

    if (res.success) {
      setMsg({ type: 'success', text: 'ताज़ा ख़बर टिकर पर सफलतापूर्वक लाइव कर दी गई है!' });
      setHeadlineHi('');
    } else {
      setMsg({ type: 'error', text: res.error || 'त्रुटि हुई।' });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Zap className="text-red-600" size={18} />
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          नई ताज़ा ख़बर जारी करें (Flash Breaking News)
        </h2>
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          <span>{msg.text}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          हेडलाइन (Hindi Headline) *
        </label>
        <input
          type="text"
          value={headlineHi}
          onChange={(e) => setHeadlineHi(e.target.value)}
          placeholder="उदा. गोंडा: सरयू नदी के जलस्तर में वृद्धि, कर्नलगंज में अलर्ट जारी..."
          className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            प्राथमिकता स्तर (Priority / Urgency)
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as BreakingPriority)}
            className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="low">सामान्य (Low)</option>
            <option value="medium">मध्यम (Medium)</option>
            <option value="high">उच्च (High Alert)</option>
            <option value="critical">अति महत्वपूर्ण (Critical Flash)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            सक्रिय रहने की अवधि (Hours Active)
          </label>
          <select
            value={expiresInHours}
            onChange={(e) => setExpiresInHours(parseInt(e.target.value, 10))}
            className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value={2}>2 घंटे</option>
            <option value={6}>6 घंटे (डिफ़ॉल्ट)</option>
            <option value={12}>12 घंटे</option>
            <option value={24}>24 घंटे</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !headlineHi.trim()}
        className="w-full py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        <Send size={14} />
        <span>{submitting ? 'जारी किया जा रहा है...' : 'तुरंत टिकर पर लाइव करें'}</span>
      </button>
    </form>
  );
}
