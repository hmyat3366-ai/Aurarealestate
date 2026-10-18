import type { Metadata, Viewport } from 'next';
import React from 'react';
import { fontDisplay, fontSans, fontMono } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AURA Real Estate | Architectural Real Estate',
    template: '%s | AURA Real Estate',
  },
  description:
    'Curators of distinctive architectural residences, historic estates, and prime luxury properties in London, New York, and Zurich.',
  keywords: [
    'luxury real estate',
    'architectural residences',
    'penthouses',
    'historic estates',
    'Mayfair',
    'Tribeca',
    'Zurichberg',
  ],
  authors: [{ name: 'AURA Real Estate Curatorial Board' }],
  creator: 'AURA Real Estate',
  metadataBase: new URL('https://aurarealestate.com'),
  icons: {
    icon: [
      { url: '/brand/aura-favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/brand/aura-favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'AURA Real Estate | Architectural Real Estate',
    description:
      'Curators of distinctive architectural residences, historic estates, and prime luxury properties.',
    url: 'https://aurarealestate.com',
    siteName: 'AURA Real Estate',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#FBFBF9',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { AuthProvider } from '@/context/AuthContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ToastProvider } from '@/components/ui/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-canvas text-ink-primary font-sans antialiased selection:bg-obsidian selection:text-alabaster">
        {/* Skip to Main Content Link for WCAG 2.2 AA Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-obsidian text-alabaster font-mono text-xs tracking-wider border border-hairline-medium shadow-ambient-lg"
        >
          Skip to main content
        </a>

        {/* Global Application Shell */}
        <AuthProvider>
          <FavoritesProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <div className="flex-grow">{children}</div>
              </div>
            </ToastProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
