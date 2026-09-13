"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LogOut, ExternalLink, Loader2, Menu, X } from "lucide-react";
import { Logo } from "./ui/Logo";
import { Button } from "./ui/Button";
import { signout } from "@/app/auth/actions";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/utils/supabase/client";

export function AdminNavbar() {
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      await signout();
      router.refresh();
      router.push("/");
    });
  };

  const adminLinks = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Image Manager", href: "/admin/image-manager" },
    { name: "Live Site", href: "/", external: true },
  ];

  return (
    <>
      <div className="sticky top-3 z-50 mx-4 md:mx-auto max-w-5xl">
        <header className="bg-white/75 dark:bg-zinc-900/80 backdrop-blur-lg rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              
              {/* Left: Logo linking to Live Public Site */}
              <div className="flex-shrink-0 flex items-center">
                <Link 
                  href="/" 
                  className="flex items-center gap-3 group"
                  title="View Live Public Site"
                >
                  <Logo size={42} className="transition-transform group-hover:scale-105" />
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

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1 items-center">
                {adminLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href === "/admin/dashboard" && pathname === "/admin");

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-in-out ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        {link.name}
                        {link.external && <ExternalLink size={12} className="opacity-70" />}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <div className="border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/10 rounded-full px-4 py-2 flex items-center gap-2 text-xs font-semibold">
                    <ShieldCheck size={14} className="text-amber-600 dark:text-amber-400" />
                    <span>Admin Mode</span>
                  </div>

                  <button
                    onClick={handleSignOut}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-50"
                    title="Sign Out"
                  >
                    {isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <LogOut size={14} />
                    )}
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden gap-2">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-full"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Admin menu"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              </div>

            </div>
          </div>
        </header>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute top-[68px] left-0 right-0 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden z-50"
            >
              <div className="flex flex-col gap-4 p-6">
                {adminLinks.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href === "/admin/dashboard" && pathname === "/admin");

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-2xl text-base font-medium transition-all duration-300 ease-in-out ${
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-semibold"
                          : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {link.name}
                        {link.external && <ExternalLink size={14} className="opacity-70" />}
                      </span>
                    </Link>
                  );
                })}

                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/50 flex flex-col gap-3">
                  <div className="border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-500/10 rounded-2xl px-4 py-2.5 flex items-center justify-center gap-2 text-xs font-semibold">
                    <ShieldCheck size={16} />
                    <span>Admin Mode Active</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center justify-center gap-2 text-red-500 py-3 rounded-2xl font-medium hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all duration-300 ease-in-out"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

