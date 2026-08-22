import type { Metadata, Viewport } from 'next';
import { SITE } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  authors: [{ name: SITE.name }],
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} — ${SITE.role}`,
    description: SITE.ogDescription,
    type: 'website',
    url: SITE.url,
  },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0c11',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Fonts are loaded via <link> rather than next/font because next/font
          fetches at build time, and the build environment has no access to
          fonts.googleapis.com. The fallback stacks in globals.css cover the gap
          if the request fails at runtime.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
