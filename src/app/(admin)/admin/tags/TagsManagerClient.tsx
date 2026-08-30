'use client';

import { useState, useEffect, useRef } from 'react';
import { Tag, Plus, Search, Edit2, Trash2, Hash, AlertCircle, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { createTag, updateTag, deleteTag } from '@/lib/actions/tags.actions';
import type { TagRow } from '@/types/domain.types';

interface TagsManagerClientProps {
  initialTags: TagRow[];
}

export function TagsManagerClient({ initialTags }: TagsManagerClientProps) {
  const [tags, setTags] = useState<TagRow[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTag, setEditingTag] = useState<TagRow | null>(null);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [slug, setSlug] = useState('');
  const [userEditedHindi, setUserEditedHindi] = useState(false);
  const [userEditedSlug, setUserEditedSlug] = useState(false);

  const [translating, setTranslating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Responsive English to Hindi translation on fast/slow typing
  useEffect(() => {
    const trimmed = nameEn.trim();
    if (!trimmed) {
      if (!userEditedHindi && !editingTag) setNameHi('');
      if (!userEditedSlug && !editingTag) setSlug('');
      return;
    }

    // Cancel any previous pending translation request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setTranslating(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/translate?text=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          // Update Hindi if user hasn't typed custom Hindi text
          if (data.hindi && (!userEditedHindi || !nameHi)) {
            setNameHi(data.hindi);
          }
          if (data.slug && (!userEditedSlug || !slug)) {
            setSlug(data.slug);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Translation error:', err);
        }
      } finally {
        setTranslating(false);
      }
    }, 150); // Fast 150ms debounce with request cancellation

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [nameEn]);

  const filteredTags = tags.filter(
    (t) =>
      t.name_hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.name_en && t.name_en.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setNameEn('');
    setNameHi('');
    setSlug('');
    setUserEditedHindi(false);
    setUserEditedSlug(false);
    setMessage(null);
    setEditingTag(null);
    setShowCreateModal(true);
  };

  const handleOpenEdit = (tag: TagRow) => {
    setEditingTag(tag);
    setNameEn(tag.name_en || '');
    setNameHi(tag.name_hi);
    setSlug(tag.slug);
    setUserEditedHindi(true);
    setUserEditedSlug(true);
    setMessage(null);
    setShowCreateModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameHi.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      if (editingTag) {
        const res = await updateTag(editingTag.id, { nameHi, nameEn, slug });
        if (res.success && res.tag) {
          setTags((prev) => prev.map((t) => (t.id === editingTag.id ? res.tag! : t)));
          setMessage({ text: 'टैग सफलतापूर्वक अपडेट किया गया!', type: 'success' });
          setTimeout(() => setShowCreateModal(false), 700);
        } else {
          setMessage({ text: res.error || 'अपडेट विफल', type: 'error' });
        }
      } else {
        const res = await createTag({ nameHi, nameEn, slug });
        if (res.success && res.tag) {
          setTags((prev) => [res.tag!, ...prev.filter((t) => t.id !== res.tag!.id)]);
          setMessage({ text: 'नया टैग सफलतापूर्वक बनाया गया!', type: 'success' });
          setTimeout(() => setShowCreateModal(false), 700);
        } else {
          setMessage({ text: res.error || 'टैग निर्माण विफल', type: 'error' });
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'त्रुटि हुई', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप निश्चित रूप से टैग "${name}" को हटाना चाहते हैं?`)) return;

    try {
      const res = await deleteTag(id);
      if (res.success) {
        setTags((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert(res.error || 'टैग हटाने में विफल');
      }
    } catch (err: any) {
      alert(err.message || 'त्रुटि हुई');
    }
  };

  return (
    <div className="space-y-6" lang="hi">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Tag className="text-red-700" size={24} />
            <span>टैग्स व कीवर्ड्स प्रबंधन (Tags Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            समाचारों के वर्गीकरण हेतु टैग्स प्रबंधित करें। अंग्रेज़ी में टाइप करने पर तुरंत देवनागरी हिंदी में अनुवाद होगा।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>नया टैग जोड़ें</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="टैग नाम या स्लग खोजें..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          कुल टैग्स: <span className="text-red-700 font-bold">{tags.length}</span> | परिणाम: {filteredTags.length}
        </div>
      </div>

      {/* Tags Grid / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">टैग नाम (हिंदी)</th>
                <th className="py-3 px-4">अंग्रेजी नाम</th>
                <th className="py-3 px-4">URL स्लग (Slug)</th>
                <th className="py-3 px-4 text-center">उपयोग संख्या</th>
                <th className="py-3 px-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="p-1 rounded-md bg-red-50 text-red-700">
                      <Hash size={13} />
                    </span>
                    <span>{tag.name_hi}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {tag.name_en || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    #{tag.slug}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] border border-slate-200">
                      {tag.usage_count || 0} लेख
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(tag)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="संपादित करें"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(tag.id, tag.name_hi)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTags.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    कोई टैग नहीं मिला।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tag size={18} className="text-red-700" />
                <span>{editingTag ? 'टैग संपादित करें' : 'नया टैग बनाएं'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {message && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {/* 1. English Input with Fast Auto-Translate */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    अंग्रेजी नाम (English Name)
                  </label>
                  <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>फास्ट ऑटो-अनुवाद</span>
                  </span>
                </div>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value);
                  }}
                  placeholder="e.g. Gonda, Kaiserganj, Hospital, Election, Crime"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  autoFocus
                />
              </div>

              {/* 2. Hindi Translated Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    हिंदी नाम (Hindi Name) *
                  </label>
                  {translating && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 animate-pulse">
                      <Loader2 size={11} className="animate-spin text-red-600" />
                      <span>अनुवाद हो रहा है...</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={nameHi}
                  onChange={(e) => {
                    setNameHi(e.target.value);
                    setUserEditedHindi(true);
                  }}
                  placeholder="उदा. गोंडा, कैसरगंज, अस्पताल, चुनाव"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 font-bold bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              {/* 3. Slug */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL स्लग (Slug)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setUserEditedSlug(true);
                  }}
                  placeholder="e.g. gonda, kaiserganj"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono text-slate-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>{editingTag ? 'अपडेट करें' : 'सहेजें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
