"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, ShieldCheck, User } from "lucide-react";
import { Button } from "./ui/Button";
import { AuthModal } from "./AuthModal";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./ui/Logo";
import { createClient } from "@/utils/supabase/client";
import { signout } from "@/app/auth/actions";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<"admin" | "customer" | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();

    const fetchProfileRole = async (userId: string) => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userId)
          .maybeSingle();

        setRole(profile?.role === "admin" ? "admin" : "customer");
      } catch {
        setRole("customer");
      }
    };

    // Check current session
    supabase.auth.getUser().then(({ data }) => {
      const activeUser = data?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchProfileRole(activeUser.id);
      } else {
        setRole(null);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        await fetchProfileRole(activeUser.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Constrain public Navbar: do not render inside Admin area
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Base links visible to all users
  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "Catalog", href: "/catalog" },
    { name: "Contracting", href: "/contracting" },
    { name: "Tracker", href: "/tracker" },
  ];

  // Dynamic Dashboard Link: Only shown when authenticated, pointing to the exact role dashboard
  const navLinks = [...baseLinks];
  if (user) {
    const dashboardHref = role === "admin" ? "/admin/dashboard" : "/customer/dashboard";
    const dashboardLabel = role === "admin" ? "Admin Panel" : "Dashboard";
    navLinks.push({ name: dashboardLabel, href: dashboardHref });
  }

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <>
      <div className="sticky top-3 z-40 mx-4 md:mx-auto max-w-5xl">
        <header className="bg-white/75 dark:bg-zinc-900/80 backdrop-blur-lg rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="flex items-center gap-3 group">
                  <Logo size={42} className="transition-transform group-hover:scale-105" />
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-base sm:text-lg leading-tight text-slate-900 dark:text-white">
                      Jay Ganesh
                    </span>
                    <span className="text-[10px] tracking-wider uppercase text-brand-gold font-semibold -mt-0.5">
                      Electrical
                    </span>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-1 relative">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:text-brand-blue"
                    >
                      <span
                        className={`relative z-10 ${isActive ? "text-brand-blue font-semibold" : "text-foreground/80"
                          }`}
                      >
                        {link.name}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-pill"
                          className="absolute inset-0 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full z-0"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                <ThemeToggle />
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href={role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                    >
                      {role === "admin" ? <ShieldCheck size={14} /> : <User size={14} />}
                      <span>{role === "admin" ? "Admin" : "Account"}</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="h-9 px-5 rounded-full text-sm font-semibold"
                    onClick={() => setIsAuthModalOpen(true)}
                  >
                    Sign In
                  </Button>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <Button
                  variant="ghost"
                  className="h-9 w-9 p-0 rounded-full"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Main menu"
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
              className="absolute top-[68px] left-0 right-0 md:hidden glass rounded-3xl border border-white/40 dark:border-slate-700/50 shadow-xl overflow-hidden z-50"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-2xl text-base font-medium transition-colors ${isActive
                          ? "bg-brand-blue/10 text-brand-blue font-semibold"
                          : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700/50 flex flex-col gap-2">
                  <div className="flex justify-end px-2 mb-2">
                    <ThemeToggle />
                  </div>
                  {user ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center justify-center gap-2 text-red-500 py-3 rounded-2xl font-medium hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      className="w-full rounded-2xl h-12"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
