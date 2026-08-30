import { createPublicServerClient } from '@/lib/supabase/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internetkiawaaz.in';

const STATIC_PATHS = [
  '',
  '/about',
  '/contact',
  '/video-desk',
  '/static/about',
  '/static/contact',
  '/static/rni-declaration',
  '/static/grievance-redressal',
  '/static/privacy-policy',
  '/static/terms-of-service',
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const supabase: any = await createPublicServerClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5000);

  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true);

  const urlEntries: string[] = [];

  for (const path of STATIC_PATHS) {
    urlEntries.push(
      `<url><loc>${escapeXml(SITE_URL + path)}</loc><changefreq>daily</changefreq><priority>0.6</priority></url>`
    );
  }

  for (const post of (posts as any[]) ?? []) {
    urlEntries.push(
      `<url><loc>${escapeXml(`${SITE_URL}/news/${post.slug}`)}</loc><lastmod>${post.updated_at}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>`
    );
  }

  for (const category of (categories as any[]) ?? []) {
    urlEntries.push(
      `<url><loc>${escapeXml(`${SITE_URL}/category/${category.slug}`)}</loc><lastmod>${category.updated_at}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
    },
  });
}
