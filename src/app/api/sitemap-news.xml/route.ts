import { createClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internetkiawaaz.in';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase: any = await createClient();
  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, title_hi, published_at')
    .eq('status', 'published')
    .gte('published_at', fortyEightHoursAgo)
    .order('published_at', { ascending: false });

  const urlEntries = ((posts as any[]) ?? []).map(
    (post) => `<url>
  <loc>${escapeXml(`${SITE_URL}/news/${post.slug}`)}</loc>
  <news:news>
    <news:publication>
      <news:name>Internet Ki Awaaz</news:name>
      <news:language>hi</news:language>
    </news:publication>
    <news:publication_date>${post.published_at}</news:publication_date>
    <news:title>${escapeXml(post.title_hi)}</news:title>
  </news:news>
</url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
