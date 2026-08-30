import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret');
  if (secret !== (process.env.REVALIDATE_SECRET || 'super_secret_revalidate_token') && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { path, tag } = body as { path?: string; tag?: string };

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag);

  if (!path && !tag) {
    return NextResponse.json({ error: 'Provide either path or tag' }, { status: 400 });
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
