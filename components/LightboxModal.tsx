"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function LightboxModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}: LightboxModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} Gallery Lightbox`}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 text-white z-20">
        <div>
          <h2 className="text-sm font-medium tracking-wide text-agency-200">
            {title}
          </h2>
          <span className="text-xs text-agency-400">
            Photograph {currentIndex + 1} of {images.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-agency-300 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Close photo gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20 focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Previous photograph"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Current Image */}
        <div className="relative w-full h-full max-w-6xl max-h-[75vh]">
          <Image
            src={images[currentIndex]}
            alt={`${title} - Photograph ${currentIndex + 1}`}
            fill
            sizes="100vw"
            priority
            className="object-contain"
          />
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20 focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Next photograph"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnail Strip */}
      <div className="px-6 py-4 flex items-center justify-center space-x-2 overflow-x-auto z-20">
        {images.map((img, idx) => (
          <button
            key={img}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-16 h-12 rounded overflow-hidden transition-all shrink-0 ${
              idx === currentIndex
                ? "ring-2 ring-accent-500 opacity-100 scale-105"
                : "opacity-40 hover:opacity-80"
            }`}
            aria-label={`Jump to photograph ${idx + 1}`}
          >
            <Image
              src={img}
              alt=""
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
