import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://internetkiawaaz.in'),
  title: {
    default: 'इंटरनेट की आवाज़ | ख़बर, ज्ञान और जन-सरोकार का डिजिटल मंच',
    template: '%s | इंटरनेट की आवाज़',
  },
  description: 'गोंडा, कैसरगंज, देवीपाटन मंडल और पूर्वांचल की ताज़ा खबरें, निष्पक्ष ग्राउंड रिपोर्ट्स, वीडियो बुलेटिन और व्यापार डायरेक्टरी।',
  keywords: ['इंटरनेट की आवाज़', 'गोंडा समाचार', 'Gonda News', 'Kaiserganj', 'Uttar Pradesh News', 'पूर्वांचल', 'देवीपाटन मंडल'],
  authors: [{ name: 'इंटरनेट की आवाज़ एडिटोरियल डेस्क' }],
  publisher: 'इंटरनेट की आवाज़',
  openGraph: {
    type: 'website',
    locale: 'hi_IN',
    url: 'https://www.internetkiawaaz.com',
    siteName: 'इंटरनेट की आवाज़',
    title: 'इंटरनेट की आवाज़ | ख़बर, ज्ञान और जन-सरोकार का डिजिटल मंच',
    description: 'गोंडा और पूर्वांचल की ताज़ा और प्रामाणिक खबरें।',
    images: [{ url: '/logo.png', width: 960, height: 960, alt: 'इंटरनेट की आवाज़' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'इंटरनेट की आवाज़',
    description: 'गोंडा और पूर्वांचल की ताज़ा खबरें।',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#B91C1C" />
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body
        className="font-devanagari bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-red-700 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
