import { createClient, createAdminClient } from '@/lib/supabase/server';
import { BreakingNewsManagerClient } from './BreakingNewsManagerClient';
import { getAdminBreakingNews } from '@/lib/actions/breaking-news.actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminBreakingNewsPage() {
  let supabase: any;
  try {
    supabase = await createAdminClient();
  } catch {
    supabase = await createClient();
  }

  let items: any[] = [];
  let availablePosts: any[] = [];

  try {
    items = await getAdminBreakingNews();

    const { data: posts } = await supabase
      .from('posts')
      .select('id, title_hi, slug')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(30);

    if (posts) availablePosts = posts;
  } catch (err) {
    console.error('AdminBreakingNewsPage error:', err);
  }

  return (
    <BreakingNewsManagerClient
      initialItems={items}
      availablePosts={availablePosts}
    />
  );
}
