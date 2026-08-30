'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient, createAdminClient, createPublicServerClient } from '@/lib/supabase/server';
import { slugifyText } from '@/lib/utils';
import type { CategoryRow } from '@/types/domain.types';

export interface CreateCategoryInput {
  nameHi: string;
  nameEn: string;
  slug?: string;
  descriptionHi?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CategoryActionResult {
  success: boolean;
  category?: CategoryRow;
  error?: string;
}

async function getSupabaseInstance() {
  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (serviceKey && serviceKey !== anonKey && !serviceKey.includes('placeholder')) {
      return await createAdminClient();
    }
  } catch {}
  return await createPublicServerClient();
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryActionResult> {
  const nameHi = input.nameHi?.trim();
  const nameEn = input.nameEn?.trim() || nameHi;

  if (!nameHi) {
    return { success: false, error: 'श्रेणी का हिंदी नाम आवश्यक है।' };
  }

  const slug = input.slug?.trim() || slugifyText(nameEn || nameHi);
  const displayOrder = input.displayOrder ?? 0;
  const descriptionHi = input.descriptionHi?.trim() || null;
  const isActive = input.isActive ?? true;

  try {
    const supabase: any = await getSupabaseInstance();

    // Check existing slug
    const { data: existing } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return { success: false, error: `इस स्लग (${slug}) के साथ श्रेणी पहले से मौजूद है।` };
    }

    const { data: newCat, error: insertError } = await supabase
      .from('categories')
      .insert({
        name_hi: nameHi,
        name_en: nameEn,
        slug,
        description_hi: descriptionHi,
        display_order: displayOrder,
        is_active: isActive,
      })
      .select('*')
      .single();

    if (insertError) {
      // Try with user auth client
      const userClient: any = await createClient();
      const { data: uCat, error: uErr } = await userClient
        .from('categories')
        .insert({
          name_hi: nameHi,
          name_en: nameEn,
          slug,
          description_hi: descriptionHi,
          display_order: displayOrder,
          is_active: isActive,
        })
        .select('*')
        .single();

      if (uErr) {
        return { success: false, error: uErr.message || insertError.message };
      }

      revalidatePath('/admin/categories');
      revalidatePath('/admin/posts/create');
      revalidatePath('/');
      return { success: true, category: uCat as CategoryRow };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/posts/create');
    revalidatePath('/');
    return { success: true, category: newCat as CategoryRow };
  } catch (err: any) {
    console.error('createCategory error:', err);
    return { success: false, error: err.message || 'श्रेणी बनाने में त्रुटि हुई।' };
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase: any = await createPublicServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error || !data) {
      return [];
    }
    return data as CategoryRow[];
  } catch {
    return [];
  }
}

export async function updateCategory(
  id: string,
  input: {
    nameHi: string;
    nameEn: string;
    slug?: string;
    descriptionHi?: string;
    displayOrder?: number;
    isActive?: boolean;
  }
): Promise<CategoryActionResult> {
  const nameHi = input.nameHi.trim();
  const nameEn = input.nameEn.trim() || nameHi;
  const slug = input.slug?.trim() || slugifyText(nameEn || nameHi);
  const descriptionHi = input.descriptionHi?.trim() || null;
  const displayOrder = input.displayOrder ?? 0;
  const isActive = input.isActive ?? true;

  try {
    const supabase: any = await getSupabaseInstance();
    const { data, error } = await supabase
      .from('categories')
      .update({
        name_hi: nameHi,
        name_en: nameEn,
        slug,
        description_hi: descriptionHi,
        display_order: displayOrder,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      const userClient: any = await createClient();
      const { data: uData, error: uErr } = await userClient
        .from('categories')
        .update({
          name_hi: nameHi,
          name_en: nameEn,
          slug,
          description_hi: descriptionHi,
          display_order: displayOrder,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .single();

      if (uErr) return { success: false, error: uErr.message };
      revalidatePath('/admin/categories');
      revalidatePath('/admin/posts/create');
      revalidatePath('/');
      return { success: true, category: uData as CategoryRow };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/posts/create');
    revalidatePath('/');
    return { success: true, category: data as CategoryRow };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteCategory(id: string): Promise<CategoryActionResult> {
  try {
    const supabase: any = await getSupabaseInstance();

    // Check if category has posts
    const { count } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (count && count > 0) {
      return {
        success: false,
        error: `इस श्रेणी के अंतर्गत ${count} लेख मौजूद हैं। पहले उन लेखों की श्रेणी बदलें, फिर इसे हटाएं।`,
      };
    }

    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      const userClient: any = await createClient();
      const { error: uErr } = await userClient.from('categories').delete().eq('id', id);
      if (uErr) return { success: false, error: uErr.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin/posts/create');
    revalidatePath('/');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
