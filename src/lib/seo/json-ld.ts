interface PostForJsonLd {
  title_hi: string;
  title_en: string | null;
  seo_description_hi: string | null;
  excerpt_hi: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  updated_at: string;
  slug: string;
  is_video_first: boolean;
  youtube_video_id: string | null;
  youtube_thumbnail_url: string | null;
  youtube_duration_seconds: number | null;
  category: { name_hi: string };
  author: { full_name_hi?: string | null; full_name?: string | null; username: string };
}

export function buildArticleJsonLd(post: PostForJsonLd) {
  const newsArticle = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title_hi,
    alternativeHeadline: post.title_en ?? undefined,
    image: post.featured_image_url ? [post.featured_image_url] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author.full_name_hi || post.author.full_name || post.author.username,
      url: `https://internetkiawaaz.in/author/${post.author.username}`,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'इंटरनेट की आवाज़',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.internetkiawaaz.com/logo.png',
        width: 960,
        height: 960,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.internetkiawaaz.com/news/${post.slug}`,
    },
    articleSection: post.category.name_hi,
    inLanguage: 'hi',
    description: post.seo_description_hi ?? post.excerpt_hi ?? undefined,
  };

  if (!post.is_video_first || !post.youtube_video_id) {
    return newsArticle;
  }

  const videoObject = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: post.title_hi,
    description: post.seo_description_hi ?? post.excerpt_hi ?? '',
    thumbnailUrl: post.youtube_thumbnail_url ? [post.youtube_thumbnail_url] : undefined,
    uploadDate: post.published_at ?? undefined,
    duration: post.youtube_duration_seconds
      ? `PT${post.youtube_duration_seconds}S`
      : undefined,
    embedUrl: `https://www.youtube.com/embed/${post.youtube_video_id}`,
    publisher: {
      '@type': 'Organization',
      name: 'इंटरनेट की आवाज़',
      logo: { '@type': 'ImageObject', url: 'https://www.internetkiawaaz.com/logo.png' },
    },
  };

  return [newsArticle, videoObject];
}

export function buildLocalBusinessJsonLd(business: {
  business_name_hi: string;
  description_hi?: string | null;
  cover_image_url?: string | null;
  address_hi?: string | null;
  locality?: string | null;
  phone_number?: string | null;
  rating?: number | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.business_name_hi,
    description: business.description_hi ?? undefined,
    image: business.cover_image_url ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address_hi ?? undefined,
      addressLocality: business.locality ?? 'Gonda',
      addressRegion: 'Uttar Pradesh',
      postalCode: '271001',
      addressCountry: 'IN',
    },
    telephone: business.phone_number ?? undefined,
    aggregateRating: business.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: business.rating.toString(),
          bestRating: '5',
        }
      : undefined,
  };
}
