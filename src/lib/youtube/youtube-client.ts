const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YoutubeVideoMeta {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  durationSeconds: number;
  viewCount: number;
}

function parseIso8601Duration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? '0', 10);
  const minutes = parseInt(match[2] ?? '0', 10);
  const seconds = parseInt(match[3] ?? '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
}

export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function fetchYoutubeVideoMeta(videoId: string): Promise<YoutubeVideoMeta | null> {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey || apiKey.startsWith('dummy_')) {
    // Graceful fallback for local development or demo without active key
    return {
      videoId,
      title: 'इंटरनेट की आवाज़ विशेष रिपोर्ट',
      description: 'ग्राउंड रिपोर्ट और विशेष कवरेज',
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      publishedAt: new Date().toISOString(),
      durationSeconds: 420,
      viewCount: 12500,
    };
  }

  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const item = data.items?.[0];
  if (!item) return null;

  return {
    videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl:
      item.snippet.thumbnails?.maxres?.url ??
      item.snippet.thumbnails?.high?.url ??
      item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
    durationSeconds: parseIso8601Duration(item.contentDetails.duration),
    viewCount: parseInt(item.statistics?.viewCount ?? '0', 10),
  };
}

export async function fetchChannelLatestUploads(
  channelId: string,
  maxResults = 10
): Promise<YoutubeVideoMeta[]> {
  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey || apiKey.startsWith('dummy_')) {
    return [];
  }

  const searchUrl = `${YOUTUBE_API_BASE}/search?part=id&channelId=${channelId}&order=date&maxResults=${maxResults}&type=video&key=${apiKey}`;
  const searchResponse = await fetch(searchUrl, { next: { revalidate: 900 } });

  if (!searchResponse.ok) return [];

  const searchData = await searchResponse.json();
  const videoIds: string[] = searchData.items
    ?.map((item: { id: { videoId: string } }) => item.id.videoId)
    .filter(Boolean) ?? [];

  if (videoIds.length === 0) return [];

  const results = await Promise.all(videoIds.map((id) => fetchYoutubeVideoMeta(id)));
  return results.filter((result): result is YoutubeVideoMeta => result !== null);
}
