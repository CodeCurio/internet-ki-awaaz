import type { Metadata } from 'next';

const SITE_NAME = 'इंटरनेट की आवाज़';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internetkiawaaz.in';
const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/default-og-image.jpg`;

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string;
  imageUrl?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string;
  noIndex?: boolean;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = `${SITE_URL}${input.path}`;
  const image = input.imageUrl ?? DEFAULT_OG_IMAGE;

  return {
    title: `${input.title} | ${SITE_NAME}`,
    description: input.description,
    alternates: { canonical },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      url: canonical,
      type: input.type ?? 'website',
      locale: 'hi_IN',
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.type === 'article' && {
        publishedTime: input.publishedTime ?? undefined,
        modifiedTime: input.modifiedTime,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}
