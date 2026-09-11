"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./ui/Logo";

export function Footer() {
  const pathname = usePathname();

  // Constrain public Footer: hide retail footer on admin routes
  if (pathname?.startsWith("/admin")) {
    return (
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 mt-auto">
        <p>Jay Ganesh Electrical — Administrative Control Panel</p>
      </footer>
    );
  }

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <Logo size={42} className="group-hover:scale-105 transition-transform" />
              <span className="font-heading font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Jay Ganesh Electrical
              </span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Your trusted partner for premium electrical supplies and expert apartment/home wiring contracting services.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/catalog" className="text-slate-500 hover:text-brand-blue transition-colors">
                  Product Catalog
                </Link>
              </li>
              <li>
                <Link href="/contracting" className="text-slate-500 hover:text-brand-blue transition-colors">
                  Smart Quote Estimator
                </Link>
              </li>
              <li>
                <Link href="/tracker" className="text-slate-500 hover:text-brand-blue transition-colors">
                  Project Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="text-slate-500">
                123 Electrical Market,<br />
                Mumbai, 400001
              </li>
              <li className="text-slate-500">
                +91 98765 43210
              </li>
              <li className="text-slate-500">
                contact@jayganesh.com
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} Jay Ganesh Electrical. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-slate-500 hover:text-brand-blue">Privacy Policy</Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-brand-blue">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
