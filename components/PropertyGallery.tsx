"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";
import LightboxModal from "./LightboxModal";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="relative w-full rounded-lg overflow-hidden mb-8">
        {/* Desktop Editorial Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[380px] sm:h-[480px] lg:h-[560px]">
          {/* Main Hero Photo (Left 2 columns on tablet, 2.5 on desktop) */}
          <div
            onClick={() => openLightbox(0)}
            className="relative md:col-span-2 lg:col-span-2 h-full cursor-pointer overflow-hidden group bg-agency-100"
          >
            <Image
              src={images[0]}
              alt={`${title} - Primary Architectural View`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Secondary Photo 1 */}
          {images[1] && (
            <div
              onClick={() => openLightbox(1)}
              className="hidden md:block relative h-full cursor-pointer overflow-hidden group bg-agency-100"
            >
              <Image
                src={images[1]}
                alt={`${title} - Interior Detail`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          )}

          {/* Secondary Photo 2 / Stacked photo */}
          {images[2] && (
            <div
              onClick={() => openLightbox(2)}
              className="hidden md:block relative h-full cursor-pointer overflow-hidden group bg-agency-100"
            >
              <Image
                src={images[2]}
                alt={`${title} - Architectural Suite`}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
          )}
        </div>

        {/* Floating "View all X photos" Button */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 px-4 py-2.5 rounded bg-surface-dark/85 hover:bg-surface-dark text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-premium transition-all focus-visible:ring-2 focus-visible:ring-white"
        >
          <Camera className="w-4 h-4 text-accent-400" />
          <span>View all {images.length} photographs</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        images={images}
        initialIndex={activePhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={title}
      />
    </>
  );
}
