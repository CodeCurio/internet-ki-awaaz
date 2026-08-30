import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf',
];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

const BUCKET_BY_CONTEXT: Record<string, string> = {
  'post-featured': 'post-media',
  'post-gallery': 'post-media',
  'article-inline': 'post-media',
  'directory-cover': 'directory-media',
  'ad-creative': 'ad-creatives',
  avatar: 'avatars',
  'staff-photo': 'avatars',
  'staff-aadhaar': 'post-media',
  'staff-pan': 'post-media',
  'staff-docs': 'post-media',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const context = (formData.get('context') as string | null) || 'post-featured';

    if (!file || !(context in BUCKET_BY_CONTEXT)) {
      return NextResponse.json({ error: 'अमान्य अपलोड अनुरोध' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'फ़ाइल प्रकार समर्थित नहीं है। (JPEG, PNG, WebP, AVIF केवल)' },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'फ़ाइल का आकार 10MB से अधिक नहीं होना चाहिए।' },
        { status: 413 }
      );
    }

    const bucket = BUCKET_BY_CONTEXT[context];
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${context}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${fileExt}`;

    let supabase;
    try {
      supabase = await createAdminClient();
    } catch {
      supabase = await createClient();
    }

    // Try uploading to Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.warn('Supabase storage upload note:', uploadError.message);
      // If bucket doesn't exist yet, try creating it or return graceful base64 response
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        path: filePath,
        note: uploadError.message,
      });
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ success: true, url: publicUrl, path: filePath });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'अपलोड विफल रहा' }, { status: 500 });
  }
}
