"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PackagePlus,
  Link2,
} from "lucide-react";
import { Button } from "./ui/Button";
import { createClient } from "@/utils/supabase/client";
import { createCatalogItem } from "@/app/admin/actions";

export const ELECTRICAL_CATEGORIES = [
  "Modular Switches",
  "Non-Modular Switches",
  "Boxes & Enclosures",
  "Switchgears",
  "Power Accessories",
  "Wires",
  "Fans",
  "Coolers",
  "Water Geysers",
  "Irons",
] as const;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProduct: any) => void;
}

export function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Modular Switches");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName("");
    setCategory("Modular Switches");
    setPrice("");
    setDescription("");
    setImageUrl("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUploadingImage(false);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side file size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image file must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setErrorMessage(null);
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    setIsUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const cleanFileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;
      const filePath = `items/${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from("catalog-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.warn("Storage upload notice:", error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("catalog-images")
        .getPublicUrl(data.path);

      return publicUrlData.publicUrl;
    } catch (err: any) {
      console.warn("Storage upload exception:", err);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage("Please enter an item name.");
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage("Please enter a valid price (e.g. 150).");
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl.trim();

      // If a file was selected, upload directly to Supabase storage bucket
      if (selectedFile) {
        const uploadedUrl = await uploadImageToStorage(selectedFile);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          setImageUrl(uploadedUrl);
        } else if (!finalImageUrl) {
          // Fallback notice if storage failed and no manual URL provided
          setErrorMessage(
            "Note: Image bucket upload failed. Please verify the 'catalog-images' bucket exists or paste an Image URL directly."
          );
          setIsSubmitting(false);
          return;
        }
      }

      // Call Server Action to perform INSERT into catalog_items table
      const result = await createCatalogItem({
        name: name.trim(),
        category,
        price: numericPrice,
        description: description.trim(),
        imageUrl: finalImageUrl,
      });

      if (!result.success) {
        setErrorMessage(result.error || "Failed to add product.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Product added to catalog successfully!");
      onSuccess(result.item);

      // Auto-close after brief confirmation
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                <PackagePlus size={20} />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold text-zinc-900 dark:text-white">
                  Add New Product
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Insert electrical hardware into live customer catalog
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Feedback Messages */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-start gap-2"
              >
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* Item Name */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 10AX 1-Way Modular Switch"
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </div>

            {/* Category & Price Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  {ELECTRICAL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 85.00"
                  className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief electrical specs, load capacity, and material details..."
                className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-gold resize-none"
              />
            </div>

            {/* Item Photo: File Picker & URL Fallback */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Item Photo (Supabase Storage Bucket: catalog-images)
              </label>

              {/* Upload Drop Zone / Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-zinc-200 dark:border-zinc-700 hover:border-brand-gold dark:hover:border-brand-gold rounded-2xl p-4 transition-colors flex items-center gap-4 bg-zinc-50/50 dark:bg-zinc-800/30"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {previewUrl || imageUrl ? (
                  <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={previewUrl || imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 border border-zinc-200 dark:border-zinc-700">
                    <ImageIcon size={24} />
                  </div>
                )}

                <div className="flex-1 text-left">
                  <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <Upload size={14} className="text-brand-gold" />
                    {selectedFile ? selectedFile.name : "Choose an image file"}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    PNG, JPG, or WEBP up to 5MB (Uploads to catalog-images bucket)
                  </p>
                </div>
              </div>

              {/* Direct URL input fallback */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Link2 size={14} />
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste an image URL directly (fallback)"
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting || isUploadingImage}
                className="rounded-2xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="rounded-2xl gap-2 text-xs font-semibold px-5 shadow-sm"
              >
                {isSubmitting || isUploadingImage ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>
                      {isUploadingImage ? "Uploading Image..." : "Adding Product..."}
                    </span>
                  </>
                ) : (
                  <>
                    <PackagePlus size={14} />
                    <span>Add Product to Catalog</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
