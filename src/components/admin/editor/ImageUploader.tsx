'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, CheckCircle, Link2, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  imageUrl: string;
  altText: string;
  onImageChange: (url: string) => void;
  onAltTextChange?: (alt: string) => void;
  error?: string;
}

export function ImageUploader({
  label = 'फीचर्ड छवि व थंबनेल (Featured Image / Thumbnail)',
  imageUrl,
  altText,
  onImageChange,
  onAltTextChange,
  error,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('कृपया केवल मान्य छवि फ़ाइल (JPG, PNG, WebP, AVIF) चुनें।');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('फ़ाइल का आकार 10MB से कम होना चाहिए।');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('context', 'post-featured');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        // If Supabase storage bucket isn't created yet, convert to Base64 data URL so editor works seamlessly!
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            onImageChange(result);
            if (onAltTextChange && !altText) {
              onAltTextChange(file.name.replace(/\.[^/.]+$/, ''));
            }
          }
        };
        reader.readAsDataURL(file);
      } else if (data.url) {
        onImageChange(data.url);
        if (onAltTextChange && !altText) {
          onAltTextChange(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    } catch (err: any) {
      // Fallback to local Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onImageChange(result);
          if (onAltTextChange && !altText) {
            onAltTextChange(file.name.replace(/\.[^/.]+$/, ''));
          }
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3" lang="hi">
      {/* Header with Switch between Upload & URL */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          {label} *
        </label>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
              mode === 'upload' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            फ़ाइल अपलोड
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
              mode === 'url' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            छवि URL
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      {mode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          {!imageUrl ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? 'border-red-600 bg-red-50/60 ring-2 ring-red-100'
                  : 'border-slate-300 hover:border-red-500 bg-slate-50/50 hover:bg-red-50/20'
              }`}
            >
              {uploading ? (
                <div className="py-3 flex flex-col items-center gap-2 text-slate-600 text-xs">
                  <Loader2 size={28} className="animate-spin text-red-600" />
                  <span className="font-semibold">छवि अपलोड हो रही है...</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center shadow-xs">
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      छवि चुनें अथवा यहाँ ड्रैग करें
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      JPG, PNG, WebP, AVIF (अधिकतम 10MB)
                    </p>
                  </div>
                  <span className="mt-1 px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs">
                    कंप्यूटर से ब्राउज़ करें
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner group">
              <img
                src={imageUrl}
                alt={altText || 'Featured thumbnail'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>छवि बदलें</span>
                </button>
                <button
                  type="button"
                  onClick={() => onImageChange('')}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1 cursor-pointer"
                >
                  <X size={13} />
                  <span>हटाएं</span>
                </button>
              </div>
              <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur">
                थंबनेल 16:9
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Image URL Input */
        <div className="space-y-2">
          <div className="relative">
            <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => onImageChange(e.target.value)}
              placeholder="https://images.unsplash.com/... या अन्य वेब लिंक"
              className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 mt-2">
              <img src={imageUrl} alt={altText || 'Preview'} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onImageChange('')}
                className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-700 text-white rounded-full transition-colors"
                title="हटाएं"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Alt Text Input */}
      {onAltTextChange && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            छवि विवरण / Alt टेक्स्ट (Hindi Accessibility) *
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => onAltTextChange(e.target.value)}
            placeholder="छवि का सटीक हिंदी विवरण (उदा. गोंडा कलेक्ट्रेट पर प्रदर्शन)..."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {uploadError}
        </p>
      )}
    </div>
  );
}
