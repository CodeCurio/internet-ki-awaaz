import { createPublicServerClient } from '@/lib/supabase/server';
import { HeroNewsGrid } from '@/components/public/home/HeroNewsGrid';
import { CategoryDeskBlock } from '@/components/public/home/CategoryDeskBlock';
import { VideoDeskCarousel } from '@/components/public/home/VideoDeskCarousel';
import { SocialFeedsHub } from '@/components/public/home/SocialFeedsHub';
import { getLatestYouTubeVideos } from '@/lib/youtube/youtube-feed';

export const revalidate = 60; // ISR revalidation every 60s

export default async function HomePage() {
  const supabase = await createPublicServerClient();
  const latestYouTubeVideos = await getLatestYouTubeVideos(8);

  // Fetch published posts with relations
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      category:categories(id, name_hi, name_en, slug),
      author:profiles!posts_author_id_fkey(id, full_name, full_name_hi, username, designation_hi)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20);

  // Group by categories
  const leadStory = posts?.[0] || null;
  const secondaryStories = posts?.slice(1, 4) || [];
  const headlineStream = posts?.slice(4, 9) || [];

  const siyasatPosts = posts?.filter((p: any) => p.category?.slug === 'siyasat') || [];
  const itihasPosts = posts?.filter((p: any) => p.category?.slug === 'itihas-virasat') || [];
  const janAwaazPosts = posts?.filter((p: any) => p.category?.slug === 'jan-awaaz') || [];
  const gondaPosts = posts?.filter((p: any) => p.category?.slug === 'gonda-aanchal') || [];

  // Fallback demo posts if DB doesn't have enough posts yet
  const fallbackSiyasat: any[] = siyasatPosts.length > 0 ? siyasatPosts : [
    {
      id: 'siy-1',
      slug: 'kaiserganj-lok-sabha-constituency-ground-report',
      title_hi: 'कैसरगंज लोकसभा: विकास कार्यों का लेखा-जोखा और जनता की उम्मीदें',
      featured_image_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'siy-2',
      slug: 'gonda-panchayat-budget-allocation-analysis',
      title_hi: 'गोंडा की 1214 ग्राम पंचायतों के विकास बजट में 20% की वृद्धि',
      featured_image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'siy-3',
      slug: 'purvanchal-neta-samikaran-2026',
      title_hi: 'पूर्वांचल की सियासत में जातीय समीकरण और युवाओं की नई भागीदारी',
      featured_image_url: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 16).toISOString(),
    },
    {
      id: 'siy-4',
      slug: 'devipatan-mandal-cabinet-review-meeting',
      title_hi: 'देवीपाटन मंडल के विकास कार्यों की समीक्षा: कर्नलगंज बंधे को लेकर कड़े निर्देश',
      featured_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ];

  const fallbackItihas: any[] = itihasPosts.length > 0 ? itihasPosts : [
    {
      id: 'iti-1',
      slug: 'raja-devi-bakhsh-singh-1857-revolution-gonda',
      title_hi: 'राजा देवी बख्श सिंह: जब गोंडा की धरती पर ब्रिटिश हुकूमत के छूटे पसीने',
      excerpt_hi: '1857 के प्रथम स्वतंत्रता संग्राम में गोंडा नरेश के अदम्य साहस और ब्रिटिश सेना से ऐतिहासिक युद्ध की अनदेखी गाथा।',
      featured_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: 'iti-2',
      slug: 'prithvi-nathan-mandir-khargupur-ancient-history',
      title_hi: 'खरगू Reti स्थित प्राचीन पृथ्वीनाथ मंदिर: महाभारत कालीन रहस्य और आस्था',
      excerpt_hi: 'पांडव काल में अज्ञातवास के दौरान स्थापित एशिया के सबसे ऊंचे शिवलिंग की ऐतिहासिक धरोहर।',
      featured_image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
    {
      id: 'iti-3',
      slug: 'paska-sukarkhet-tulsidas-birthplace-debate',
      title_hi: 'पस्का सूकरखेत: गोस्वामी तुलसीदास जी की ज्ञान स्थली का ऐतिहासिक शोध',
      excerpt_hi: 'गोंडा के सूकरखेत में संत तुलसीदास जी के गुरु नरहरि दास के आश्रम का ऐतिहासिक प्रामाणिक विवरण।',
      featured_image_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];

  const fallbackJanAwaaz: any[] = janAwaazPosts.length > 0 ? janAwaazPosts : [
    {
      id: 'jan-1',
      slug: 'gonda-farmers-organic-farming-revolution',
      title_hi: 'गोंडा के युवा किसान ने जैविक खेती से कमाया 15 लाख का मुनाफा, दूसरों को दे रहे प्रशिक्षण',
      featured_image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      author: { full_name_hi: 'पवन वर्मा' },
    },
    {
      id: 'jan-2',
      slug: 'tarabganj-women-self-help-group-handicraft',
      title_hi: 'तरबगंज की महिलाओं ने बनाई हस्तशिल्प कंपनी, खादी ग्रामोद्योग से मिला बड़ा ऑर्डर',
      featured_image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
      published_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      author: { full_name_hi: 'सुनीता त्रिपाठी' },
    },
  ];

  return (
    <div className="space-y-8">
      {/* 3-Tier Lead Grid */}
      <HeroNewsGrid
        leadStory={leadStory}
        secondaryStories={secondaryStories}
        headlineStream={headlineStream}
      />

      {/* Special Desk: Siyasat Ke Sirmaur (Politics Rail) */}
      <CategoryDeskBlock
        titleHi="सियासत के सिरमौर"
        slug="siyasat"
        variant="politics_rail"
        posts={fallbackSiyasat}
      />

      {/* Video Desk Carousel with YouTube channel integration */}
      <VideoDeskCarousel videos={latestYouTubeVideos} />

      {/* Dual Social Media Hub: Facebook + Instagram Side-by-Side */}
      <SocialFeedsHub />

      {/* Special Desk: Gonda Ka Asli Itihas (Sepia Heritage Theme) */}
      <CategoryDeskBlock
        titleHi="गोंडा का असली इतिहास व विरासत"
        slug="itihas-virasat"
        variant="sepia"
        posts={fallbackItihas}
      />

      {/* Desk: Jan Awaaz (Public Voice & Inspiration) */}
      <CategoryDeskBlock
        titleHi="जन-आवाज़ एवं प्रेरणा"
        slug="jan-awaaz"
        variant="standard"
        posts={fallbackJanAwaaz}
      />
    </div>
  );
}

