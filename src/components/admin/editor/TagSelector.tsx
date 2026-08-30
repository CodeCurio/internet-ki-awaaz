'use client';

import { useState, useEffect } from 'react';
import { Tag, Plus, X, Loader2, Hash, Sparkles, RefreshCw } from 'lucide-react';
import { createTag } from '@/lib/actions/tags.actions';
import type { TagRow } from '@/types/domain.types';

interface TagSelectorProps {
  availableTags: TagRow[];
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ availableTags, selectedTagIds, onChange }: TagSelectorProps) {
  const [tagsList, setTagsList] = useState<TagRow[]>(availableTags);
  const [inputValue, setInputValue] = useState('');
  const [creating, setCreating] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch latest tags from database on mount to guarantee 100% live synchronization
  const fetchLiveTags = async () => {
    setLoadingTags(true);
    try {
      const res = await fetch('/api/tags');
      if (res.ok) {
        const data = await res.json();
        if (data.tags && Array.isArray(data.tags)) {
          setTagsList(data.tags);
        }
      }
    } catch (err) {
      console.error('Error fetching live tags:', err);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    fetchLiveTags();
  }, []);

  const filteredTags = tagsList.filter(
    (t) =>
      !selectedTagIds.includes(t.id) &&
      (t.name_hi.toLowerCase().includes(inputValue.toLowerCase()) ||
        (t.name_en && t.name_en.toLowerCase().includes(inputValue.toLowerCase())))
  );

  const selectedTags = tagsList.filter((t) => selectedTagIds.includes(t.id));

  const handleSelectTag = (id: string) => {
    if (!selectedTagIds.includes(id)) {
      onChange([...selectedTagIds, id]);
    }
    setInputValue('');
  };

  const handleRemoveTag = (id: string) => {
    onChange(selectedTagIds.filter((tId) => tId !== id));
  };

  const handleCreateNewTag = async () => {
    const raw = inputValue.trim();
    if (!raw) return;

    setCreating(true);
    setErrorMsg(null);

    try {
      // 1. Check if raw is English; auto-translate if needed
      let nameHi = raw;
      let nameEn = raw;
      let slug = '';

      const isEnglish = /^[a-zA-Z0-9\s-_]+$/.test(raw);
      if (isEnglish) {
        try {
          const transRes = await fetch(`/api/translate?text=${encodeURIComponent(raw)}`);
          if (transRes.ok) {
            const transData = await transRes.json();
            if (transData.hindi) {
              nameHi = transData.hindi;
              nameEn = raw;
              slug = transData.slug || '';
            }
          }
        } catch {
          // Fallback to raw
        }
      }

      // Check if tag already exists in current list
      const existing = tagsList.find(
        (t) => t.name_hi.toLowerCase() === nameHi.toLowerCase()
      );
      if (existing) {
        handleSelectTag(existing.id);
        setInputValue('');
        setCreating(false);
        return;
      }

      // 2. Create in database
      const res = await createTag({ nameHi, nameEn, slug });
      if (res.success && res.tag) {
        const newTag = res.tag;
        setTagsList((prev) => {
          if (prev.some((t) => t.id === newTag.id)) return prev;
          return [newTag, ...prev];
        });
        handleSelectTag(newTag.id);
        setInputValue('');
      } else {
        setErrorMsg(res.error || 'टैग बनाने में विफल');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'त्रुटि हुई');
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTags.length === 1) {
        handleSelectTag(filteredTags[0].id);
      } else if (inputValue.trim()) {
        handleCreateNewTag();
      }
    }
  };

  return (
    <div className="space-y-3" lang="hi">
      {/* Selected Tags Chips */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold shadow-2xs group"
            >
              <Hash size={12} className="text-red-500" />
              <span>{tag.name_hi}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="text-red-400 hover:text-red-700 hover:bg-red-100 p-0.5 rounded-md transition-colors cursor-pointer"
                aria-label={`टैग ${tag.name_hi} हटाएं`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input & Quick Add */}
      <div className="relative">
        <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="टैग खोजें (उदा. Gonda, Crime, स्वास्थ्य) या नया बनाएं..."
          className="w-full text-xs pl-9 pr-20 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-white"
        />

        {inputValue.trim() && (
          <button
            type="button"
            onClick={handleCreateNewTag}
            disabled={creating}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md text-[11px] font-bold transition-colors flex items-center gap-1 disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {creating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Sparkles size={12} />
            )}
            <span>जोड़ें</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {errorMsg}
        </p>
      )}

      {/* Suggestions / Available Tags List */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {inputValue.trim() ? 'उपलब्ध टैग्स परिणाम:' : 'सुझाए गए टैग्स (चयन हेतु क्लिक करें):'}
          </span>
          <button
            type="button"
            onClick={fetchLiveTags}
            className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
            title="टैग्स रिफ्रेश करें"
          >
            <RefreshCw size={10} className={loadingTags ? 'animate-spin' : ''} />
            <span>रिफ्रेश</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
          {filteredTags.slice(0, 20).map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleSelectTag(tag.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-[11px] font-medium transition-colors border border-slate-200/80 cursor-pointer"
            >
              <Plus size={11} className="text-slate-400" />
              <span>{tag.name_hi}</span>
            </button>
          ))}

          {filteredTags.length === 0 && !inputValue.trim() && (
            <p className="text-[11px] text-slate-400 italic">
              कोई टैग उपलब्ध नहीं है। ऊपर नया टैग टाइप करें।
            </p>
          )}

          {inputValue.trim() && filteredTags.length === 0 && (
            <button
              type="button"
              onClick={handleCreateNewTag}
              disabled={creating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-red-600" />
              <span>"{inputValue}" जोड़ें (स्वतः हिंदी अनुवाद के साथ)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
