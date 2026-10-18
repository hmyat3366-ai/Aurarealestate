"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

export interface PhotoGalleryProps {
  images: {
    hero: string;
    gallery: string[];
  };
  title: string;
}

export function PhotoGallery({ images, title }: PhotoGalleryProps) {
  // Combine all images into a deduplicated list with hero first
  const allImages = React.useMemo(() => {
    const list = [images.hero, ...(images.gallery || [])];
    return Array.from(new Set(list));
  }, [images.hero, images.gallery]);

  const [mobileIndex, setMobileIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [mounted, setMounted] = useState(false);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Lightbox container ref for focus trap
  const lightboxRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = (index: number) => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    setLightboxIndex(index);
    setZoomLevel(1);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoomLevel(1);
    if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, []);

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % allImages.length);
    setZoomLevel(1);
  }, [allImages.length]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setZoomLevel(1);
  }, [allImages.length]);

  // Keyboard navigation & Focus Trapping for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextLightboxImage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevLightboxImage();
      } else if (e.key === "Tab") {
        if (!lightboxRef.current) return;
        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on lightbox close button
    const timer = setTimeout(() => {
      if (lightboxRef.current) {
        const closeBtn = lightboxRef.current.querySelector<HTMLElement>(
          'button[aria-label="Close lightbox"], button[aria-label="Close photo gallery"]'
        );
        if (closeBtn) {
          closeBtn.focus();
        } else {
          lightboxRef.current.focus();
        }
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, nextLightboxImage, prevLightboxImage]);

  // Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      // Swiped left -> Next
      setMobileIndex((prev) => (prev + 1) % allImages.length);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> Prev
      setMobileIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // 5 photos for the desktop mosaic
  const mosaicPhotos = allImages.slice(0, 5);
  // Pad with hero if fewer than 5 photos
  while (mosaicPhotos.length < 5 && allImages.length > 0) {
    mosaicPhotos.push(allImages[mosaicPhotos.length % allImages.length]);
  }

  const categories = ["All", "Interior", "Exterior", "Architecture"];

  return (
    <section className="relative w-full" aria-label={`Photo gallery for ${title}`}>
      {/* ========================================================================= */}
      {/* 1. DESKTOP ASYMMETRICAL 5-PHOTO MOSAIC (md and up)                        */}
      {/* ========================================================================= */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-2.5 h-[520px] lg:h-[600px] w-full relative rounded-xs overflow-hidden bg-[#F3F1EC]">
        {/* Large Feature Hero Image (Left: 2 columns, 2 rows) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => openLightbox(0)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox(0);
            }
          }}
          aria-label={`View full photo 1 of ${allImages.length}: ${title}`}
          className="group relative md:col-span-2 md:row-span-2 h-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mosaicPhotos[0]}
            alt={`${title} — Primary view`}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#121312]/0 group-hover:bg-[#121312]/15 transition-colors duration-300" />
        </div>

        {/* Right 4-Photo 2x2 Grid */}
        {mosaicPhotos.slice(1, 5).map((photoUrl, idx) => {
          const actualIndex = idx + 1;
          return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => openLightbox(actualIndex % allImages.length)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(actualIndex % allImages.length);
                }
              }}
              aria-label={`View full photo ${actualIndex + 1} of ${allImages.length}: ${title}`}
              className="group relative col-span-1 row-span-1 h-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312] focus-visible:ring-offset-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt={`${title} — Gallery detail ${actualIndex}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#121312]/0 group-hover:bg-[#121312]/15 transition-colors duration-300" />
            </div>
          );
        })}

        {/* "View All Photos" Overlay Trigger Button in Bottom Right */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          aria-label={`View all ${allImages.length} photos in gallery`}
          className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFFFFF]/95 hover:bg-[#FFFFFF] text-[#121312] border border-[#E6E4DE] rounded-xs shadow-ambient-md text-xs font-mono uppercase tracking-[0.1em] backdrop-blur-xs transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121312]"
        >
          <svg
            className="w-4 h-4 text-[#78542E]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <span>View All Photos ({allImages.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE RESPONSIVE CAROUSEL (< md)                                      */}
      {/* ========================================================================= */}
      <div
        className="md:hidden relative aspect-[4/3] w-full overflow-hidden bg-[#F3F1EC] rounded-xs"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={allImages[mobileIndex] || images.hero}
          alt={`${title} — Photo ${mobileIndex + 1} of ${allImages.length}`}
          onClick={() => openLightbox(mobileIndex)}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Carousel Arrow Controls */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
              }}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#121312]/70 text-[#FBFBF9] backdrop-blur-xs flex items-center justify-center transition-opacity hover:bg-[#121312] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileIndex((prev) => (prev + 1) % allImages.length);
              }}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#121312]/70 text-[#FBFBF9] backdrop-blur-xs flex items-center justify-center transition-opacity hover:bg-[#121312] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Mobile Photo Counter Pill */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xs bg-[#121312]/80 backdrop-blur-xs text-xs font-mono text-[#FBFBF9] tracking-wider pointer-events-none">
              {mobileIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. ACCESSIBLE FULL-SCREEN LIGHTBOX MODAL                                   */}
      {/* ========================================================================= */}
      {mounted &&
        lightboxOpen &&
        createPortal(
          <div
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label="Photo Gallery Lightbox"
            tabIndex={-1}
            className="fixed inset-0 z-50 bg-[#121312]/95 backdrop-blur-md flex flex-col justify-between focus:outline-none select-none text-[#FBFBF9]"
          >
            {/* Top Toolbar: Counter, Category Chips, Zoom Controls & Close */}
            <header className="p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#282A27]">
              {/* Left: Property Title & Photo Counter */}
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-lg tracking-tight truncate max-w-[240px] sm:max-w-md text-[#FBFBF9]">
                  {title}
                </h3>
                <span className="font-mono text-xs text-[#8E8A80] border-l border-[#4A4C48] pl-3">
                  {lightboxIndex + 1} of {allImages.length}
                </span>
              </div>

              {/* Center: Category Chips */}
              <div className="hidden lg:flex items-center gap-1.5 bg-[#1F211F] p-1 rounded-xs border border-[#282A27]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors rounded-xs ${
                      activeCategory === cat
                        ? "bg-[#78542E] text-[#FBFBF9]"
                        : "text-[#8E8A80] hover:text-[#FBFBF9]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Right: Zoom Toggle & Close Button */}
              <div className="flex items-center gap-2">
                {/* Zoom toggle button */}
                <button
                  type="button"
                  onClick={() =>
                    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))
                  }
                  aria-label={`Current zoom ${zoomLevel}x. Click to change zoom`}
                  className="px-3 py-1.5 bg-[#1F211F] hover:bg-[#282A27] text-xs font-mono text-[#FBFBF9] border border-[#282A27] rounded-xs transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9]"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                  <span>{zoomLevel}x</span>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close photo gallery"
                  className="p-2 text-[#8E8A80] hover:text-[#FBFBF9] hover:bg-[#1F211F] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9] min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Central Stage: Image & Left/Right Nav Buttons */}
            <main className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
              {/* Previous Image Button */}
              <button
                type="button"
                onClick={prevLightboxImage}
                aria-label="Previous image"
                className="absolute left-4 sm:left-8 z-20 w-12 h-12 rounded-full bg-[#1F211F]/80 hover:bg-[#121312] text-[#FBFBF9] border border-[#282A27] flex items-center justify-center transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Main Lightbox Image */}
              <div className="relative max-w-5xl max-h-[70vh] flex items-center justify-center overflow-auto transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={allImages[lightboxIndex]}
                  alt={`${title} — Photo ${lightboxIndex + 1} of ${allImages.length}`}
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-h-[70vh] max-w-full object-contain transition-transform duration-300 select-none"
                />
              </div>

              {/* Next Image Button */}
              <button
                type="button"
                onClick={nextLightboxImage}
                aria-label="Next image"
                className="absolute right-4 sm:right-8 z-20 w-12 h-12 rounded-full bg-[#1F211F]/80 hover:bg-[#121312] text-[#FBFBF9] border border-[#282A27] flex items-center justify-center transition-all duration-200 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FBFBF9]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </main>

            {/* Bottom Thumbnail Strip */}
            <footer className="p-4 bg-[#141514] border-t border-[#282A27] overflow-x-auto">
              <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setZoomLevel(1);
                    }}
                    aria-label={`Jump to photo ${idx + 1}`}
                    className={`relative w-14 h-10 sm:w-16 sm:h-12 shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                      lightboxIndex === idx
                        ? "border-[#78542E] scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </footer>
          </div>,
          document.body
        )}
    </section>
  );
}
