'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories.actions';
import type { CategoryRow } from '@/types/domain.types';

interface CategoriesManagerClientProps {
  initialCategories: CategoryRow[];
}

export function CategoriesManagerClient({ initialCategories }: CategoriesManagerClientProps) {
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryRow | null>(null);

  // Form states
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [slug, setSlug] = useState('');
  const [descriptionHi, setDescriptionHi] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [userEditedHindi, setUserEditedHindi] = useState(false);
  const [userEditedSlug, setUserEditedSlug] = useState(false);

  const [translating, setTranslating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Fast and responsive auto-translate English to Hindi & slug
  useEffect(() => {
    const trimmed = nameEn.trim();
    if (!trimmed) {
      if (!userEditedHindi && !editingCat) setNameHi('');
      if (!userEditedSlug && !editingCat) setSlug('');
      return;
    }

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
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [nameEn]);

  const filteredCategories = categories.filter(
    (c) =>
      c.name_hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCat(null);
    setNameEn('');
    setNameHi('');
    setSlug('');
    setDescriptionHi('');
    setDisplayOrder((categories.length || 0) + 1);
    setIsActive(true);
    setUserEditedHindi(false);
    setUserEditedSlug(false);
    setMessage(null);
    setShowModal(true);
  };

  const handleOpenEdit = (cat: CategoryRow) => {
    setEditingCat(cat);
    setNameEn(cat.name_en);
    setNameHi(cat.name_hi);
    setSlug(cat.slug);
    setDescriptionHi(cat.description_hi || '');
    setDisplayOrder(cat.display_order);
    setIsActive(cat.is_active);
    setUserEditedHindi(true);
    setUserEditedSlug(true);
    setMessage(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameHi.trim()) return;

    setSubmitting(true);
    setMessage(null);

    try {
      if (editingCat) {
        const res = await updateCategory(editingCat.id, {
          nameHi,
          nameEn: nameEn || nameHi,
          slug,
          descriptionHi,
          displayOrder,
          isActive,
        });

        if (res.success && res.category) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCat.id ? res.category! : c))
          );
          setMessage({ text: 'श्रेणी सफलतापूर्वक अपडेट की गई!', type: 'success' });
          setTimeout(() => setShowModal(false), 700);
        } else {
          setMessage({ text: res.error || 'अपडेट विफल', type: 'error' });
        }
      } else {
        const res = await createCategory({
          nameHi,
          nameEn: nameEn || nameHi,
          slug,
          descriptionHi,
          displayOrder,
          isActive,
        });

        if (res.success && res.category) {
          setCategories((prev) => [...prev, res.category!]);
          setMessage({ text: 'नई श्रेणी सफलतापूर्वक जोड़ी गई!', type: 'success' });
          setTimeout(() => setShowModal(false), 700);
        } else {
          setMessage({ text: res.error || 'श्रेणी निर्माण विफल', type: 'error' });
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'त्रुटि हुई', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप निश्चित रूप से श्रेणी "${name}" को हटाना चाहते हैं?`)) return;

    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.error || 'श्रेणी हटाने में विफल');
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
            <FolderTree className="text-red-700" size={24} />
            <span>समाचार श्रेणियां व डेस्क (Categories Manager)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            मुख्य पोर्टल के नेविगेशन बार और संपादकीय डेस्क का प्रबंधन करें। अंग्रेज़ी में लिखने पर तुरंत हिंदी अनुवाद उपलब्ध होगा।
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>नई श्रेणी जोड़ें</span>
        </button>
      </div>

      {/* Search & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="श्रेणी नाम या स्लग खोजें..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          कुल श्रेणियां: <span className="text-red-700 font-bold">{categories.length}</span>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center">क्रम</th>
                <th className="py-3 px-4">श्रेणी नाम (हिंदी)</th>
                <th className="py-3 px-4">अंग्रेजी नाम</th>
                <th className="py-3 px-4">स्लग (Slug / URL)</th>
                <th className="py-3 px-4">विवरण (Description)</th>
                <th className="py-3 px-4 text-center">स्थिति</th>
                <th className="py-3 px-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500 text-center">
                    {cat.display_order}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                    {cat.name_hi}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-semibold">
                    {cat.name_en}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    /{cat.slug}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                    {cat.description_hi || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {cat.is_active ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        सक्रिय (Active)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                        निष्क्रिय
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                        title="संपादित करें"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name_hi)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    कोई श्रेणी नहीं मिली।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree size={18} className="text-red-700" />
                <span>{editingCat ? 'श्रेणी संपादित करें' : 'नई श्रेणी जोड़ें'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
              {/* 1. English Name */}
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
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g. Crime, Health, Education, Sports"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  autoFocus
                />
              </div>

              {/* 2. Hindi Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    श्रेणी का हिंदी नाम (Category Name Hindi) *
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
                  placeholder="उदा. अपराध, स्वास्थ्य, शिक्षा, खेल डेस्क"
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 font-bold bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              {/* 3. Slug */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL स्लग (Slug) *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setUserEditedSlug(true);
                  }}
                  placeholder="e.g. crime, health, sports"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 font-mono text-slate-600"
                  required
                />
              </div>

              {/* 4. Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  श्रेणी विवरण (Description)
                </label>
                <textarea
                  rows={2}
                  value={descriptionHi}
                  onChange={(e) => setDescriptionHi(e.target.value)}
                  placeholder="इस श्रेणी व डेस्क का संक्षिप्त विवरण..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                ></textarea>
              </div>

              {/* 5. Display Order & Status */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    प्रदर्शन क्रम (Display Order)
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    स्थिति (Active Status)
                  </label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-800">पोर्टल पर सक्रिय रखें</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
                  <span>{editingCat ? 'अपडेट करें' : 'सहेजें'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
