import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { fetchChannelLatestUploads } from '@/lib/youtube/youtube-client';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedToken = `Bearer ${process.env.CRON_SECRET || 'super_secret_cron_token_for_youtube_sync'}`;

  if (authHeader !== expectedToken && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UC_default_gonda';

  try {
    const videos = await fetchChannelLatestUploads(channelId, 15);
    const supabase = await createAdminClient();

    let updatedCount = 0;
    let skippedCount = 0;

    for (const video of videos) {
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('youtube_video_id', video.videoId)
        .maybeSingle();

      if (existing) {
        skippedCount += 1;
        continue;
      }

      updatedCount += 1;
    }

    return NextResponse.json({
      success: true,
      fetched: videos.length,
      newCandidates: updatedCount,
      alreadyLinked: skippedCount,
      note: 'New videos surface in /admin/posts/create as import candidates; they are not auto-published.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
