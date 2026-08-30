import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { slugifyText } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let supabase: any;
    try {
      supabase = await createAdminClient();
    } catch {
      supabase = await createClient();
    }

    const { data: tags, error } = await supabase
      .from('tags')
      .select('*')
      .order('usage_count', { ascending: false });

    if (error) {
      console.warn('Tags fetch warning:', error.message);
      return NextResponse.json({ tags: [] });
    }

    return NextResponse.json({ tags: tags || [] });
  } catch (err: any) {
    console.error('Tags API GET error:', err);
    return NextResponse.json({ tags: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nameHi = body.nameHi?.trim();
    const nameEn = body.nameEn?.trim() || null;
    const slug = body.slug?.trim() || slugifyText(nameEn || nameHi);

    if (!nameHi) {
      return NextResponse.json({ error: 'टैग नाम आवश्यक है।' }, { status: 400 });
    }

    let supabase: any;
    try {
      supabase = await createAdminClient();
    } catch {
      supabase = await createClient();
    }

    // Check existing
    const { data: existing } = await supabase
      .from('tags')
      .select('*')
      .or(`name_hi.eq.${nameHi},slug.eq.${slug}`)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, tag: existing });
    }

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
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tag: newTag });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'त्रुटि हुई' }, { status: 500 });
  }
}
