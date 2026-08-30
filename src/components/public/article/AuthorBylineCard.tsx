import Link from 'next/link';
import { User, Shield } from 'lucide-react';

interface AuthorBylineCardProps {
  author?: {
    id?: string;
    full_name?: string;
    full_name_hi?: string | null;
    username: string;
    avatar_url?: string | null;
    designation_hi?: string | null;
    reporter_beat?: string | null;
  } | null;
}

export function AuthorBylineCard({ author }: AuthorBylineCardProps) {
  const name = author?.full_name_hi || author?.full_name || 'संपादकीय डेस्क';
  const designation = author?.designation_hi || 'वरिष्ठ संवाददाता';
  const beat = author?.reporter_beat ? ` • ${author.reporter_beat}` : '';

  return (
    <div className="flex items-center justify-between py-3 my-4 bg-slate-50 border border-slate-200 rounded-xl px-4">
      <div className="flex items-center gap-3">
        {author?.avatar_url ? (
          <img
            src={author.avatar_url}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-base border border-red-200">
            {name.charAt(0)}
          </div>
        )}

        <div>
          <Link
            href={author?.username ? `/author/${author.username}` : '#'}
            className="font-bold text-slate-900 hover:text-red-700 transition-colors text-sm block"
          >
            {name}
          </Link>
          <p className="text-xs text-slate-500">
            {designation}{beat}
          </p>
        </div>
      </div>

      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-700 px-2.5 py-1 rounded-full font-semibold border border-red-200">
        <Shield size={12} />
        सत्यापित रिपोर्टर
      </span>
    </div>
  );
}
