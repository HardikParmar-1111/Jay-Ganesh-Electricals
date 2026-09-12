"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  ArrowLeft,
  Sparkles,
  Layers,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Eye,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { updateCatalogItemImage } from "@/app/admin/actions";

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
}

interface AdminImageManagerClientProps {
  initialItems: CatalogItem[];
  adminEmail?: string;
}

export function AdminImageManagerClient({
  initialItems,
  adminEmail,
}: AdminImageManagerClientProps) {
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [missingOnly, setMissingOnly] = useState<boolean>(false);
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  // Derived metrics
  const totalCount = items.length;
  const withImageCount = items.filter(
    (i) => i.image_url && i.image_url.trim().length > 0
  ).length;
  const missingCount = totalCount - withImageCount;
  const coveragePercent = totalCount > 0 ? Math.round((withImageCount / totalCount) * 100) : 0;

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const hasImage = Boolean(item.image_url && item.image_url.trim().length > 0);
      const matchesMissing = missingOnly ? !hasImage : true;

      return matchesSearch && matchesCategory && matchesMissing;
    });
  }, [items, searchQuery, selectedCategory, missingOnly]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleUploadFile = async (file: File, itemId: string, itemName: string) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP).", "error");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image size must be under 10MB.", "error");
      return;
    }

    setUploadingItemId(itemId);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const cleanFileName = `item_${itemId}_${Date.now()}.${fileExt}`;
      const filePath = `items/${cleanFileName}`;

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("catalog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Failed to upload image to storage.");
      }

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("catalog-images")
        .getPublicUrl(uploadData.path);

      const publicUrl = publicUrlData.publicUrl;

      // 3. Update Database Record
      const result = await updateCatalogItemImage(itemId, publicUrl);

      if (result.error) {
        throw new Error(result.error);
      }

      // 4. Update Local State Instantly
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, image_url: publicUrl } : item
        )
      );

      showToast(`Photo updated for "${itemName}"!`, "success");
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(err.message || "Failed to upload and save photo.", "error");
    } finally {
      setUploadingItemId(null);
      setDragOverItemId(null);
    }
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverItemId !== itemId) {
      setDragOverItemId(itemId);
    }
  };

  const handleDragLeave = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverItemId === itemId) {
      setDragOverItemId(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    itemId: string,
    itemName: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItemId(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUploadFile(file, itemId, itemName);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-24 pt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={14} /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-zinc-900 dark:text-white">
              Inventory Image Manager
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-0.5">
              Drag and drop product photos to instantly sync with Supabase Storage and your catalog database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/catalog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out active:scale-95"
            >
              <span>View Public Catalog</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Floating Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              className={`p-4 rounded-2xl border flex items-center justify-between shadow-lg text-sm ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === "success" ? (
                  <CheckCircle2 size={18} className="shrink-0" />
                ) : (
                  <AlertCircle size={18} className="shrink-0" />
                )}
                <span className="font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-xs opacity-75 hover:opacity-100 ml-4 font-semibold"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Total Catalog Items
            </span>
            <span className="text-2xl font-heading font-bold text-zinc-900 dark:text-white">
              {totalCount}
            </span>
          </Card>

          <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Items With Photos
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-emerald-600 dark:text-emerald-400">
                {withImageCount}
              </span>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {coveragePercent}%
              </span>
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Missing Photos
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-amber-600 dark:text-amber-400">
                {missingCount}
              </span>
              {missingCount > 0 && (
                <button
                  onClick={() => setMissingOnly(true)}
                  className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  Show Missing →
                </button>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
              Photo Coverage Progress
            </span>
            <div className="space-y-1.5">
              <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${coveragePercent}%` }}
                />
              </div>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block text-right">
                {withImageCount} of {totalCount} completed
              </span>
            </div>
          </Card>
        </div>

        {/* Toolbar & Filters */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-zinc-900 dark:text-white"
            />
          </div>

          {/* Filters & Toggles */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-zinc-500 hidden sm:inline">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-zinc-800 dark:text-zinc-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Missing Photos Only Toggle */}
            <button
              type="button"
              onClick={() => setMissingOnly(!missingOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-in-out active:scale-95 flex items-center gap-1.5 border ${
                missingOnly
                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm"
                  : "bg-zinc-50 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-100"
              }`}
            >
              <AlertCircle size={14} />
              <span>Missing Photos Only ({missingCount})</span>
            </button>

            {/* Reset Filters */}
            {(selectedCategory !== "All" || missingOnly || searchQuery !== "") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setMissingOnly(false);
                  setSearchQuery("");
                }}
                className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Products List & Drag-and-Drop Zones */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span>Showing {filteredItems.length} Products</span>
            <span>Drag photo directly onto item or click Browse</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <ImageIcon size={44} className="mx-auto text-zinc-300 dark:text-zinc-700" />
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                No items match your criteria
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try resetting your search query, or unchecking "Missing Photos Only" to view all inventory.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setMissingOnly(false);
                  setSearchQuery("");
                }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredItems.map((item) => {
                const isUploading = uploadingItemId === item.id;
                const isDragOver = dragOverItemId === item.id;
                const hasImage = Boolean(item.image_url && item.image_url.trim().length > 0);

                return (
                  <div
                    key={item.id}
                    onDragOver={(e) => handleDragOver(e, item.id)}
                    onDragLeave={(e) => handleDragLeave(e, item.id)}
                    onDrop={(e) => handleDrop(e, item.id, item.name)}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
                      isDragOver
                        ? "bg-amber-500/10 border-2 border-dashed border-amber-500 rounded-2xl m-2"
                        : "hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40"
                    }`}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-center gap-4 min-w-0">
                      
                      {/* Image Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 shrink-0 overflow-hidden border border-zinc-200/80 dark:border-zinc-700/80 flex items-center justify-center group shadow-sm">
                        {isUploading ? (
                          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
                            <Loader2 size={22} className="animate-spin text-amber-500 mb-1" />
                            <span className="text-[9px] font-semibold uppercase tracking-wider">
                              Uploading...
                            </span>
                          </div>
                        ) : hasImage ? (
                          <>
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <a
                              href={item.image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                              title="View full image"
                            >
                              <Eye size={16} />
                            </a>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center text-zinc-400 p-2 text-center">
                            <ImageIcon size={20} className="mb-0.5 opacity-60" />
                            <span className="text-[9px] font-medium leading-none">No Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral" className="text-[10px] px-2 py-0.5">
                            {item.category}
                          </Badge>
                          {hasImage ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <Check size={13} /> Photo Linked
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                              <AlertCircle size={13} /> Needs Photo
                            </span>
                          )}
                        </div>

                        <h4 className="text-base sm:text-lg font-heading font-bold tracking-tight text-zinc-900 dark:text-white truncate">
                          {item.name}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                          {item.description && (
                            <span className="truncate max-w-xs sm:max-w-md">
                              • {item.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Drag-and-Drop Zone & Upload Action */}
                    <div className="flex items-center gap-3 shrink-0">
                      
                      {/* Drag target indicator box */}
                      <div
                        className={`hidden lg:flex items-center justify-center px-4 py-2.5 rounded-2xl border text-xs font-medium transition-all ${
                          isDragOver
                            ? "bg-amber-500 text-slate-950 font-semibold border-amber-500 scale-105"
                            : "border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 text-zinc-500"
                        }`}
                      >
                        <UploadCloud size={16} className="mr-2" />
                        <span>Drop image file here</span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id={`file-input-${item.id}`}
                        accept="image/*"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadFile(file, item.id, item.name);
                          }
                          // Reset value so same file can be chosen again if needed
                          e.target.value = "";
                        }}
                        className="hidden"
                      />

                      {/* Trigger Button */}
                      <label
                        htmlFor={`file-input-${item.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all duration-300 ease-in-out active:scale-95 shadow-sm ${
                          isUploading
                            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                            : hasImage
                            ? "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                            : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} />
                            <span>{hasImage ? "Replace Photo" : "Upload Photo"}</span>
                          </>
                        )}
                      </label>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
