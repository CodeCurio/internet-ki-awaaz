'use client';

import { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

interface DirectoryFilterBarProps {
  categories: string[];
  localities: string[];
  onFilterChange: (filters: { query: string; category: string; locality: string }) => void;
}

export function DirectoryFilterBar({ categories, localities, onFilterChange }: DirectoryFilterBarProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ query, category: selectedCategory, locality: selectedLocality });
  };

  const handleCategoryClick = (cat: string) => {
    const nextCat = selectedCategory === cat ? '' : cat;
    setSelectedCategory(nextCat);
    onFilterChange({ query, category: nextCat, locality: selectedLocality });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Keyword Search */}
        <div className="md:col-span-6 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="व्यवसाय का नाम या सेवा खोजें (उदा. अस्पताल, ऑटोमोबाइल)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
          />
        </div>

        {/* Locality Dropdown */}
        <div className="md:col-span-4 relative">
          <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={selectedLocality}
            onChange={(e) => {
              setSelectedLocality(e.target.value);
              onFilterChange({ query, category: selectedCategory, locality: e.target.value });
            }}
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 text-sm bg-white appearance-none"
          >
            <option value="">सभी इलाके / क्षेत्र (गोंडा व आसपास)</option>
            {localities.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Search Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
          >
            खोजें
          </button>
        </div>
      </form>

      {/* Quick Category Chips */}
      {categories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs text-slate-400 font-semibold shrink-0">श्रेणी:</span>
          <button
            type="button"
            onClick={() => handleCategoryClick('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-red-700 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            सभी
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-red-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
