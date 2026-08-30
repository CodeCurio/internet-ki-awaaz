import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { slugifyText } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeAll = searchParams.get('all') === 'true';

  try {
    let supabase: any;
    try {
      supabase = await createAdminClient();
    } catch {
      supabase = await createClient();
    }

    let query = supabase.from('categories').select('*').order('display_order', { ascending: true });

    if (!includeAll) {
      query = query.eq('is_active', true);
    }

    const { data: categories, error } = await query;

    if (error) {
      const userClient: any = await createClient();
      let uQuery = userClient.from('categories').select('*').order('display_order', { ascending: true });
      if (!includeAll) uQuery = uQuery.eq('is_active', true);
      const { data: uCats } = await uQuery;
      return NextResponse.json({ categories: uCats || [] });
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (err: any) {
    console.error('Categories API GET error:', err);
    return NextResponse.json({ categories: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const nameHi = body.nameHi?.trim();
    const nameEn = body.nameEn?.trim() || nameHi;
    const slug = body.slug?.trim() || slugifyText(nameEn || nameHi);
    const descriptionHi = body.descriptionHi?.trim() || null;
    const displayOrder = body.displayOrder ?? 0;
    const isActive = body.isActive ?? true;

    if (!nameHi) {
      return NextResponse.json({ error: 'श्रेणी का हिंदी नाम आवश्यक है।' }, { status: 400 });
    }

    let supabase: any;
    try {
      supabase = await createAdminClient();
    } catch {
      supabase = await createClient();
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

      if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });
      return NextResponse.json({ success: true, category: uCat });
    }

    return NextResponse.json({ success: true, category: newCat });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'त्रुटि हुई' }, { status: 500 });
  }
}
