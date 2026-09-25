import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-shimmer bg-slate-200/70 rounded ${className}`}
      aria-hidden="true"
    />
  );
};

// Skeleton Card for HotDealsSection - Exact geometry and zero layout shift
export const HotDealCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col justify-between bg-white rounded-2xl border border-pink-100/80 shadow-sm overflow-hidden w-[215px] sm:w-[235px] shrink-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Thumbnail placeholder */}
      <div className="relative aspect-square w-full bg-pink-100/50 animate-shimmer overflow-hidden">
        {/* Top badge placeholder */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <div className="h-4 w-10 rounded-md bg-rose-200/80 animate-pulse" />
        </div>

        {/* Brand tag overlay */}
        <div className="absolute bottom-2 left-2 h-3.5 w-24 rounded bg-slate-800/40 animate-pulse" />
      </div>

      {/* Content placeholder */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & duration placeholder */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-3 w-12 rounded bg-amber-100 animate-pulse" />
            <div className="h-3 w-12 rounded bg-slate-100 animate-pulse" />
          </div>

          {/* Title 2-lines placeholder */}
          <div className="space-y-1.5 my-1">
            <div className="h-3.5 w-full rounded bg-slate-200/80 animate-shimmer" />
            <div className="h-3.5 w-3/4 rounded bg-slate-200/80 animate-shimmer" />
          </div>
        </div>

        {/* Price & Add to Cart button placeholder */}
        <div className="mt-2.5 pt-2 border-t border-pink-50 flex items-end justify-between">
          <div className="space-y-1">
            <div className="h-4 w-20 rounded bg-pink-200/80 animate-shimmer" />
            <div className="h-2.5 w-14 rounded bg-slate-200/60 animate-shimmer" />
          </div>
          <div className="w-7 h-7 rounded-xl bg-pink-100/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// Skeleton Card for NearYouSection - Exact geometry and zero layout shift
export const SalonCardSkeleton: React.FC = () => {
  return (
    <div
      className="flex flex-col justify-between bg-white rounded-2xl border border-pink-100/80 shadow-sm overflow-hidden w-[250px] sm:w-[270px] shrink-0 pointer-events-none"
      aria-hidden="true"
    >
      {/* Thumbnail placeholder */}
      <div className="relative aspect-[16/10] w-full bg-pink-100/50 animate-shimmer overflow-hidden">
        {/* Top verified badge placeholder */}
        <div className="absolute top-2 left-2">
          <div className="h-4 w-16 rounded-full bg-emerald-100/80 animate-pulse" />
        </div>

        {/* Favorite circle placeholder */}
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 animate-pulse" />

        {/* Distance overlay placeholder */}
        <div className="absolute bottom-2 left-2 h-4 w-14 rounded bg-slate-800/40 animate-pulse" />
      </div>

      {/* Content placeholder */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating & category placeholder */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-3 w-16 rounded bg-amber-100 animate-pulse" />
            <div className="h-3 w-12 rounded bg-slate-100 animate-pulse" />
          </div>

          {/* Salon Name placeholder */}
          <div className="h-4 w-4/5 rounded bg-slate-200/80 animate-shimmer mb-2" />

          {/* Address placeholder */}
          <div className="h-3 w-3/5 rounded bg-slate-100 animate-shimmer" />
        </div>

        {/* Price & CTA Button placeholder */}
        <div className="mt-3 pt-2.5 border-t border-pink-50 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-2.5 w-14 rounded bg-slate-200/60 animate-shimmer" />
            <div className="h-4 w-20 rounded bg-pink-200/80 animate-shimmer" />
          </div>
          <div className="h-6 w-16 rounded-xl bg-pink-100/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
