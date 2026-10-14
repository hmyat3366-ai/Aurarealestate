import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROPERTIES, getPropertyBySlug, getRelatedProperties } from "@/data/properties";
import PropertyDetailClient from "@/components/PropertyDetailClient";
import { AGENCY_CONFIG } from "@/config/agency";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROPERTIES.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found",
    };
  }

  const priceFormatted = formatPrice(
    property.price,
    property.purpose,
    property.pricePeriod,
    property.currency
  );

  return {
    title: `${property.title} | ${priceFormatted}`,
    description: property.description.slice(0, 160),
    openGraph: {
      title: `${property.title} | ${priceFormatted} | ${AGENCY_CONFIG.name}`,
      description: property.description.slice(0, 160),
      images: [
        {
          url: property.images[0],
          width: 1200,
          height: 800,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const related = getRelatedProperties(property);

  return <PropertyDetailClient property={property} relatedProperties={related} />;
}
