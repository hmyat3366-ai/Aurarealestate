import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AGENCY_CONFIG } from "@/config/agency";

export const viewport: Viewport = {
  themeColor: "#0C0E0D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: `${AGENCY_CONFIG.name} | Prime Central London Real Estate`,
    template: `%s | ${AGENCY_CONFIG.name}`,
  },
  description: AGENCY_CONFIG.description,
  keywords: [
    "Prime Central London Real Estate",
    "Mayfair properties for sale",
    "Kensington luxury apartments",
    "Belgravia penthouses",
    "Chelsea townhouses to let",
    "Luxury real estate agency London",
    "Vane and Sterling",
  ],
  authors: [{ name: AGENCY_CONFIG.legalName }],
  creator: AGENCY_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.vaneandsterling.com",
    title: `${AGENCY_CONFIG.name} | Prime Central London Real Estate`,
    description: AGENCY_CONFIG.description,
    siteName: AGENCY_CONFIG.name,
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: `${AGENCY_CONFIG.name} - Prime Residential`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface-warm text-agency-900 selection:bg-accent-200 selection:text-agency-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
