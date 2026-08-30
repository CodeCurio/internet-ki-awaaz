'use client';

import { Bell, Shield, User } from 'lucide-react';
import Link from 'next/link';

export function AdminTopbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-xs font-semibold text-slate-700">
          संपादकीय डेस्क ऑनलाइन — गोंडा व पूर्वांचल
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts/create"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
        >
          <span>+ नई खबर लिखें</span>
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs border border-red-200">
            एडमिन
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">मुख्य संपादक</p>
            <p className="text-[10px] text-slate-500 mt-0.5">super_admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
