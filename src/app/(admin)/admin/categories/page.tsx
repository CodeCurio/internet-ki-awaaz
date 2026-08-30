import { createClient, createAdminClient } from '@/lib/supabase/server';
import { CategoriesManagerClient } from './CategoriesManagerClient';
import type { CategoryRow } from '@/types/domain.types';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES: CategoryRow[] = [
  { id: 'cat-1', name_hi: 'सियासत', name_en: 'Politics', slug: 'siyasat', display_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description_hi: null, icon_name: null, parent_id: null, seo_title_hi: null, seo_description_hi: null },
  { id: 'cat-2', name_hi: 'गोंडा आंचल', name_en: 'Gonda Region', slug: 'gonda-aanchal', display_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description_hi: null, icon_name: null, parent_id: null, seo_title_hi: null, seo_description_hi: null },
  { id: 'cat-3', name_hi: 'इतिहास व विरासत', name_en: 'History & Heritage', slug: 'itihas-virasat', display_order: 3, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description_hi: null, icon_name: null, parent_id: null, seo_title_hi: null, seo_description_hi: null },
  { id: 'cat-4', name_hi: 'जन-आवाज़ / प्रेरणा', name_en: 'Public Voice', slug: 'jan-awaaz', display_order: 4, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description_hi: null, icon_name: null, parent_id: null, seo_title_hi: null, seo_description_hi: null },
  { id: 'cat-5', name_hi: 'साहित्य एवं मंच', name_en: 'Literature & Stage', slug: 'sahitya-manch', display_order: 5, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description_hi: null, icon_name: null, parent_id: null, seo_title_hi: null, seo_description_hi: null },
  { id: 'cat-6', name_hi: 'वीडियो डेस्क', name_en: 'Video Desk', slug: 'video-desk', display_order: 6, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), description_hi: null, icon_name: null, parent_id: null, seo_title_hi: null, seo_description_hi: null },
];

export default async function AdminCategoriesPage() {
  let supabase: any;
  try {
    supabase = await createAdminClient();
  } catch {
    supabase = await createClient();
  }

  let categories = DEFAULT_CATEGORIES;

  try {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (data && data.length > 0) {
      categories = data;
    }
  } catch {
    // Fallback
  }

  return <CategoriesManagerClient initialCategories={categories} />;
}
