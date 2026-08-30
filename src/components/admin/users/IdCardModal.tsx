'use client';

import { X } from 'lucide-react';
import { PressIdCard } from './PressIdCard';
import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface IdCardModalProps {
  user: Partial<ProfileRow> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IdCardModal({ user, isOpen, onClose }: IdCardModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              प्रेस पहचान पत्र (Press ID Card Credentials)
            </h2>
            <p className="text-xs text-slate-500">
              {user.full_name_hi || user.full_name} • @{user.username}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Card Component */}
        <div className="p-6">
          <PressIdCard user={user} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
