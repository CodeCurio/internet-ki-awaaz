'use server';

import { revalidatePath } from 'next/cache';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { slugifyText } from '@/lib/utils';
import type { TagRow } from '@/types/domain.types';

export interface CreateTagInput {
  nameHi: string;
  nameEn?: string;
  slug?: string;
}

export interface TagActionResult {
  success: boolean;
  tag?: TagRow;
  error?: string;
}

async function getSupabaseInstance(): Promise<any> {
  try {
    const admin = await createAdminClient();
    return admin;
  } catch {
    const client = await createClient();
    return client;
  }
}

export async function createTag(input: CreateTagInput): Promise<TagActionResult> {
  const nameHi = input.nameHi?.trim();
  if (!nameHi) {
    return { success: false, error: 'टैग का नाम आवश्यक है।' };
  }

  const slug = input.slug?.trim() || slugifyText(input.nameEn || nameHi);
  const nameEn = input.nameEn?.trim() || null;

  try {
    const supabase = await getSupabaseInstance();

    // 1. Check if tag already exists in Supabase
    const { data: existing } = await supabase
      .from('tags')
      .select('*')
      .or(`name_hi.eq.${nameHi},slug.eq.${slug}`)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return { success: true, tag: existing as TagRow };
    }

    // 2. Insert new tag into Supabase
    const { data: newTag, error: insertError } = await supabase
      .from('tags')
      .insert({
        name_hi: nameHi,
        name_en: nameEn,
        slug: slug || `tag-${Date.now()}`,
        usage_count: 0,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Supabase tag insert error:', insertError);

      // Try with user auth client if admin client had RLS issue
      const userClient: any = await createClient();
      const { data: userTag, error: userError } = await userClient
        .from('tags')
        .insert({
          name_hi: nameHi,
          name_en: nameEn,
          slug: slug || `tag-${Date.now()}`,
          usage_count: 0,
        })
        .select('*')
        .single();

      if (userError) {
        console.error('Supabase user tag insert error:', userError);
        return {
          success: false,
          error: `डेटाबेस त्रुटि: ${userError.message || insertError.message}`,
        };
      }

      revalidatePath('/admin/tags');
      revalidatePath('/admin/posts/create');
      return { success: true, tag: userTag as TagRow };
    }

    revalidatePath('/admin/tags');
    revalidatePath('/admin/posts/create');

    return { success: true, tag: newTag as TagRow };
  } catch (err: any) {
    console.error('createTag error:', err);
    return { success: false, error: err.message || 'टैग बनाने में त्रुटि हुई।' };
  }
}

export async function getTags(): Promise<TagRow[]> {
  try {
    const supabase = await getSupabaseInstance();
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (error || !data) {
      const userClient: any = await createClient();
      const { data: userTags } = await userClient
        .from('tags')
        .select('*')
        .order('usage_count', { ascending: false });
      return (userTags as TagRow[]) || [];
    }
    return data as TagRow[];
  } catch {
    return [];
  }
}

export async function updateTag(
  id: string,
  input: { nameHi: string; nameEn?: string; slug?: string }
): Promise<TagActionResult> {
  try {
    const supabase = await getSupabaseInstance();
    const { data, error } = await supabase
      .from('tags')
      .update({
        name_hi: input.nameHi.trim(),
        name_en: input.nameEn?.trim() || null,
        slug: input.slug?.trim() || slugifyText(input.nameEn || input.nameHi),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      const userClient: any = await createClient();
      const { data: uData, error: uError } = await userClient
        .from('tags')
        .update({
          name_hi: input.nameHi.trim(),
          name_en: input.nameEn?.trim() || null,
          slug: input.slug?.trim() || slugifyText(input.nameEn || input.nameHi),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (uError) return { success: false, error: uError.message };
      revalidatePath('/admin/tags');
      return { success: true, tag: uData as TagRow };
    }

    revalidatePath('/admin/tags');
    return { success: true, tag: data as TagRow };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteTag(id: string): Promise<TagActionResult> {
  try {
    const supabase = await getSupabaseInstance();
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) {
      const userClient: any = await createClient();
      const { error: uError } = await userClient.from('tags').delete().eq('id', id);
      if (uError) return { success: false, error: uError.message };
    }

    revalidatePath('/admin/tags');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
