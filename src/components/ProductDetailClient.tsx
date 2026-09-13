"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  Sliders,
  ChevronDown,
  Layers,
  Bookmark,
  AlertCircle,
  Loader2,
  LogIn,
} from "lucide-react";
import { Product } from "@/data/products";
import { categoryToSlug } from "@/utils/catalog-slugs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

interface ProductDetailClientProps {
  product: Product;
  categorySlug: string;
}

const FINISH_VARIANTS = [
  { name: "Arctic White", class: "bg-white border-slate-300 dark:border-slate-600", border: true },
  { name: "Matte Anthracite", class: "bg-zinc-800 border-zinc-700", border: false },
  { name: "Brushed Silver", class: "bg-slate-300 border-slate-400", border: false },
  { name: "Champagne Gold", class: "bg-amber-100 border-amber-300", border: false },
];

export function ProductDetailClient({ product, categorySlug }: ProductDetailClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image, product.image, product.image];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(FINISH_VARIANTS[0].name);
  const [activeTab, setActiveTab] = useState<"specs" | "overview">("specs");
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for Request Quote
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    phone: "",
    quantity: "10 units",
    notes: "",
  });

  // Check auth user, profile, and saved status
  useEffect(() => {
    let isMounted = true;
    async function loadUserData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !isMounted) return;

        setCurrentUser(user);

        // Fetch saved status
        const { data: savedData } = await supabase
          .from("saved_supplies")
          .select("id")
          .eq("user_id", user.id)
          .eq("item_id", product.id)
          .maybeSingle();

        if (savedData && isMounted) {
          setIsSaved(true);
        }

        // Fetch profile to prefill form
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (profile && isMounted) {
          setQuoteForm((prev) => ({
            ...prev,
            name: prev.name || profile.full_name || user.user_metadata?.full_name || "",
            phone: prev.phone || profile.phone || "",
          }));
        }
      } catch (err) {
        console.error("Failed to check user/saved status:", err);
      }
    }
    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [product.id, supabase]);

  const handleToggleSave = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const nextSaved = !isSaved;
      setIsSaved(nextSaved);

      if (nextSaved) {
        const { error } = await supabase.from("saved_supplies").insert({
          user_id: user.id,
          item_id: product.id,
        });
        if (error) {
          console.error("Error saving supply:", error);
          setIsSaved(false);
        } else {
          router.refresh();
        }
      } else {
        const { error } = await supabase
          .from("saved_supplies")
          .delete()
          .eq("user_id", user.id)
          .eq("item_id", product.id);
        if (error) {
          console.error("Error removing saved supply:", error);
          setIsSaved(true);
        } else {
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Error toggling saved supply:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDummyName =
    !product.name ||
    product.name.trim().length < 3 ||
    /^(test|dummy|gvjjg|asdf|qwerty)/i.test(product.name.trim());
  const displayName = isDummyName ? "Premium Modular Switch (3-Gang)" : product.name;

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingQuote) return;

    setIsSubmittingQuote(true);
    setQuoteError(null);

    try {
      // 1. Get current authenticated user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // Redirect to login if user is not authenticated
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // 2. Real Database Insertion into customer_leads
      // Try inserting with item_id as specified
      let insertError: any = null;
      const primaryPayload = {
        user_id: user.id,
        item_id: product.id,
        property_size: quoteForm.quantity || "10 units",
        services_needed: `Product Request: ${displayName} (${selectedFinish})`,
        quality_tier: quoteForm.notes
          ? `${quoteForm.notes} | Ref: ₹${product.price}`
          : `Catalog Inquire | Ref: ₹${product.price}`,
        status: "new",
      };

      const primaryRes = await supabase.from("customer_leads").insert(primaryPayload);
      insertError = primaryRes.error;

      // Graceful fallback if item_id column is not yet present on remote table
      if (insertError && (insertError.code === "42703" || insertError.message?.includes("item_id"))) {
        console.warn(
          "customer_leads.item_id column not found in database, falling back without item_id column",
          insertError
        );
        const fallbackPayload = {
          user_id: user.id,
          property_size: quoteForm.quantity || "10 units",
          services_needed: `Product Request: ${displayName} (Item ID: ${product.id}, Finish: ${selectedFinish})`,
          quality_tier: quoteForm.notes
            ? `${quoteForm.notes} | Ref: ₹${product.price}`
            : `Catalog Inquire | Ref: ₹${product.price}`,
          status: "new",
        };
        const fallbackRes = await supabase.from("customer_leads").insert(fallbackPayload);
        insertError = fallbackRes.error;
      }

      if (insertError) {
        throw new Error(insertError.message || "Failed to send request. Please try again.");
      }

      // Proactively update user profile with full name and phone if provided
      if (quoteForm.name || quoteForm.phone) {
        await supabase
          .from("profiles")
          .update({
            ...(quoteForm.name ? { full_name: quoteForm.name } : {}),
            ...(quoteForm.phone ? { phone: quoteForm.phone } : {}),
          })
          .eq("id", user.id);
      }

      // 3. Authentic Success State:
      // ONLY show the success toast/message if the Supabase request completes without errors.
      setQuoteSubmitted(true);
    } catch (err: any) {
      console.error("Supabase request error:", err);
      setQuoteError(err?.message || "Failed to send request. Please try again.");
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-24">
      {/* Top Header Section */}
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 overflow-x-auto hide-scrollbar">
            <Link
              href="/catalog"
              className="hover:text-brand-blue dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Catalog
            </Link>
            <ChevronRight size={14} className="flex-shrink-0 text-zinc-400" />
            <Link
              href={`/catalog/${categorySlug}`}
              className="hover:text-brand-blue dark:hover:text-white transition-colors whitespace-nowrap"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} className="flex-shrink-0 text-zinc-400" />
            <span className="text-zinc-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-none">
              {displayName}
            </span>
          </nav>

          {/* Title & Actions Row (Stacked vertically on mobile, side-by-side on sm) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white text-left tracking-tight">
              {displayName}
            </h1>

            {/* Side-by-side action buttons: Share and Save Supply with equal weight */}
            <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleShare}
                className="h-11 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-2 text-sm font-medium transition-all active:scale-95 shadow-sm"
              >
                {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} className="text-zinc-500" />}
                <span>{copied ? "Link Copied" : "Share"}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleSave}
                className={`h-11 px-5 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all active:scale-95 shadow-sm ${
                  isSaved
                    ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 font-semibold"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <Bookmark
                  size={16}
                  className={isSaved ? "fill-amber-500 text-amber-600 dark:fill-amber-400 dark:text-amber-400" : "text-zinc-500"}
                />
                <span>{isSaved ? "Saved" : "Save Supply"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main PDP Container with clean p-4 to p-6 padding */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: Clean Image Card + Meta Tags Below + Angles */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Image - Clean neutral zinc background, aspect-square, no floating badges */}
            <div className="relative aspect-square bg-zinc-50 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex items-center justify-center p-6 sm:p-8 group">
              <img
                src={images[activeImageIndex] || product.image}
                alt={displayName}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Dedicated Meta-Info Section Below Photo */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                {product.category}
              </span>
              {product.inStock && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 size={13} /> Tested & Ready for Supply
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-800">
                {product.brand}
              </span>
            </div>

            {/* Thumbnail Gallery Below */}
            {images.length > 1 && (
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 px-1">
                  <span>Views & Angles ({images.length})</span>
                  <span className="font-medium text-zinc-600 dark:text-zinc-300">Click to preview</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 border transition-all p-1.5 ${
                        activeImageIndex === idx
                          ? "border-brand-gold shadow-sm ring-2 ring-brand-gold/20"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${displayName} angle ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Reference Price, Finish, Request Quote, Specs */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Reference Unit Rate */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">
                    Reference Unit Rate
                  </span>
                  <div className="text-3xl font-heading font-bold text-zinc-900 dark:text-white mt-0.5">
                    ₹{product.price.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-zinc-500 ml-1.5">/ piece (approx)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    GST Extra / Bulk Rate
                  </span>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-2">
                *Wholesale and contracting discounts apply based on bill-of-quantities (BOQ).
              </p>
            </div>

            {/* Color / Variant Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-zinc-900 dark:text-white">
                  Finish & Trim:
                </span>
                <span className="text-xs text-brand-blue dark:text-brand-gold font-medium">
                  {selectedFinish}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {FINISH_VARIANTS.map((variant) => (
                  <button
                    key={variant.name}
                    type="button"
                    onClick={() => setSelectedFinish(variant.name)}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedFinish === variant.name
                        ? "border-brand-gold bg-brand-gold/5 dark:bg-brand-gold/10 text-zinc-900 dark:text-white ring-1 ring-brand-gold"
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border ${variant.class} ${
                        variant.border ? "border-zinc-300 dark:border-zinc-500" : ""
                      }`}
                    />
                    <span>{variant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button: "Request Item" */}
            <div>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  setShowQuoteModal(true);
                  setQuoteSubmitted(false);
                  setQuoteError(null);
                }}
                className="w-full py-4 text-base font-semibold shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2 rounded-2xl"
              >
                <FileText size={18} />
                Request Item / Project Quote
              </Button>
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                Need bulk supply or project quotation? Submit a request directly to our engineering desk.
              </p>
            </div>

            {/* Product Overview */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                Product Overview
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Accordion */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
              <button
                type="button"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders size={18} className="text-brand-gold" />
                  <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-base">
                    Technical Specifications
                  </h3>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-zinc-400 transition-transform duration-200 ${
                    isAccordionOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAccordionOpen && (
                <div className="border-t border-zinc-200 dark:border-zinc-800 px-5 py-3">
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div
                        key={key}
                        className="py-2.5 flex items-center justify-between text-xs sm:text-sm"
                      >
                        <span className="text-zinc-500 dark:text-zinc-400">{key}</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sourced Quality Badge */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={16} className="text-brand-gold flex-shrink-0" />
                <span>IS/IEC Certified Quality</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-brand-blue dark:text-brand-gold whitespace-nowrap">
                <Clock size={14} /> Prompt Dispatch
              </div>
            </div>

            {/* Back to Category Link */}
            <div className="pt-2">
              <Link
                href={`/catalog/${categorySlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue dark:text-brand-gold hover:underline"
              >
                <ArrowLeft size={16} /> Back to all {product.category}
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* ================================================================= */}
      {/* QUOTE INQUIRY MODAL */}
      {/* ================================================================= */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              ✕
            </button>

            {!currentUser ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-brand-gold mx-auto flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-800/60 shadow-sm">
                  <LogIn size={28} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                  Sign In to Request Item
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                  Please sign in to send quote inquiries, save supplies, and track your material orders in real-time.
                </p>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() =>
                      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
                    }
                    className="w-full py-3"
                  >
                    Sign In to Request Item
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowQuoteModal(false)}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : !quoteSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                      Request Item & Material Quote
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Jay Ganesh Electrical Contractor & Wholesale Desk
                    </p>
                  </div>
                </div>

                <div className="p-3 mb-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={displayName}
                    className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-slate-900 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {displayName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Finish: <span className="font-medium text-brand-gold">{selectedFinish}</span> • Ref: ₹{product.price}
                    </p>
                  </div>
                </div>

                {quoteError && (
                  <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <span className="font-medium">{quoteError}</span>
                  </div>
                )}

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hardik Parmar"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 97249 21890"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Quantity / Scope
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50 units / 3BHK flat electrification"
                      value={quoteForm.quantity}
                      onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Project Location or Additional Details
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Include site location or special requirements..."
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isSubmittingQuote}
                    className="w-full py-3 flex items-center justify-center gap-2 font-semibold"
                  >
                    {isSubmittingQuote ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Submitting to Supabase...
                      </>
                    ) : (
                      "Submit Item Request"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                  Request Saved to Supabase!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Thank you, <span className="font-semibold">{quoteForm.name}</span>. Your request for{" "}
                  <span className="font-semibold">{displayName}</span> has been logged. Our contracting desk will review your specifications and contact you at{" "}
                  <span className="font-semibold text-brand-gold">{quoteForm.phone}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/tracker"
                    className="flex-1 py-3 px-4 rounded-xl bg-brand-blue text-white hover:bg-brand-blue/90 text-sm font-semibold text-center transition-all flex items-center justify-center"
                  >
                    View in Project Tracker
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 py-3"
                  >
                    Continue Browsing
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
