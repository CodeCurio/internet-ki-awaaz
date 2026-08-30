'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  Flame,
  Clock,
  Search,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Loader2,
  ExternalLink,
  Zap,
  Timer,
  X,
} from 'lucide-react';
import { formatRelativeHindiTime } from '@/lib/utils';
import { updateArticleStatus, deleteArticle } from '@/lib/actions/posts.actions';
import { togglePostBreakingStatus } from '@/lib/actions/breaking-news.actions';
import type { PostStatus, BreakingPriority } from '@/types/database.types';

export interface PostRowItem {
  id: string;
  title_hi: string;
  status: string;
  category_name: string;
  author_name: string;
  published_at: string | null;
  view_count: number;
  is_breaking: boolean;
  slug: string;
}

interface PostsManagerTableProps {
  initialPosts: PostRowItem[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; iconBg: string }
> = {
  published: {
    label: 'प्रकाशित (Live)',
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-500',
  },
  in_review: {
    label: 'समीक्षाधीन (Review)',
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    iconBg: 'bg-amber-500',
  },
  draft: {
    label: 'ड्राफ्ट (Draft)',
    bg: 'bg-slate-100 hover:bg-slate-200',
    text: 'text-slate-700',
    border: 'border-slate-300',
    iconBg: 'bg-slate-400',
  },
  scheduled: {
    label: 'शेड्यूल (Scheduled)',
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    iconBg: 'bg-blue-500',
  },
  archived: {
    label: 'आर्काइव (Archived)',
    bg: 'bg-gray-100 hover:bg-gray-200',
    text: 'text-gray-700',
    border: 'border-gray-300',
    iconBg: 'bg-gray-400',
  },
};

export function PostsManagerTable({ initialPosts }: PostsManagerTableProps) {
  const [posts, setPosts] = useState<PostRowItem[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Floating Popover for Status
  const [popover, setPopover] = useState<{
    postId: string;
    top: number;
    left: number;
    currentStatus: string;
  } | null>(null);

  // Breaking News Modal State
  const [breakingModalPost, setBreakingModalPost] = useState<PostRowItem | null>(null);
  const [breakingHeadline, setBreakingHeadline] = useState('');
  const [breakingPriority, setBreakingPriority] = useState<BreakingPriority>('high');
  const [breakingDurationHours, setBreakingDurationHours] = useState<number>(6);
  const [submittingBreaking, setSubmittingBreaking] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Close popover on window resize or scroll
  useEffect(() => {
    const handleScrollOrResize = () => setPopover(null);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, []);

  // Filter posts by search and status
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title_hi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'breaking'
        ? post.is_breaking
        : post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenPopover = (e: React.MouseEvent<HTMLButtonElement>, post: PostRowItem) => {
    e.stopPropagation();
    if (popover?.postId === post.id) {
      setPopover(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setPopover({
      postId: post.id,
      top: rect.bottom + 6,
      left: Math.max(12, rect.left - 10),
      currentStatus: post.status,
    });
  };

  const handleStatusChange = async (postId: string, newStatus: PostStatus) => {
    setUpdatingId(postId);
    setPopover(null);
    setFeedback(null);

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              status: newStatus,
              published_at: newStatus === 'published' ? new Date().toISOString() : p.published_at,
            }
          : p
      )
    );

    try {
      const res = await updateArticleStatus(postId, newStatus);
      if (res.success) {
        setFeedback({
          msg: `स्थिति सफलतापूर्वक "${STATUS_CONFIG[newStatus]?.label || newStatus}" में बदली गई!`,
          type: 'success',
        });
      } else {
        setFeedback({ msg: res.errors?._root || 'स्थिति अपडेट विफल', type: 'error' });
      }
    } catch (err: any) {
      setFeedback({ msg: err.message || 'त्रुटि हुई', type: 'error' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Open Breaking Modal
  const handleOpenBreakingModal = (post: PostRowItem) => {
    setBreakingModalPost(post);
    setBreakingHeadline(post.title_hi);
    setBreakingPriority('high');
    setBreakingDurationHours(6);
    setModalError(null);
  };

  // Submit / Remove Breaking Status
  const handleToggleBreaking = async (enable: boolean) => {
    if (!breakingModalPost) return;

    setSubmittingBreaking(true);
    const postId = breakingModalPost.id;

    try {
      const res = await togglePostBreakingStatus(
        postId,
        enable,
        breakingHeadline,
        breakingPriority,
        breakingDurationHours
      );

      if (res.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, is_breaking: enable } : p))
        );
        setFeedback({
          msg: enable
            ? `लेख "${breakingHeadline.slice(0, 35)}..." को ${breakingDurationHours} घंटे हेतु ताज़ा ख़बर टिकर पर सक्रिय किया गया!`
            : 'लेख को ताज़ा ख़बर टिकर से हटा दिया गया।',
          type: 'success',
        });
        setBreakingModalPost(null);
      } else {
        setModalError(res.error || 'त्रुटि हुई। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setModalError(err.message || 'त्रुटि हुई। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmittingBreaking(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (!confirm(`क्या आप निश्चित रूप से इस समाचार को हटाना चाहते हैं?\n"${title}"`)) {
      return;
    }

    setUpdatingId(postId);
    try {
      const res = await deleteArticle(postId);
      if (res.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setFeedback({ msg: 'लेख सफलतापूर्वक हटा दिया गया।', type: 'success' });
      } else {
        setFeedback({ msg: res.errors?._root || 'हटाने में विफल।', type: 'error' });
      }
    } catch (err: any) {
      setFeedback({ msg: err.message || 'त्रुटि हुई।', type: 'error' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="space-y-6" lang="hi">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <span>समाचार व संपादकीय कतार</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            यहाँ से सीधे किसी भी लेख की स्थिति बदलें, या किसी भी लेख को निर्धारित समय के लिए ⚡ ताज़ा ख़बर (Breaking News) बनाएं।
          </p>
        </div>

        <Link
          href="/admin/posts/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors shrink-0 self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>नया लेख जोड़ें</span>
        </Link>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in-50 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Controls & Quick Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            सभी ({posts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('breaking')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              statusFilter === 'breaking'
                ? 'bg-red-600 text-white shadow-xs animate-pulse'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <Flame size={13} />
            <span>⚡ ब्रेकिंग अलर्ट ({posts.filter((p) => p.is_breaking).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'published'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            🟢 प्रकाशित ({posts.filter((p) => p.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('in_review')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'in_review'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            🟡 समीक्षाधीन ({posts.filter((p) => p.status === 'in_review').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              statusFilter === 'draft'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ⚪ ड्राफ्ट ({posts.filter((p) => p.status === 'draft').length})
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative w-full md:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="लेख या लेखक खोजें..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">शीर्षक व विवरण</th>
                <th className="py-3.5 px-3">श्रेणी</th>
                <th className="py-3.5 px-3">लेखक</th>
                <th className="py-3.5 px-3 min-w-[160px]">स्थिति (बदलने हेतु क्लिक करें)</th>
                <th className="py-3.5 px-3 text-center">दृश्य (Views)</th>
                <th className="py-3.5 px-4 text-right">त्वरित कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPosts.map((post) => {
                const isUpdating = updatingId === post.id;
                const isPopoverActive = popover?.postId === post.id;
                const currentStatusCfg = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;

                return (
                  <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Date */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-center gap-1.5 mb-1">
                        {post.is_breaking && (
                          <button
                            type="button"
                            onClick={() => handleOpenBreakingModal(post)}
                            className="flex items-center gap-0.5 text-[10px] font-extrabold text-red-700 bg-red-100 hover:bg-red-200 px-2 py-0.5 rounded-full border border-red-300 animate-pulse cursor-pointer"
                            title="ब्रेकिंग न्यूज़ सेटिंग्स प्रबंधित करें"
                          >
                            <Zap size={10} className="fill-red-700" />
                            <span>⚡ ब्रेकिंग लाइव</span>
                          </button>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {post.published_at
                            ? formatRelativeHindiTime(post.published_at)
                            : 'अप्रकाशित'}
                        </span>
                      </div>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-sm font-bold text-slate-900 hover:text-red-700 transition-colors line-clamp-1 leading-snug"
                      >
                        {post.title_hi}
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 font-semibold text-slate-700 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px]">
                        {post.category_name}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                      {post.author_name}
                    </td>

                    {/* CLICKABLE STATUS PILL BUTTON */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => handleOpenPopover(e, post)}
                        disabled={isUpdating}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          currentStatusCfg.bg
                        } ${currentStatusCfg.text} ${currentStatusCfg.border} hover:scale-105 active:scale-95 ${
                          isPopoverActive ? 'ring-2 ring-red-400' : ''
                        }`}
                        title="स्थिति बदलने हेतु क्लिक करें"
                      >
                        {isUpdating ? (
                          <Loader2 size={13} className="animate-spin text-slate-700" />
                        ) : (
                          <span className={`w-2 h-2 rounded-full ${currentStatusCfg.iconBg}`}></span>
                        )}
                        <span>{currentStatusCfg.label}</span>
                        <ChevronDown size={13} className="opacity-70 ml-0.5" />
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700 text-center whitespace-nowrap">
                      {post.view_count.toLocaleString('en-IN')}
                    </td>

                    {/* Quick Action Buttons: Breaking, View, Edit, Delete */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* ⚡ Toggle Breaking Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenBreakingModal(post)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            post.is_breaking
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                              : 'bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600'
                          }`}
                          title="इस लेख को ब्रेकिंग न्यूज़ बनाएं"
                        >
                          <Zap size={14} className={post.is_breaking ? 'fill-amber-600 text-amber-700' : ''} />
                          <span className="hidden sm:inline text-[10px]">
                            {post.is_breaking ? 'ब्रेकिंग सक्रिय' : 'ब्रेकिंग'}
                          </span>
                        </button>

                        {/* View Live */}
                        <Link
                          href={`/news/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          title="लाइव पोर्टल पर देखें"
                        >
                          <Eye size={14} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          title="आर्टिकल स्टूडियो में संपादित करें"
                        >
                          <Edit3 size={14} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id, post.title_hi)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                          title="हटाएं (Delete)"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    कोई लेख नहीं मिला।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOATING HIGH Z-INDEX STATUS POPOVER */}
      {popover && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setPopover(null)}
          />

          <div
            style={{
              position: 'fixed',
              top: `${popover.top}px`,
              left: `${popover.left}px`,
            }}
            className="z-[9999] w-56 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 space-y-1 animate-in fade-in-50 zoom-in-95 duration-100 ring-1 ring-black/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1 flex items-center justify-between">
              <span>नई स्थिति चुनें:</span>
              <span className="text-[9px] text-red-600 font-bold">1-Click Action</span>
            </div>

            <button
              type="button"
              onClick={() => handleStatusChange(popover.postId, 'published')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                popover.currentStatus === 'published'
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="flex-1">🟢 प्रकाशित करें (Publish Live)</span>
              {popover.currentStatus === 'published' && <CheckCircle size={13} className="text-emerald-700" />}
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange(popover.postId, 'in_review')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                popover.currentStatus === 'in_review'
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span className="flex-1">🟡 समीक्षाधीन (Send to Review)</span>
              {popover.currentStatus === 'in_review' && <CheckCircle size={13} className="text-amber-700" />}
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange(popover.postId, 'draft')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                popover.currentStatus === 'draft'
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
              <span className="flex-1">⚪ ड्राफ्ट बनाएं (Convert to Draft)</span>
              {popover.currentStatus === 'draft' && <CheckCircle size={13} className="text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={() => handleStatusChange(popover.postId, 'archived')}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                popover.currentStatus === 'archived'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 shrink-0"></span>
              <span className="flex-1">🔘 आर्काइव करें (Archive)</span>
              {popover.currentStatus === 'archived' && <CheckCircle size={13} className="text-gray-700" />}
            </button>
          </div>
        </>
      )}

      {/* QUICK BREAKING NEWS MODAL FOR ARTICLE */}
      {breakingModalPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-in fade-in-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap size={20} className="text-red-700 fill-red-700 animate-bounce" />
                <span>ब्रेकिंग न्यूज़ टिकर अलर्ट कॉन्फ़िगरेशन</span>
              </h3>
              <button
                type="button"
                onClick={() => setBreakingModalPost(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              {/* Article Headline Preview / Edit */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  टिकर हेडलाइन (Headline on Top Bar) *
                </label>
                <textarea
                  rows={2}
                  value={breakingHeadline}
                  onChange={(e) => setBreakingHeadline(e.target.value)}
                  className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-600 leading-snug"
                  required
                ></textarea>
              </div>

              {/* Priority & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    प्राथमिकता (Priority)
                  </label>
                  <select
                    value={breakingPriority}
                    onChange={(e) => setBreakingPriority(e.target.value as BreakingPriority)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                  >
                    <option value="critical">🔴 अति महत्वपूर्ण (Critical)</option>
                    <option value="high">🟠 उच्च (High Alert)</option>
                    <option value="medium">🟡 मध्यम (Medium)</option>
                    <option value="low">⚪ सामान्य (Low)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    सक्रिय रहने की अवधि (Time Span)
                  </label>
                  <select
                    value={breakingDurationHours}
                    onChange={(e) => setBreakingDurationHours(parseFloat(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
                  >
                    <option value={0.5}>30 मिनट</option>
                    <option value={1}>1 घंटा</option>
                    <option value={2}>2 घंटे</option>
                    <option value={4}>4 घंटे</option>
                    <option value={6}>6 घंटे (डिफ़ॉल्ट)</option>
                    <option value={12}>12 घंटे</option>
                    <option value={24}>24 घंटे</option>
                    <option value={48}>48 घंटे</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                <span className="font-bold">⚡ ऑटो-एक्सपायरी: </span>
                चुना गया समय ({breakingDurationHours} घंटे) समाप्त होते ही यह हेडलाइन स्वचालित रूप से डेटाबेस और वेबसाइट के टिकर से हट जाएगी।
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                {breakingModalPost.is_breaking ? (
                  <button
                    type="button"
                    onClick={() => handleToggleBreaking(false)}
                    disabled={submittingBreaking}
                    className="px-3.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>टिकर से हटाएं</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBreakingModalPost(null)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleBreaking(true)}
                    disabled={submittingBreaking || !breakingHeadline.trim()}
                    className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {submittingBreaking ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Zap size={14} className="fill-white" />
                    )}
                    <span>लागू करें (Activate Live)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
