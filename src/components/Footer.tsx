"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui/Logo";
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  MessageCircle,
  Clock,
  Zap,
} from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide public footer on admin control routes
  if (pathname?.startsWith("/admin")) {
    return (
      <footer className="border-t border-slate-200 dark:border-zinc-800/80 py-6 text-center text-xs text-slate-500 dark:text-zinc-500 mt-auto bg-transparent">
        <p>Jay Ganesh Electrical — Administrative Control Panel</p>
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto w-full border-t border-slate-200 dark:border-zinc-800/80 bg-slate-50/70 dark:bg-zinc-950/80 backdrop-blur-md text-foreground transition-colors duration-300">
      {/* Subtle top edge gradient sheen matching the brand's lighting theme */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 dark:via-amber-400/30 to-transparent"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-14">
          {/* Brand & Introduction Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 group">
                <Logo size={42} className="group-hover:scale-105 transition-transform" />
                <div className="flex flex-col">
                  <span className="font-heading font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                    Jay Ganesh
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-brand-gold font-bold mt-1">
                    Electrical Contracting
                  </span>
                </div>
              </Link>

              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400 max-w-sm">
                Certified turnkey electrical installation, concealed wiring, distribution switchgear, and architectural 3000K lighting for luxury villas, bungalows, and modern residences across Gujarat.
              </p>
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                <ShieldCheck size={14} className="shrink-0" />
                <span>IS:732 Bureau of Indian Standards Certified</span>
              </div>

              <div>
                <a
                  href="https://wa.me/919724921890?text=Hello%20Jay%20Ganesh%20Electrical,%20I%20would%20like%20to%20inquire%20about%20electrical%20contracting%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <MessageCircle size={15} className="text-emerald-500" />
                  <span>Direct WhatsApp Consultation Available</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links / Navigation */}
          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Navigation &amp; Tools
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/#materials"
                  className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-between group"
                >
                  <span>Materials Showcase</span>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/?simulator=true"
                  className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-between group"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Room Simulator</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      Live
                    </span>
                  </span>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contracting"
                  className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-between group"
                >
                  <span>Contracting Estimator / BOQ</span>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tracker"
                  className="text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-between group"
                >
                  <span>Live Project Tracker</span>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Engineering Standards */}
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Contracting Standards
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>IS:732 Wiring Code</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>FRLS Copper Conduits</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Dedicated Earthing Pit</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>10kA MCB / 30mA RCCB</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>Megger Insulation Test</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-slate-600 dark:text-zinc-400">
                <MapPin size={16} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Thanagalol, Jetpur,
                  <br />
                  Gujarat 360370, India
                </span>
              </li>
              <li>
                <a
                  href="tel:+919724921890"
                  className="flex items-center gap-2.5 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <Phone size={15} className="text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className="font-medium">+91 9724921890</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:jayganeshelectricals001@gmail.com"
                  className="flex items-center gap-2.5 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors break-all"
                >
                  <Mail size={15} className="text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>jayganeshelectricals001@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500 dark:text-zinc-500 text-xs pt-1">
                <Clock size={14} className="shrink-0" />
                <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Strip */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-zinc-400">
          <p>
            &copy; {currentYear} Jay Ganesh Electrical. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link
              href="/terms-and-warranty"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Terms &amp; Warranty
            </Link>
            <Link
              href="/safety-compliance"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Safety Compliance
            </Link>
            <span className="text-slate-400 dark:text-zinc-600">|</span>
            <Link
              href="/contracting"
              className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
            >
              Turnkey Villa Electrical Contracting
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
