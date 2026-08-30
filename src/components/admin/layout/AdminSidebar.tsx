'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tags,
  Zap,
  Users,
  Award,
  History,
  MessageSquare,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const ADMIN_NAV_LINKS = [
  { name: 'डैशबोर्ड', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'सभी समाचार व कतार', href: '/admin/posts', icon: FileText },
  { name: 'नया लेख लिखें', href: '/admin/posts/create', icon: PlusCircle },
  { name: 'श्रेणियां (Desks)', href: '/admin/categories', icon: FolderTree },
  { name: 'टैग्स (Tags)', href: '/admin/tags', icon: Tags },
  { name: 'ब्रेकिंग न्यूज़ कंट्रोल', href: '/admin/breaking-news', icon: Zap },
  { name: 'नागरिक संदेश व सुझाव', href: '/admin/inquiries', icon: MessageSquare },
  { name: 'उपयोगकर्ता एवं भूमिकाएं', href: '/admin/users', icon: Users },
  { name: 'मेरी प्रोफ़ाइल व आईडी कार्ड', href: '/admin/profile', icon: Award },
  { name: 'ऑडिट लॉग्स', href: '/admin/audit-logs', icon: History },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-slate-700 shrink-0">
            <Image
              src="/logo.png"
              alt="इंटरनेट की आवाज़"
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-tight leading-tight">
              <span className="text-red-600">इंटरनेट</span> की आवाज़
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Editorial CMS Studio
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
        {ADMIN_NAV_LINKS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-red-700 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            <span>लाइव वेबसाइट देखें</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
        >
          <LogOut size={14} />
          <span>लॉगआउट करें</span>
        </button>
      </div>
    </aside>
  );
}
