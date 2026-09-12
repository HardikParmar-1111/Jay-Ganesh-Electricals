import React from "react";

export default function TrackerLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 pt-8 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-2.5">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-8 w-64 sm:w-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-4 w-48 sm:w-60 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          </div>
          <div className="h-10 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
        </div>

        {/* Project Selector Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-2xl shrink-0"
            />
          ))}
        </div>

        {/* Main Content Grid: Stepper & Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stepper Card (2 cols) */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3.5 w-28 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
              <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>

            {/* Timeline Steps Skeletons */}
            <div className="space-y-8 pl-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                  <div className="space-y-2 flex-1 pt-1">
                    <div className="h-4 w-44 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    <div className="h-3 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Specs Card (1 col) */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="h-5 w-36 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3.5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
            <div className="h-11 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
