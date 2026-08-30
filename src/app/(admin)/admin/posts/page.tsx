import { createClient, createAdminClient } from '@/lib/supabase/server';
import { PostsManagerTable, type PostRowItem } from './PostsManagerTable';

export const dynamic = 'force-dynamic';

const DEFAULT_MOCK_POSTS: PostRowItem[] = [
  {
    id: 'p1',
    title_hi: 'गोंडा में अत्याधुनिक सुपर स्पेशियलिटी मेडिकल विंग का भव्य शुभारंभ',
    status: 'published',
    category_name: 'गोंडा आंचल',
    author_name: 'राकेश त्रिपाठी',
    published_at: new Date().toISOString(),
    view_count: 5410,
    is_breaking: false,
    slug: 'gonda-medical-college-super-speciality-inauguration',
  },
  {
    id: 'p2',
    title_hi: 'कैसरगंज चीनी मिल ने बनाया पेराई का नया रिकॉर्ड, किसानों को भुगतान',
    status: 'published',
    category_name: 'सियासत',
    author_name: 'अमित कुमार सिंह',
    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    view_count: 3280,
    is_breaking: true,
    slug: 'kaiserganj-sugar-mill-crushing-season-record',
  },
  {
    id: 'p3',
    title_hi: 'राजा देवी बख्श सिंह: जब गोंडा की धरती पर ब्रिटिश हुकूमत के छूटे पसीने',
    status: 'published',
    category_name: 'इतिहास व विरासत',
    author_name: 'डॉ. सत्येंद्र मिश्र',
    published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    view_count: 2940,
    is_breaking: false,
    slug: 'raja-devi-bakhsh-singh-1857-revolution-gonda',
  },
  {
    id: 'p4',
    title_hi: 'तरबगंज तटबंध पर बाढ़ सुरक्षा कार्यों की ग्राउंड रिपोर्ट',
    status: 'in_review',
    category_name: 'जन-आवाज़',
    author_name: 'पवन वर्मा',
    published_at: null,
    view_count: 0,
    is_breaking: false,
    slug: 'tarabganj-flood-preparedness-report',
  },
  {
    id: 'p5',
    title_hi: 'गोंडा रेलवे जंक्शन अमृत भारत स्टेशन नवीनीकरण प्रगति रिपोर्ट',
    status: 'draft',
    category_name: 'गोंडा आंचल',
    author_name: 'सुनील यादव',
    published_at: null,
    view_count: 0,
    is_breaking: false,
    slug: 'gonda-junction-amrit-bharat-update',
  },
];

export default async function AdminPostsListPage() {
  let supabase: any;
  try {
    supabase = await createAdminClient();
  } catch {
    supabase = await createClient();
  }

  let posts: PostRowItem[] = DEFAULT_MOCK_POSTS;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        title_hi,
        slug,
        status,
        view_count,
        is_breaking,
        published_at,
        created_at,
        category:categories(name_hi),
        author:profiles!posts_author_id_fkey(full_name_hi, full_name)
      `)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      posts = data.map((d: any) => ({
        id: d.id,
        title_hi: d.title_hi,
        status: d.status || 'draft',
        category_name: d.category?.name_hi || 'सामान्य',
        author_name: d.author?.full_name_hi || d.author?.full_name || 'एडमिन',
        published_at: d.published_at,
        view_count: d.view_count || 0,
        is_breaking: d.is_breaking || false,
        slug: d.slug,
      }));
    }
  } catch (err) {
    console.error('Error fetching admin posts:', err);
  }

  return <PostsManagerTable initialPosts={posts} />;
}
