import { createClient, createAdminClient } from '@/lib/supabase/server';
import { TagsManagerClient } from './TagsManagerClient';

export const dynamic = 'force-dynamic';

const DEFAULT_TAGS = [
  { id: 'tag-1', name_hi: 'गोंडा', name_en: 'Gonda', slug: 'gonda', usage_count: 42, created_at: new Date().toISOString() },
  { id: 'tag-2', name_hi: 'कैसरगंज', name_en: 'Kaiserganj', slug: 'kaiserganj', usage_count: 28, created_at: new Date().toISOString() },
  { id: 'tag-3', name_hi: 'उत्तर प्रदेश', name_en: 'Uttar Pradesh', slug: 'uttar-pradesh', usage_count: 35, created_at: new Date().toISOString() },
  { id: 'tag-4', name_hi: 'स्वास्थ्य', name_en: 'Health', slug: 'health', usage_count: 19, created_at: new Date().toISOString() },
  { id: 'tag-5', name_hi: 'विकास', name_en: 'Development', slug: 'development', usage_count: 24, created_at: new Date().toISOString() },
  { id: 'tag-6', name_hi: 'सियासत', name_en: 'Politics', slug: 'siyasat', usage_count: 31, created_at: new Date().toISOString() },
  { id: 'tag-7', name_hi: 'बृजभूषण शरण सिंह', name_en: 'Brijbhushan Sharan Singh', slug: 'brijbhushan', usage_count: 15, created_at: new Date().toISOString() },
  { id: 'tag-8', name_hi: 'UGC', name_en: 'UGC', slug: 'ugc', usage_count: 12, created_at: new Date().toISOString() },
];

export default async function AdminTagsPage() {
  let supabase: any;
  try {
    supabase = await createAdminClient();
  } catch {
    supabase = await createClient();
  }

  let tags = DEFAULT_TAGS;

  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (data && data.length > 0) {
      tags = data;
    }
  } catch {
    // Fallback to default tags
  }

  return <TagsManagerClient initialTags={tags} />;
}
