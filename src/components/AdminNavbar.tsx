"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { ShieldCheck, LogOut, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "./ui/Logo";
import { signout } from "@/app/auth/actions";
import { ThemeToggle } from "./ThemeToggle";

export function AdminNavbar() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signout();
    });
  };

  return (
    <div className="sticky top-3 z-50 mx-4 md:mx-auto max-w-6xl">
      <header className="bg-white/75 dark:bg-zinc-900/80 backdrop-blur-lg rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Logo linking to Live Public Site */}
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-3 group"
                title="View Live Public Site"
              >
                <Logo size={40} className="transition-transform group-hover:scale-105" />
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-base sm:text-lg leading-tight text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">
                    Jay Ganesh
                  </span>
                  <span className="text-[10px] tracking-wider uppercase text-brand-gold font-semibold -mt-0.5">
                    Electrical
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Admin Control Badge & Fast Live Site Switcher */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold tracking-wide">
                <ShieldCheck size={15} className="text-amber-500" />
                <span>Admin Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Open live public landing page"
              >
                <span>Live Site</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            {/* Right: Sign Out and Mobile Badge */}
            <div className="flex items-center gap-2">
              <div className="sm:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
                <ShieldCheck size={13} />
                <span>Admin</span>
              </div>

              <ThemeToggle />
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LogOut size={14} />
                )}
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}
