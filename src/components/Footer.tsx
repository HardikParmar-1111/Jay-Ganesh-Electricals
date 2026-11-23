"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui/Logo";
import { ArrowUpRight, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Constrain public Footer: hide on admin routes
  if (pathname?.startsWith("/admin")) {
    return (
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-6 text-center text-xs text-slate-400 mt-auto bg-transparent">
        <p>Jay Ganesh Electrical — Administrative Control Panel</p>
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto w-full pt-12 overflow-hidden bg-transparent">
      {/* Outer wrapper to constrain and shape the rounded card */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ========================================================= */}
        {/* ROUNDED TOP CARD CONTAINER (Matches Reference Component)  */}
        {/* ========================================================= */}
        <div className="relative rounded-t-[32px] sm:rounded-t-[44px] md:rounded-t-[52px] border-t border-x border-slate-200/90 dark:border-zinc-800/80 bg-white/90 dark:bg-[#0c0c0f]/95 backdrop-blur-2xl shadow-2xl shadow-black/10 dark:shadow-black/60 pt-14 sm:pt-20 pb-10 px-6 sm:px-12 lg:px-16 overflow-hidden transition-colors duration-300">
          {/* Subtle Ambient Radial Highlight on Top Curved Edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-24 bg-gradient-to-b from-amber-500/[0.08] dark:from-white/[0.07] via-transparent to-transparent blur-xl"
          />

          {/* Top Border Inner Sheen Line */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 dark:via-white/20 to-transparent"
          />

          {/* Main Content Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16 relative z-10">
            {/* Brand & Mission Column (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-3.5 mb-5 group">
                  <Logo size={44} className="group-hover:scale-105 transition-transform" />
                  <div className="flex flex-col">
                    <span className="font-heading font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                      Jay Ganesh
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-brand-gold font-bold mt-1">
                      Architectural Electricals
                    </span>
                  </div>
                </Link>

                <p className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400 max-w-sm mb-6">
                  Certified turnkey electrical contracting and architectural illumination for luxury villas, modern duplexes, and commercial properties.
                </p>

                {/* ISO/IS Compliance Chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-300">
                  <ShieldCheck size={14} className="text-amber-500 dark:text-amber-400" />
                  <span>IS:732 Indian Standards Compliant Execution</span>
                </div>
              </div>
            </div>

            {/* Column 1: Services */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-white mb-5 font-heading">
                Services
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <Link
                    href="/#materials"
                    className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors"
                  >
                    Materials Showcase
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contracting"
                    className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors"
                  >
                    Contracting Quote / BOQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tracker"
                    className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors"
                  >
                    Live Project Tracker
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contracting"
                    className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    <span>Instant Estimation</span>
                    <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Engineering */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-white mb-5 font-heading">
                Standards
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li>
                  <span className="text-slate-600 dark:text-zinc-400">
                    IS:732 Wiring Code
                  </span>
                </li>
                <li>
                  <span className="text-slate-600 dark:text-zinc-400">
                    FRLS Multi-strand Copper
                  </span>
                </li>
                <li>
                  <span className="text-slate-600 dark:text-zinc-400">
                    Dedicated Chemical Earthing
                  </span>
                </li>
                <li>
                  <span className="text-slate-600 dark:text-zinc-400">
                    10kA MCB &amp; 30mA RCCB
                  </span>
                </li>
                <li>
                  <span className="text-slate-600 dark:text-zinc-400">
                    Megger Insulation Testing
                  </span>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Office */}
            <div>
              <h3 className="font-bold text-sm tracking-wider uppercase text-slate-900 dark:text-white mb-5 font-heading">
                Contact
              </h3>
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-start gap-2.5 text-slate-600 dark:text-zinc-400">
                  <MapPin size={15} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Thanagalol, Jetpur,<br />Gujarat 360370
                  </span>
                </li>
                <li>
                  <a
                    href="tel:+919724921890"
                    className="flex items-center gap-2.5 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors"
                  >
                    <Phone size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
                    <span>+91 9724921890</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@jayganesh.com"
                    className="flex items-center gap-2.5 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-white transition-colors"
                  >
                    <Mail size={14} className="text-amber-500 dark:text-amber-400 shrink-0" />
                    <span>contact@jayganesh.com</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BOTTOM COPYRIGHT & LEGAL BAR (Matches Reference)         */}
          {/* ========================================================= */}
          <div className="pt-8 border-t border-slate-200/80 dark:border-zinc-800/70 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
            <p>
              &copy; {currentYear} Jay Ganesh Electrical. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                Terms
              </span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                IS:732 Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
