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

  // Check if product is in saved supplies
  useEffect(() => {
    let isMounted = true;
    async function checkSavedStatus() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || !isMounted) return;

        const { data, error } = await supabase
          .from("saved_supplies")
          .select("id")
          .eq("user_id", user.id)
          .eq("item_id", product.id)
          .maybeSingle();

        if (!error && data && isMounted) {
          setIsSaved(true);
        }
      } catch (err) {
        console.error("Failed to check saved status:", err);
      }
    }
    checkSavedStatus();
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

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Top Breadcrumb Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 overflow-x-auto hide-scrollbar">
            <Link
              href="/catalog"
              className="hover:text-brand-blue dark:hover:text-white transition-colors whitespace-nowrap"
            >
              Catalog
            </Link>
            <ChevronRight size={14} className="flex-shrink-0 text-slate-400" />
            <Link
              href={`/catalog/${categorySlug}`}
              className="hover:text-brand-blue dark:hover:text-white transition-colors whitespace-nowrap"
            >
              {product.category}
            </Link>
            <ChevronRight size={14} className="flex-shrink-0 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium truncate max-w-[160px] sm:max-w-none">
              {product.name}
            </span>
          </nav>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleToggleSave}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all active:scale-95 ${
                isSaved
                  ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title={isSaved ? "Saved to your supplies" : "Save this supply"}
            >
              <Bookmark
                size={14}
                className={isSaved ? "fill-amber-500 text-amber-600 dark:fill-amber-400 dark:text-amber-400" : ""}
              />
              <span>{isSaved ? "Saved to Supplies" : "Save Supply"}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Share product link"
            >
              {copied ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
              <span>{copied ? "Link Copied" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main PDP Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: Large Main Image + Thumbnail Gallery */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] sm:aspect-square bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center justify-center p-6 group">
              <img
                src={images[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />

              {/* Status and Category Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 mt-2 max-w-[calc(100%-110px)]">
                <Badge variant="brand">{product.category}</Badge>
                {product.inStock && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 size={13} /> Tested & Ready for Supply
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-800">
                  {product.brand}
                </div>
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-95 shadow-sm border ${
                    isSaved
                      ? "bg-amber-500 text-white border-amber-600 shadow-amber-500/20"
                      : "bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 border-slate-200 dark:border-slate-800"
                  }`}
                  title={isSaved ? "Saved to your supplies" : "Save this supply"}
                >
                  <Bookmark
                    size={16}
                    className={isSaved ? "fill-white text-white" : ""}
                  />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery Below */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>Views & Angles ({images.length})</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">Click to preview</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-900 border-2 transition-all p-1.5 ${activeImageIndex === idx
                        ? "border-brand-gold shadow-md ring-2 ring-brand-gold/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-80 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} angle ${idx + 1}`}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quality & Contracting Trust Card */}
            <div className="mt-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 via-blue-500/5 to-transparent border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    IS/IEC Certified Quality
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sourced directly from authorized distributors for contracting compliance.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue dark:text-brand-gold whitespace-nowrap">
                <Clock size={15} /> Prompt Site Dispatch
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: Details, Specifications, Pricing, Request Quote */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 text-sm text-brand-blue dark:text-brand-gold font-medium mb-1">
                <span>{product.brand}</span>
                <span>•</span>
                <span>Commercial Grade</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Reference Price & Estimation Notice */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Reference Unit Rate
                  </span>
                  <div className="text-3xl font-heading font-bold text-slate-900 dark:text-white mt-0.5">
                    ₹{product.price.toLocaleString("en-IN")}
                    <span className="text-xs font-normal text-slate-500 ml-1.5">/ piece (approx)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    GST Extra / Bulk Rate
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                *Wholesale and contracting discounts apply based on bill-of-quantities (BOQ).
              </p>
            </div>

            {/* Color / Variant Selector (Mock) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">
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
                    className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${selectedFinish === variant.name
                        ? "border-brand-gold bg-brand-gold/5 dark:bg-brand-gold/10 text-slate-900 dark:text-white ring-1 ring-brand-gold"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                      }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full border ${variant.class} ${variant.border ? "border-slate-300 dark:border-slate-500" : ""
                        }`}
                    />
                    <span>{variant.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button: "Request Quote" + "Save Supply" */}
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    setShowQuoteModal(true);
                    setQuoteSubmitted(false);
                  }}
                  className="flex-1 py-4 text-base font-semibold shadow-lg shadow-brand-gold/20 flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  Request Project Quote / Inquire
                </Button>
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`h-12 sm:h-14 px-4 sm:px-5 rounded-xl border flex items-center justify-center gap-2 font-medium text-sm transition-all active:scale-95 flex-shrink-0 ${
                    isSaved
                      ? "bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400 font-semibold shadow-sm"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 dark:hover:border-amber-500/40 hover:bg-amber-50/50 dark:hover:bg-amber-500/5"
                  }`}
                  title={isSaved ? "Saved to your supplies" : "Save to Supplies"}
                >
                  <Bookmark
                    size={19}
                    className={isSaved ? "fill-amber-500 text-amber-600 dark:fill-amber-400 dark:text-amber-400" : "text-slate-400"}
                  />
                  <span className="font-semibold text-sm">
                    {isSaved ? "Saved" : "Save Supply"}
                  </span>
                </button>
              </div>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                Need bulk supply or complete wiring project quotation? Contact our engineering desk.
              </p>
            </div>

            {/* Description Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Product Overview
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Specifications Accordion / Structured Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <button
                type="button"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders size={18} className="text-brand-gold" />
                  <h3 className="font-heading font-semibold text-slate-900 dark:text-white text-base">
                    Technical Specifications
                  </h3>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-200 ${isAccordionOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {isAccordionOpen && (
                <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-3">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <div
                        key={key}
                        className={`py-2.5 flex items-center justify-between text-xs sm:text-sm ${idx % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/20 px-2 rounded-lg" : "px-2"
                          }`}
                      >
                        <span className="font-medium text-slate-500 dark:text-slate-400">{key}</span>
                        <span className="font-semibold text-slate-900 dark:text-white text-right">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

            {!quoteSubmitted ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white">
                      Request Material Quote
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Jay Ganesh Electrical Contractor & Wholesale Desk
                    </p>
                  </div>
                </div>

                <div className="p-3 mb-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-slate-900 p-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Finish: <span className="font-medium text-brand-gold">{selectedFinish}</span> • Ref: ₹{product.price}
                    </p>
                  </div>
                </div>

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

                  <Button variant="primary" size="lg" type="submit" className="w-full py-3">
                    Submit Quotation Inquiry
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                  Thank you, <span className="font-semibold">{quoteForm.name}</span>. Our technical contractor will contact you at <span className="font-semibold text-brand-gold">{quoteForm.phone}</span> with the bill-of-quantities estimate for <span className="font-semibold">{product.name}</span>.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setShowQuoteModal(false)}
                  className="w-full"
                >
                  Close & Continue Browsing
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
