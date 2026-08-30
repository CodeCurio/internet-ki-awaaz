'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
    } catch {
      // Ignored for demo
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-red-700 selection:text-white" lang="hi">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            <span className="text-red-600">इंटरनेट</span> की आवाज़
          </h1>
        </Link>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-lg mb-6 pb-3 border-b border-slate-800">
          <ShieldCheck size={22} className="text-red-500" />
          <span>पासवर्ड रीसेट अनुरोध</span>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={40} className="text-emerald-500 mx-auto mb-3" />
            <h2 className="text-base font-bold text-white mb-2">रीसेट लिंक भेजा गया</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              यदि आपका ईमेल हमारे रिकॉर्ड में मौजूद है, तो हमने <strong>{email}</strong> पर पासवर्ड रीसेट करने का लिंक भेज दिया है।
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              लॉगिन पेज पर वापस जाएं
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              अपना पंजीकृत स्टाफ ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने के लिए एक सुरक्षित लिंक भेजेंगे।
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="email">
                ईमेल पता
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@internetkiawaaz.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>{loading ? 'भेजा जा रहा है...' : 'रीसेट लिंक भेजें'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link href="/login" className="text-xs text-slate-400 hover:text-white">
            ← लॉगिन पर लौटें
          </Link>
        </div>
      </div>
    </div>
  );
}
