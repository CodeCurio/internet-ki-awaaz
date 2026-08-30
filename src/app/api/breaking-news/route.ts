import { NextRequest, NextResponse } from 'next/server';
import { getActiveBreakingNews, getAdminBreakingNews, publishBreakingNews } from '@/lib/actions/breaking-news.actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const isAdmin = request.nextUrl.searchParams.get('admin') === 'true';
    const items = isAdmin ? await getAdminBreakingNews() : await getActiveBreakingNews();
    return NextResponse.json({ items });
  } catch (err: any) {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await publishBreakingNews(body);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 400 });
    }
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
