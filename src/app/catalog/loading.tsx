import React from "react";

export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 animate-pulse">
      {/* Header section skeleton */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              <div className="h-9 w-80 sm:w-96 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
              <div className="h-4 w-full max-w-xl bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            </div>

            {/* Search Bar Skeleton */}
            <div className="h-11 w-full md:w-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>

          {/* Featured Categories Skeletons */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between">
              <div className="h-3 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="h-36 bg-zinc-200 dark:bg-zinc-800" />
                  <div className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filter Pills Skeleton */}
          <div className="flex gap-2 pt-2 overflow-x-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="h-8 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div className="aspect-square bg-zinc-200 dark:bg-zinc-800" />
              <div className="p-3 space-y-2">
                <div className="h-2.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-2.5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="p-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-6 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
