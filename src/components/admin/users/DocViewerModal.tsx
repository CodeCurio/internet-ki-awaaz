'use client';

import { X, Download, ExternalLink, FileText, CreditCard } from 'lucide-react';

interface DocViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  docUrl?: string | null;
  userName?: string;
  docType: 'aadhaar' | 'pan' | 'document';
}

export function DocViewerModal({
  isOpen,
  onClose,
  title,
  docUrl,
  userName,
  docType,
}: DocViewerModalProps) {
  if (!isOpen || !docUrl) return null;

  const isPdf = docUrl.toLowerCase().includes('.pdf') || docUrl.startsWith('data:application/pdf');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-700/80 flex items-center justify-center text-white">
              {docType === 'aadhaar' ? <CreditCard size={18} /> : <FileText size={18} />}
            </div>
            <div>
              <h3 className="font-bold text-sm">{title}</h3>
              <p className="text-[11px] text-slate-400">कर्मचारी: {userName || 'स्टाफ'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Download size={13} />
              <span>डाउनलोड</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="p-6 bg-slate-100 flex-1 overflow-auto flex items-center justify-center min-h-[350px]">
          {isPdf ? (
            <iframe
              src={docUrl}
              title={title}
              className="w-full h-[500px] rounded-xl border border-slate-300 bg-white"
            />
          ) : (
            <div className="relative max-w-full max-h-[500px] overflow-hidden rounded-2xl border-2 border-slate-300 shadow-md bg-white p-2 flex items-center justify-center">
              <img
                src={docUrl}
                alt={title}
                className="max-w-full max-h-[480px] object-contain rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
