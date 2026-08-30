'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TipTapEditor } from './TipTapEditor';
import { SerpPreview } from './SerpPreview';
import { YoutubeMetaFetcher } from './YoutubeMetaFetcher';
import { ImageUploader } from './ImageUploader';
import { TagSelector } from './TagSelector';
import { saveArticle, type ArticleFormInput } from '@/lib/actions/posts.actions';
import { slugifyText } from '@/lib/utils';
import {
  Save,
  Send,
  Eye,
  CheckCircle,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Flame,
  Star,
  Settings2,
  Globe,
  Tag,
  FolderTree,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import type { CategoryRow, TagRow } from '@/types/domain.types';

interface ArticleStudioProps {
  initialPost?: any;
  categories: CategoryRow[];
  tags: TagRow[];
}

export function ArticleStudio({ initialPost, categories, tags }: ArticleStudioProps) {
  const router = useRouter();

  // Form State
  const [categoriesList, setCategoriesList] = useState<CategoryRow[]>(categories);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [titleHi, setTitleHi] = useState(initialPost?.title_hi || '');
  const [titleEn, setTitleEn] = useState(initialPost?.title_en || '');
  const [subtitleHi, setSubtitleHi] = useState(initialPost?.subtitle_hi || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerptHi, setExcerptHi] = useState(initialPost?.excerpt_hi || '');
  const [bodyHi, setBodyHi] = useState<any>(initialPost?.body_hi || {});
  const [bodyHtmlCache, setBodyHtmlCache] = useState(initialPost?.body_html_cache || '');
  const [format, setFormat] = useState(initialPost?.format || 'standard_article');
  const [status, setStatus] = useState(initialPost?.status || 'draft');
  const [categoryId, setCategoryId] = useState(initialPost?.category_id || categories[0]?.id || '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  // Fetch live categories from database on mount or refresh
  const fetchLiveCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategoriesList(data.categories);
          if (!categoryId || !data.categories.some((c: any) => c.id === categoryId)) {
            setCategoryId(data.categories[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching live categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchLiveCategories();
  }, []);
  
  // Media & Video-First
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialPost?.featured_image_url || '');
  const [featuredImageAltHi, setFeaturedImageAltHi] = useState(initialPost?.featured_image_alt_hi || '');
  const [isVideoFirst, setIsVideoFirst] = useState(initialPost?.is_video_first || false);
  const [youtubeVideoId, setYoutubeVideoId] = useState(initialPost?.youtube_video_id || '');
  const [youtubeThumbnailUrl, setYoutubeThumbnailUrl] = useState(initialPost?.youtube_thumbnail_url || '');
  const [youtubeDurationSeconds, setYoutubeDurationSeconds] = useState(initialPost?.youtube_duration_seconds || 0);

  // Flags & SEO
  const [isBreaking, setIsBreaking] = useState(initialPost?.is_breaking || false);
  const [isFeatured, setIsFeatured] = useState(initialPost?.is_featured || false);
  const [seoTitleHi, setSeoTitleHi] = useState(initialPost?.seo_title_hi || '');
  const [seoDescriptionHi, setSeoDescriptionHi] = useState(initialPost?.seo_description_hi || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialPost?.canonical_url || '');
  const [jsonLdType, setJsonLdType] = useState(initialPost?.json_ld_type || 'NewsArticle');
  const [scheduledFor, setScheduledFor] = useState(initialPost?.scheduled_for || '');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-generate slug and SEO title if empty
  const handleTitleChange = (val: string) => {
    setTitleHi(val);
    if (!slug || slug === slugifyText(titleHi)) {
      setSlug(slugifyText(val));
    }
    if (!seoTitleHi) {
      setSeoTitleHi(val);
    }
  };

  const handleSave = async (targetStatus: 'draft' | 'in_review' | 'published' | 'scheduled') => {
    setSubmitting(true);
    setErrors({});
    setSuccessMsg(null);

    const payload: ArticleFormInput = {
      id: initialPost?.id,
      titleHi,
      titleEn,
      subtitleHi,
      excerptHi,
      bodyHi,
      bodyHtmlCache,
      format: isVideoFirst ? 'video_report' : format,
      status: targetStatus,
      categoryId,
      featuredImageUrl,
      featuredImageAltHi,
      youtubeVideoId,
      youtubeThumbnailUrl,
      youtubeDurationSeconds,
      isBreaking,
      isFeatured,
      isVideoFirst,
      seoTitleHi: seoTitleHi || titleHi,
      seoDescriptionHi: seoDescriptionHi || excerptHi,
      canonicalUrl,
      jsonLdType,
      tagIds: selectedTagIds,
      scheduledFor: targetStatus === 'scheduled' ? scheduledFor : undefined,
    };

    try {
      const res = await saveArticle(payload);
      if (res.success) {
        setSuccessMsg(
          targetStatus === 'published'
            ? 'लेख सफलतापूर्वक प्रकाशित किया गया!'
            : targetStatus === 'in_review'
            ? 'लेख समीक्षा हेतु सबमिट किया गया।'
            : 'ड्राफ्ट सफलतापूर्वक सहेजा गया।'
        );
        setTimeout(() => {
          router.push('/admin/posts');
        }, 1200);
      } else if (res.errors) {
        setErrors(res.errors);
      }
    } catch (err: any) {
      setErrors({ _root: err.message || 'त्रुटि हुई।' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {initialPost ? 'लेख संपादित करें' : 'नया समाचार / रिपोर्ट लिखें'}
          </h1>
          <p className="text-xs text-slate-500">
            देवनागरी यूनिकोड व एसईओ-अनुकूलित आर्टिकल स्टूडियो
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={submitting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            <span>ड्राफ्ट सहेजें</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('in_review')}
            disabled={submitting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <Send size={14} />
            <span>समीक्षा हेतु भेजें</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={submitting}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle size={14} />
            <span>अभी प्रकाशित करें</span>
          </button>
        </div>
      </div>

      {/* Status Alerts */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errors._root && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2 shadow-sm">
          <AlertCircle size={16} className="text-red-600" />
          <span>{errors._root}</span>
        </div>
      )}

      {/* Master 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (68% Width) - Editor Canvas */}
        <div className="lg:col-span-8 space-y-5">
          {/* Main Title (Hindi) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                समाचार शीर्षक (मुख्य हेडलाइन) *
              </label>
              <input
                type="text"
                value={titleHi}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="यहाँ मुख्य हेडलाइन दर्ज करें..."
                className="w-full text-lg sm:text-xl font-bold px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 leading-snug"
                required
              />
              {errors.titleHi && <p className="text-xs text-red-600 mt-1">{errors.titleHi}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                उप-शीर्षक (Subtitle / Kicker)
              </label>
              <input
                type="text"
                value={subtitleHi}
                onChange={(e) => setSubtitleHi(e.target.value)}
                placeholder="संक्षिप्त उप-शीर्षक या विवरण..."
                className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* TipTap Rich Text Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              समाचार का मुख्य विवरण (Article Body) *
            </label>
            <TipTapEditor
              initialContentJson={initialPost?.body_hi}
              initialContentHtml={initialPost?.body_html_cache}
              onChange={(json, html) => {
                setBodyHi(json);
                setBodyHtmlCache(html);
              }}
            />
          </div>

          {/* Excerpt / Summary */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              संक्षिप्त सारांश (Excerpt / Lead Summary)
            </label>
            <textarea
              rows={3}
              value={excerptHi}
              onChange={(e) => {
                setExcerptHi(e.target.value);
                if (!seoDescriptionHi) setSeoDescriptionHi(e.target.value);
              }}
              placeholder="1-2 वाक्यों में इस समाचार का मुख्य निष्कर्ष..."
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Right Column (32% Width) - Metadata Panels */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel 1: Classification & Category Desk */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Settings2 size={15} className="text-red-700" />
              <span>वर्गीकरण व डेस्क (Classification)</span>
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    संपादकीय श्रेणी (Category Desk) *
                  </label>
                  <button
                    type="button"
                    onClick={fetchLiveCategories}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                    title="श्रेणियां रिफ्रेश करें"
                  >
                    <RefreshCw size={11} className={loadingCategories ? 'animate-spin' : ''} />
                  </button>
                </div>
                <Link
                  href="/admin/categories"
                  target="_blank"
                  className="text-[10px] text-red-600 hover:text-red-800 font-bold flex items-center gap-0.5"
                  title="श्रेणी जोड़ें या संपादित करें"
                >
                  <span>+ श्रेणी प्रबंधित करें</span>
                  <ExternalLink size={10} />
                </Link>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_hi} ({cat.name_en})
                  </option>
                ))}
              </select>
            </div>

            {/* Breaking & Featured Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Flame size={14} className="text-red-600" />
                  <span>ताज़ा ख़बर (Breaking Alert) में दिखाएं</span>
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-amber-500" />
                  <span>होमपेज मुख्य फीचर्ड समाचार बनाएं</span>
                </span>
              </label>
            </div>
          </div>

          {/* Panel 2: Video-First Report Setup */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Video size={15} className="text-red-600" />
                <span>वीडियो रिपोर्ट (Video-First)</span>
              </span>
              <input
                type="checkbox"
                checked={isVideoFirst}
                onChange={(e) => {
                  setIsVideoFirst(e.target.checked);
                  if (e.target.checked) setJsonLdType('VideoObject');
                }}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
            </h3>

            {isVideoFirst && (
              <div className="space-y-3 pt-2">
                <YoutubeMetaFetcher
                  onVideoLoaded={(meta) => {
                    setYoutubeVideoId(meta.videoId);
                    setYoutubeThumbnailUrl(meta.thumbnailUrl);
                    setYoutubeDurationSeconds(meta.durationSeconds);
                    if (!featuredImageUrl) setFeaturedImageUrl(meta.thumbnailUrl);
                  }}
                />

                {youtubeThumbnailUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
                    <img src={youtubeThumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {Math.floor(youtubeDurationSeconds / 60)}:
                      {(youtubeDurationSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel 3: Featured Image & Thumbnail */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ImageIcon size={15} className="text-red-700" />
              <span>फीचर्ड छवि व थंबनेल (Cover Image & Thumbnail)</span>
            </h3>

            <ImageUploader
              label="मुख्य थंबनेल छवि (Featured Cover)"
              imageUrl={featuredImageUrl}
              altText={featuredImageAltHi}
              onImageChange={(url) => setFeaturedImageUrl(url)}
              onAltTextChange={(alt) => setFeaturedImageAltHi(alt)}
              error={errors.featuredImageAltHi}
            />
          </div>

          {/* Panel 4: Tags & Keywords Selector with In-Editor Creation */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Tag size={15} className="text-red-700" />
                <span>टैग्स व कीवर्ड्स (Tags & Keywords)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {selectedTagIds.length} चयनित
              </span>
            </h3>

            <TagSelector
              availableTags={tags}
              selectedTagIds={selectedTagIds}
              onChange={(newIds) => setSelectedTagIds(newIds)}
            />
          </div>

          {/* Panel 4: Live SERP Preview & SEO Parameters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Globe size={15} className="text-red-700" />
              <span>एसईओ व सोशल शेयर (SEO & SERP)</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                एसईओ शीर्षक (SEO Title) *
              </label>
              <input
                type="text"
                value={seoTitleHi}
                onChange={(e) => setSeoTitleHi(e.target.value)}
                placeholder="गूगल सर्च में दिखने वाला शीर्षक..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {errors.seoTitleHi && <p className="text-[11px] text-red-600 mt-1">{errors.seoTitleHi}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                मेटा विवरण (Meta Description) *
              </label>
              <textarea
                rows={2}
                value={seoDescriptionHi}
                onChange={(e) => setSeoDescriptionHi(e.target.value)}
                placeholder="सर्च इंजन के लिए 120-155 अक्षरों का विवरण..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 leading-relaxed"
              ></textarea>
              {errors.seoDescriptionHi && (
                <p className="text-[11px] text-red-600 mt-1">{errors.seoDescriptionHi}</p>
              )}
            </div>

            {/* Live SERP Preview */}
            <div className="pt-3 border-t border-slate-100">
              <SerpPreview
                seoTitleHi={seoTitleHi || titleHi}
                seoDescriptionHi={seoDescriptionHi || excerptHi}
                slug={slug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
