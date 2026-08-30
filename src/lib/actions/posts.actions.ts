'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { PostFormat, PostStatus, Json } from '@/types/database.types';

export interface ArticleFormInput {
  id?: string;
  titleHi: string;
  titleEn?: string;
  subtitleHi?: string;
  excerptHi?: string;
  bodyHi: Json;
  bodyHtmlCache: string;
  format: PostFormat;
  status: PostStatus;
  categoryId: string;
  featuredImageUrl?: string;
  featuredImageAltHi?: string;
  youtubeVideoId?: string;
  youtubeThumbnailUrl?: string;
  youtubeDurationSeconds?: number;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isVideoFirst?: boolean;
  seoTitleHi?: string;
  seoDescriptionHi?: string;
  canonicalUrl?: string;
  jsonLdType?: string;
  tagIds: string[];
  scheduledFor?: string;
}

export interface ActionResult {
  success: boolean;
  errors?: Record<string, string>;
  postId?: string;
}

function validateSeoFields(input: ArticleFormInput): Record<string, string> {
  const errors: Record<string, string> = {};

  const titleLen = Array.from(input.seoTitleHi ?? input.titleHi ?? '').length;
  if (titleLen === 0) {
    errors.seoTitleHi = 'एसईओ शीर्षक आवश्यक है।';
  } else if (titleLen > 65) {
    errors.seoTitleHi = 'एसईओ शीर्षक 65 अक्षरों से अधिक नहीं होना चाहिए।';
  }

  const descLen = Array.from(input.seoDescriptionHi ?? input.excerptHi ?? '').length;
  if (descLen === 0) {
    errors.seoDescriptionHi = 'मेटा विवरण आवश्यक है।';
  } else if (descLen > 160) {
    errors.seoDescriptionHi = 'मेटा विवरण 160 अक्षरों से अधिक नहीं होना चाहिए।';
  }

  if (!input.featuredImageAltHi && !input.isVideoFirst) {
    errors.featuredImageAltHi = 'फीचर्ड छवि के लिए Alt टेक्स्ट आवश्यक है।';
  }

  if (input.isVideoFirst && !input.youtubeVideoId) {
    errors.youtubeVideoId = 'वीडियो रिपोर्ट के लिए YouTube वीडियो आईडी आवश्यक है।';
  }

  if (input.status === 'scheduled' && !input.scheduledFor) {
    errors.scheduledFor = 'शेड्यूल की गई पोस्ट के लिए दिनांक/समय आवश्यक है।';
  }

  return errors;
}

function estimateReadingTimeMinutes(htmlContent: string): number {
  const plainText = htmlContent.replace(/<[^>]*>/g, ' ');
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  const WORDS_PER_MINUTE_HINDI = 180;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE_HINDI));
}

export async function saveArticle(input: ArticleFormInput): Promise<ActionResult> {
  const supabase: any = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isPublishIntent = input.status === 'published' || input.status === 'scheduled';
  const errors = isPublishIntent ? validateSeoFields(input) : {};

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const authorId = user?.id || '00000000-0000-0000-0000-000000000000';
  const readingTime = estimateReadingTimeMinutes(input.bodyHtmlCache || '');

  const payload: any = {
    title_hi: input.titleHi,
    title_en: input.titleEn ?? null,
    subtitle_hi: input.subtitleHi ?? null,
    excerpt_hi: input.excerptHi ?? null,
    body_hi: input.bodyHi,
    body_html_cache: input.bodyHtmlCache,
    format: input.format,
    status: input.status,
    category_id: input.categoryId,
    author_id: input.id ? undefined : authorId,
    featured_image_url: input.featuredImageUrl ?? null,
    featured_image_alt_hi: input.featuredImageAltHi ?? null,
    youtube_video_id: input.youtubeVideoId ?? null,
    youtube_thumbnail_url: input.youtubeThumbnailUrl ?? null,
    youtube_duration_seconds: input.youtubeDurationSeconds ?? null,
    is_breaking: input.isBreaking ?? false,
    is_featured: input.isFeatured ?? false,
    is_video_first: input.isVideoFirst ?? false,
    reading_time_minutes: readingTime,
    seo_title_hi: input.seoTitleHi ?? input.titleHi,
    seo_description_hi: input.seoDescriptionHi ?? input.excerptHi ?? null,
    canonical_url: input.canonicalUrl ?? null,
    json_ld_type: input.jsonLdType ?? 'NewsArticle',
    scheduled_for: input.scheduledFor ?? null,
    published_at: input.status === 'published' ? new Date().toISOString() : null,
  };

  let postId = input.id;

  if (postId) {
    const { error } = await supabase.from('posts').update(payload).eq('id', postId);
    if (error) {
      return { success: false, errors: { _root: error.message } };
    }
  } else {
    const { data, error } = await supabase.from('posts').insert(payload).select('id').single();
    if (error || !data) {
      return { success: false, errors: { _root: error?.message ?? 'पोस्ट सहेजने में त्रुटि हुई।' } };
    }
    postId = data.id;
  }

  if (input.tagIds && input.tagIds.length > 0 && postId) {
    await supabase.from('post_tags').delete().eq('post_id', postId);
    await supabase
      .from('post_tags')
      .insert(input.tagIds.map((tagId) => ({ post_id: postId!, tag_id: tagId })));
  }

  revalidatePath('/admin/posts');
  if (input.status === 'published') {
    revalidatePath('/');
    revalidateTag('posts');
  }

  return { success: true, postId };
}

export async function updateArticleStatus(postId: string, status: PostStatus): Promise<ActionResult> {
  const supabase: any = await createClient();

  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'published') {
    updateData.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from('posts').update(updateData).eq('id', postId);

  if (error) {
    return { success: false, errors: { _root: error.message } };
  }

  revalidatePath('/admin/posts');
  revalidatePath('/');
  revalidateTag('posts');

  return { success: true, postId };
}

export async function deleteArticle(postId: string): Promise<ActionResult> {
  const supabase: any = await createClient();
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) {
    return { success: false, errors: { _root: error.message } };
  }

  revalidatePath('/admin/posts');
  revalidatePath('/');
  revalidateTag('posts');

  return { success: true };
}

