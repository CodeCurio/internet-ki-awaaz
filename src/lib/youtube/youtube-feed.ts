/**
 * Real-time YouTube Auto-Fetcher for Internet Ki Awaaz (@InternetKiAwaaz)
 * Fetches latest 5-8 videos automatically from YouTube RSS Feed / API with caching.
 */

export interface YouTubeVideoItem {
  id: string;
  youtubeId: string;
  titleHi: string;
  duration?: string;
  views?: string;
  time?: string;
  thumbnail: string;
  publishedAt?: string;
}

export const FALLBACK_LATEST_VIDEOS: YouTubeVideoItem[] = [
  {
    id: 'Kk-itjV99aI',
    youtubeId: 'Kk-itjV99aI',
    titleHi: 'भाजपा विधायक पलटूराम का बिजली विभाग के जेई को गाली देने का ऑडियो वायरल | मुंह में पेशाब कर देता हूं.',
    duration: '06:24',
    views: '8.7K+ दृश्य',
    time: 'विशेष रिपोर्ट',
    thumbnail: 'https://i.ytimg.com/vi/Kk-itjV99aI/hqdefault.jpg',
  },
  {
    id: 'AVwRPFL4684',
    youtubeId: 'AVwRPFL4684',
    titleHi: 'थारू समाज के साथ होली के रंग में रंगे पूर्व सांसद बृजभूषण शरण सिंह का डांस करते हुए वीडियो वायरल',
    duration: '02:00',
    views: '5.8K+ दृश्य',
    time: 'वायरल वीडियो',
    thumbnail: 'https://i.ytimg.com/vi/AVwRPFL4684/hqdefault.jpg',
  },
  {
    id: 'ZptDGDqBJeE',
    youtubeId: 'ZptDGDqBJeE',
    titleHi: 'गोंडा में हाईकोर्ट अधिवक्ता हत्याकांड पर अबतक क्या क्या हुआ, भाजपा विधायक का क्यों हो रहा विरोध',
    duration: '06:57',
    views: '12K+ दृश्य',
    time: 'खोजी पड़ताल',
    thumbnail: 'https://i.ytimg.com/vi/ZptDGDqBJeE/hqdefault.jpg',
  },
  {
    id: 'ar-l4SfMOUw',
    youtubeId: 'ar-l4SfMOUw',
    titleHi: 'Gonda : UPSC Aspirants ने प्रेमिका के शौक पूरा करने के लिए कर दिया भाई का कत्ल',
    duration: '07:06',
    views: '7.2K+ दृश्य',
    time: 'क्राइम बुलेटिन',
    thumbnail: 'https://i.ytimg.com/vi/ar-l4SfMOUw/hqdefault.jpg',
  },
  {
    id: 'cIUgGSN0q8k',
    youtubeId: 'cIUgGSN0q8k',
    titleHi: 'UGC को लेकर गोंडा में सवर्ण आर्मी का विरोध प्रदर्शन नरेंद्र मोदी मुर्दाबाद के लगे नारे',
    duration: '03:29',
    views: '4.5K+ दृश्य',
    time: 'ग्राउंड रिपोर्ट',
    thumbnail: 'https://i.ytimg.com/vi/cIUgGSN0q8k/hqdefault.jpg',
  },
  {
    id: 'fWw157rbNu8',
    youtubeId: 'fWw157rbNu8',
    titleHi: 'UGC के नाम क्यों छिड़ा संग्राम ? भाजपा की उल्टी गिनती चालू नरेंद्र मोदी शर्म करें | UGC ACT 2026 |',
    duration: '22:12',
    views: '8.2K+ दृश्य',
    time: 'राजनीतिक बहस',
    thumbnail: 'https://i.ytimg.com/vi/fWw157rbNu8/hqdefault.jpg',
  },
  {
    id: 'iy11CwMKf5E',
    youtubeId: 'iy11CwMKf5E',
    titleHi: 'Avimukteshwaranand Saraswati ने कहां अखिलेश यादव ने भी मरवाई थी लाठी',
    duration: '03:40',
    views: '4.9K+ दृश्य',
    time: 'धार्मिक व राजनीतिक',
    thumbnail: 'https://i.ytimg.com/vi/iy11CwMKf5E/hqdefault.jpg',
  },
  {
    id: 'Xi43vuDkUBA',
    youtubeId: 'Xi43vuDkUBA',
    titleHi: 'गोंडा में फर्जी STF बनकर महंत से कीमती चांदी के सिक्के लूटना पड़ा भारी, पुलिस ने 6 को किया गिरफ्तार',
    duration: '03:16',
    views: '6.8K+ दृश्य',
    time: 'पुलिस खुलासा',
    thumbnail: 'https://i.ytimg.com/vi/Xi43vuDkUBA/hqdefault.jpg',
  },
];

export async function getLatestYouTubeVideos(limit = 8): Promise<YouTubeVideoItem[]> {
  try {
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    const apiKey = process.env.YOUTUBE_DATA_API_KEY;

    // 1. If YouTube Data API is configured
    if (apiKey && !apiKey.startsWith('dummy_') && channelId && channelId !== 'UC_default_gonda') {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=${limit}&type=video&key=${apiKey}`;
      const res = await fetch(url, { next: { revalidate: 600 } }); // 10 minutes cache
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items.map((item: any) => ({
            id: item.id.videoId,
            youtubeId: item.id.videoId,
            titleHi: item.snippet.title,
            duration: 'वीडियो',
            views: 'नवीनतम',
            time: 'यूट्यूब ताज़ा अपडेट',
            thumbnail:
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
            publishedAt: item.snippet.publishedAt,
          }));
        }
      }
    }

    // 2. Try YouTube Public RSS Feed if Channel ID is provided
    if (channelId && channelId.startsWith('UC')) {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      const res = await fetch(rssUrl, { next: { revalidate: 600 } });
      if (res.ok) {
        const xmlText = await res.text();
        const entries = parseYouTubeRss(xmlText, limit);
        if (entries.length > 0) return entries;
      }
    }
  } catch (err) {
    console.warn('Live YouTube fetch fallback note:', err);
  }

  // Graceful fallback to verified list of channel videos
  return FALLBACK_LATEST_VIDEOS.slice(0, limit);
}

function parseYouTubeRss(xmlText: string, limit: number): YouTubeVideoItem[] {
  const results: YouTubeVideoItem[] = [];
  const entryMatches = xmlText.match(/<entry>[\s\S]*?<\/entry>/g);
  if (!entryMatches) return results;

  for (const entry of entryMatches.slice(0, limit)) {
    const videoIdMatch = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = entry.match(/<title>(.*?)<\/title>/);
    const publishedMatch = entry.match(/<published>(.*?)<\/published>/);

    if (videoIdMatch && videoIdMatch[1]) {
      const vid = videoIdMatch[1];
      const title = titleMatch ? titleMatch[1] : 'इंटरनेट की आवाज़ रिपोर्ट';
      results.push({
        id: vid,
        youtubeId: vid,
        titleHi: title,
        duration: 'वीडियो',
        views: 'नवीनतम वीडियो',
        time: 'लाइव यूट्यूब',
        thumbnail: `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
        publishedAt: publishedMatch ? publishedMatch[1] : undefined,
      });
    }
  }
  return results;
}
