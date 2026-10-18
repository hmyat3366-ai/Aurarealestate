import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { PropertyDetailView } from "@/components/property";
import { PROPERTIES, getPropertyById, getPropertyBySlug } from "@/data/properties";

interface PropertyPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export function generateStaticParams() {
  const byId = PROPERTIES.map((p) => ({ id: p.id }));
  const bySlug = PROPERTIES.map((p) => ({ id: p.slug }));
  return [...byId, ...bySlug];
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const resolved = await Promise.resolve(params);
  const property = getPropertyById(resolved.id) || getPropertyBySlug(resolved.id);

  if (!property) {
    return {
      title: "Residence Not Found | AURA Real Estate",
      description: "The requested luxury residence could not be found in our private portfolio.",
    };
  }

  return {
    title: `${property.title} | AURA Real Estate Private Portfolio`,
    description: property.subtitle || property.description[0] || `${property.title} in ${property.address.neighborhood}`,
    openGraph: {
      title: `${property.title} | AURA Real Estate`,
      description: property.subtitle || property.description[0],
      images: [{ url: property.images.hero }],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const resolved = await Promise.resolve(params);
  const { id } = resolved;

  // Resolve by ID or fallback to slug
  const property = getPropertyById(id) || getPropertyBySlug(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
      <Header />
      <main id="main-content" className="flex-1 pt-20">
        <React.Suspense fallback={null}>
          <PropertyDetailView property={property} />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}
