"use client";

import React, { useState, useTransition, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, Phone, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { login, signup, AuthActionResult } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<AuthActionResult | null>(null);
  const [isPending, startActionTransition] = useTransition();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

    startActionTransition(async () => {
      if (isLogin) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setStatus({
            error: error.message.includes("Invalid login credentials")
              ? "Invalid email or password. Please try again."
              : error.message,
          });
          return;
        }

        let targetPath = "/catalog";
        try {
          if (data?.user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", data.user.id)
              .maybeSingle();

            if (profile?.role === "admin") {
              targetPath = "/admin";
            }
          }
        } catch {
          targetPath = "/catalog";
        }

        // Also sync server action / cookies if available
        await login(formData).catch(() => {});

        onClose();
        startTransition(() => {
          router.push(targetPath);
          router.refresh();
        });
      } else {
        const res = await signup(formData);
        if (res) {
          setStatus(res);
          if (res.success) {
            router.refresh();
            // Optional switch back to login
            setTimeout(() => setIsLogin(true), 2500);
          }
        }
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 320 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 pointer-events-auto overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <Logo size={48} />
                    <div>
                      <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                        {isLogin ? "Welcome back" : "Create account"}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Jay Ganesh Electrical
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full w-9 h-9 p-0"
                  >
                    <X size={18} />
                  </Button>
                </div>

                {/* Status Message */}
                <AnimatePresence mode="wait">
                  {status?.error && (
                    <motion.div
                      key="modal-error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2"
                    >
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{status.error}</span>
                    </motion.div>
                  )}

                  {status?.success && (
                    <motion.div
                      key="modal-success"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2"
                    >
                      <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                      <span>{status.success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User size={16} />
                          </div>
                          <input
                            name="fullName"
                            type="text"
                            required
                            placeholder="Hardik Parmar"
                            className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-gold outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Phone size={16} />
                          </div>
                          <input
                            name="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-gold outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-gold outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/70 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-gold outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isPending}
                      variant="primary"
                      className="w-full h-11 rounded-2xl text-sm font-semibold gap-2"
                    >
                      {isPending ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>{isLogin ? "Signing in..." : "Registering..."}</span>
                        </>
                      ) : (
                        <span>{isLogin ? "Sign In" : "Create Account"}</span>
                      )}
                    </Button>
                  </div>
                </form>

                {/* Footer Switch */}
                <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setStatus(null);
                    }}
                    className="font-semibold text-brand-gold hover:underline ml-1"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
