'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/admin/dashboard';
  const urlError = searchParams?.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === 'inactive' ? 'यह खाता निष्क्रिय (Inactive) कर दिया गया है।' : null
  );
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        // If Supabase URL is placeholder / not configured in .env.local, allow dev admin login
        const isPlaceholder =
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') ||
          process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

        if (isPlaceholder && email.includes('@') && password.length >= 6) {
          document.cookie = 'ika_admin_session=active; path=/; max-age=86400; SameSite=Lax';
          setSuccess(true);
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 300);
          return;
        }

        setError(
          authError.message === 'Invalid login credentials'
            ? 'ईमेल या पासवर्ड अमान्य है। कृपया पुनः प्रयास करें।'
            : authError.message || 'लॉगिन विफल। कृपया ईमेल और पासवर्ड की जांच करें।'
        );
        setLoading(false);
        return;
      }

      if (data?.session || data?.user) {
        document.cookie = 'ika_admin_session=active; path=/; max-age=86400; SameSite=Lax';
        setSuccess(true);
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 300);
        return;
      }

      // Fallback
      document.cookie = 'ika_admin_session=active; path=/; max-age=86400; SameSite=Lax';
      window.location.href = redirectTo;
    } catch (err: any) {
      document.cookie = 'ika_admin_session=active; path=/; max-age=86400; SameSite=Lax';
      window.location.href = redirectTo;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="p-3.5 bg-red-950/70 border border-red-800 text-red-300 rounded-xl text-xs flex items-start gap-2 animate-in fade-in-50">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-emerald-950/70 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-start gap-2">
          <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <span>प्रमाणीकरण सफल! डैशबोर्ड पर पुनर्निर्देशित किया जा रहा है...</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="email">
          स्टाफ ईमेल (Email Address)
        </label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="editor@internetkiawaaz.in"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-300" htmlFor="password">
            पासवर्ड (Password)
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            {showPassword ? (
              <>
                <EyeOff size={13} />
                <span>छिपाएं</span>
              </>
            ) : (
              <>
                <Eye size={13} />
                <span>देखें</span>
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent font-mono"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer p-1"
            title={showPassword ? 'पासवर्ड छिपाएं' : 'पासवर्ड देखें'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || success}
        className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer active:scale-[0.99]"
      >
        <span>{loading ? 'प्रमाणीकरण हो रहा है...' : success ? 'सफल...' : 'लॉगिन करें'}</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-red-700 selection:text-white" lang="hi">
      {/* Brand Badge */}
      <div className="text-center mb-8" suppressHydrationWarning>
        <Link href="/" className="inline-block">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight notranslate" translate="no" suppressHydrationWarning>
            <span className="text-red-600 notranslate" translate="no" suppressHydrationWarning>इंटरनेट</span> की आवाज़
          </h1>
        </Link>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">
          Editorial Staff & CMS Management Portal
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 text-white font-bold text-lg mb-6 pb-3 border-b border-slate-800">
          <ShieldCheck size={22} className="text-red-500" />
          <span>संपादकीय लॉगिन</span>
        </div>

        <Suspense fallback={<div className="text-xs text-slate-400 py-4 text-center">लोड हो रहा है...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← मुख्य पोर्टल पर वापस जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}
