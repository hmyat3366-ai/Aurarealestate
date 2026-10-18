import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const variantStyles = {
    rectangular: "rounded-xs",
    circular: "rounded-full",
    text: "rounded-xs h-4",
  };

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      className={`relative overflow-hidden bg-[#F3F1EC] animate-pulse ${variantStyles[variant]} ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    >
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

// Zero-CLS Property Card Skeleton
export function PropertyCardSkeleton() {
  return (
    <div
      className="bg-[#FFFFFF] border border-[#E6E3DC] rounded-xs overflow-hidden flex flex-col"
      aria-busy="true"
      role="status"
    >
      {/* 4:3 Image container with shimmer */}
      <Skeleton className="aspect-[4/3] w-full" />

      {/* Card Content Bar */}
      <div className="p-5 flex flex-col gap-3">
        {/* Status Badge & Exclusivity Tag */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Asking Price */}
        <Skeleton className="h-7 w-36 mt-1" />

        {/* Specs Row: 3 Beds • 3.5 Baths • 2,840 Sq Ft */}
        <Skeleton className="h-4 w-52" />

        {/* Address Lines */}
        <div className="mt-1 space-y-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

// Responsive Grid of Property Skeletons
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      role="region"
      aria-label="Loading properties"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Property Detail View (PDP) Skeleton
export function PropertyDetailSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" aria-busy="true" role="status">
      {/* Back button skeleton */}
      <Skeleton className="h-4 w-32" />

      {/* Title & Address */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </div>

      {/* 5-Photo Mosaic Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[500px]">
        <Skeleton className="md:col-span-8 h-full" />
        <div className="md:col-span-4 grid grid-cols-2 gap-4 h-full">
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>

      {/* 2-Column Specs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="lg:col-span-4">
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
