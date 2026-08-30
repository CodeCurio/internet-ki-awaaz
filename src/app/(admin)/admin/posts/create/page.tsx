import { createClient, createAdminClient } from '@/lib/supabase/server';
import { ArticleStudio } from '@/components/admin/editor/ArticleStudio';
import type { CategoryRow, TagRow } from '@/types/domain.types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CreatePostPage() {
  let supabase: any;
  try {
    supabase = await createAdminClient();
  } catch {
    supabase = await createClient();
  }

  let categories: CategoryRow[] = [];
  let tags: TagRow[] = [];

  try {
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (catError) {
      const userClient = await createClient();
      const { data: uCat } = await userClient
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (uCat) categories = uCat as CategoryRow[];
    } else if (catData) {
      categories = catData as CategoryRow[];
    }

    const { data: tagData } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (tagData) tags = tagData as TagRow[];
  } catch (err) {
    console.error('Error loading categories/tags for create post:', err);
  }

  return (
    <ArticleStudio
      categories={categories}
      tags={tags}
    />
  );
}
