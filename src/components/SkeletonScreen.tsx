import React from 'react';

interface SkeletonScreenProps {
  /** Optional custom message or subtext */
  statusText?: string;
}

/**
 * SkeletonScreen
 *
 * Implements a zero-CLS (Cumulative Layout Shift) loading skeleton screen
 * that precisely mirrors the visual structure and dimensions of the
 * Online MMJ Card header, announcement bar, hero section, and intake form card.
 *
 * Prevents layout shift and eliminates flickering during initial SPA mount
 * and hydration within WordPress and standalone environments.
 */
export const SkeletonScreen: React.FC<SkeletonScreenProps> = ({ 
  statusText = 'Loading secure clinical platform...' 
}) => {
  return (
    <div 
      className="online-mmj-spa-loading-screen bg-white text-slate-900 font-sans"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading Online MMJ Card Telehealth Platform"
    >
      {/* 1. Exact Header Skeleton (Height: 115.5px matching React Header & WP Static Header) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        {/* Progress Bar Placeholder (3.5px) */}
        <div className="w-full h-[3.5px] bg-slate-100 relative overflow-hidden">
          <div className="h-full w-1/3 bg-emerald-500/40 mmj-skeleton-bone" />
        </div>

        {/* Top Banner Skeleton (32px matching bg-[#15803d]) */}
        <div className="bg-[#15803d] text-white text-xs py-2 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <div className="w-48 h-3.5 bg-emerald-700/60 rounded-md mmj-skeleton-bone" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-28 h-3.5 bg-emerald-700/60 rounded-md mmj-skeleton-bone" />
            </div>
          </div>
        </div>

        {/* Navigation Bar Skeleton (80px - matching h-20) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo Skeleton */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 mmj-skeleton-bone shrink-0" />
              <div className="flex flex-col gap-1.5">
                <div className="w-36 h-5 bg-slate-200 rounded-md mmj-skeleton-bone" />
                <div className="w-24 h-2.5 bg-slate-100 rounded-md mmj-skeleton-bone" />
              </div>
            </div>

            {/* Navigation Links Skeleton */}
            <nav className="hidden md:flex items-center gap-6" aria-hidden="true">
              <div className="w-24 h-4 bg-slate-200 rounded-md mmj-skeleton-bone" />
              <div className="w-20 h-4 bg-slate-200 rounded-md mmj-skeleton-bone" />
              <div className="w-36 h-4 bg-slate-200 rounded-md mmj-skeleton-bone" />
              <div className="w-24 h-4 bg-slate-200 rounded-md mmj-skeleton-bone" />
            </nav>

            {/* Header Action Button Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-36 h-10 bg-emerald-600/30 rounded-xl mmj-skeleton-bone" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Hero Section Skeleton (Exact grid dimensions matching HeroSection.tsx) */}
      <section className="bg-white pt-8 pb-14 border-b border-slate-100 overflow-hidden flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column Skeleton */}
            <div className="lg:col-span-6 space-y-6 text-left pt-2">
              
              {/* Badge Pill Skeleton */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
                <div className="w-44 h-3.5 bg-emerald-200/80 rounded-md mmj-skeleton-bone" />
              </div>

              {/* H1 Heading Skeleton (3 lines matching layout) */}
              <div className="space-y-3">
                <div className="w-11/12 h-10 sm:h-12 bg-slate-200 rounded-lg mmj-skeleton-bone" />
                <div className="w-4/5 h-10 sm:h-12 bg-emerald-200/70 rounded-lg mmj-skeleton-bone" />
                <div className="w-3/5 h-10 sm:h-12 bg-slate-200 rounded-lg mmj-skeleton-bone" />
              </div>

              {/* Subheading Paragraph Skeleton */}
              <div className="space-y-2 max-w-xl">
                <div className="w-full h-4 bg-slate-100 rounded-md mmj-skeleton-bone" />
                <div className="w-5/6 h-4 bg-slate-100 rounded-md mmj-skeleton-bone" />
                <div className="w-4/6 h-4 bg-slate-100 rounded-md mmj-skeleton-bone" />
              </div>

              {/* State Picker Form Skeleton */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg">
                <div className="flex-1 h-12 bg-slate-100 border border-slate-200 rounded-xl mmj-skeleton-bone" />
                <div className="w-36 h-12 bg-slate-800/40 rounded-xl mmj-skeleton-bone" />
              </div>

              {/* Micro Trust Highlights Skeleton */}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-200 mmj-skeleton-bone" />
                  <div className="w-32 h-3.5 bg-slate-200 rounded-md mmj-skeleton-bone" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-200 mmj-skeleton-bone" />
                  <div className="w-32 h-3.5 bg-slate-200 rounded-md mmj-skeleton-bone" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-200 mmj-skeleton-bone" />
                  <div className="w-24 h-3.5 bg-slate-200 rounded-md mmj-skeleton-bone" />
                </div>
              </div>

              {statusText && (
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-2 pt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>{statusText}</span>
                </div>
              )}
            </div>

            {/* Right Column: Intake Form Card Skeleton */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border-2 border-emerald-100/80 p-6 sm:p-8 space-y-5 relative">
                
                {/* Floating Top Badge */}
                <div className="absolute -top-3.5 right-6 bg-emerald-700 text-white text-[11px] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 bg-emerald-300 rounded-full mmj-skeleton-bone" />
                  <div className="w-28 h-3 bg-emerald-200 rounded-md mmj-skeleton-bone" />
                </div>

                {/* Form Title & Subtitle Skeleton */}
                <div className="flex flex-col items-center space-y-2 pt-1">
                  <div className="w-64 h-7 bg-emerald-100 rounded-lg mmj-skeleton-bone" />
                  <div className="w-44 h-4 bg-slate-100 rounded-md mmj-skeleton-bone" />
                </div>

                {/* Input Fields Skeletons */}
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="w-20 h-3 bg-slate-200 rounded-md mb-1.5 mmj-skeleton-bone" />
                    <div className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl mmj-skeleton-bone" />
                  </div>
                  <div>
                    <div className="w-24 h-3 bg-slate-200 rounded-md mb-1.5 mmj-skeleton-bone" />
                    <div className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl mmj-skeleton-bone" />
                  </div>
                  <div>
                    <div className="w-28 h-3 bg-slate-200 rounded-md mb-1.5 mmj-skeleton-bone" />
                    <div className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl mmj-skeleton-bone" />
                  </div>

                  {/* Terms Checkbox Skeleton */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-4 h-4 rounded bg-slate-200 mmj-skeleton-bone shrink-0" />
                    <div className="w-56 h-3 bg-slate-200 rounded-md mmj-skeleton-bone" />
                  </div>

                  {/* Submit Button Skeleton */}
                  <div className="w-full h-13 bg-emerald-600/70 rounded-2xl mmj-skeleton-bone shadow-md" />
                </div>

                {/* Bottom Card Security Guarantee Skeleton */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3">
                  <div className="w-24 h-3 bg-slate-100 rounded-md mmj-skeleton-bone" />
                  <div className="w-24 h-3 bg-slate-100 rounded-md mmj-skeleton-bone" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Trust Stats Bar Skeleton */}
      <div className="bg-slate-50 border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 mmj-skeleton-bone shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-16 h-4 bg-slate-200 rounded-md mmj-skeleton-bone" />
                  <div className="w-20 h-2.5 bg-slate-100 rounded-md mmj-skeleton-bone" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
