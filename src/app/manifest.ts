import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'इंटरनेट की आवाज़',
    short_name: 'IKA News',
    description: 'ख़बर, ज्ञान और जन-सरोकार का डिजिटल मंच — गोंडा और पूर्वांचल',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#B91C1C',
    lang: 'hi',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

