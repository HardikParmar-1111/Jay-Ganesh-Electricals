"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Product } from "@/data/products";
import Link from "next/link";
import { categoryToSlug } from "@/utils/catalog-slugs";
import { ArrowRight, FileText } from "lucide-react";

interface ProductBottomSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductBottomSheet({ product, isOpen, onClose }: ProductBottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.y > 100 || velocity.y > 500) {
                  onClose();
                }
              }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-2xl border-t border-slate-200 dark:border-slate-800 pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>

              {/* Content area - scrollable */}
              <div className="overflow-y-auto px-6 pb-24 sm:px-8 hide-scrollbar">
                
                {/* Header actions */}
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="brand">{product.category}</Badge>
                  <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full bg-slate-100 dark:bg-slate-800">
                    <X size={20} />
                  </Button>
                </div>

                {/* Product Image */}
                <div className="w-full h-64 sm:h-80 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="mb-6">
                  <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-slate-500 font-medium">{product.brand}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    {product.inStock ? (
                      <span className="text-green-600 dark:text-green-400 font-medium text-sm">In Stock</span>
                    ) : (
                      <span className="text-red-500 font-medium text-sm">Out of Stock</span>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-brand-gold">
                    ₹{product.price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {product.description}
                  </p>
                </div>

                {/* Specifications */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3">Specifications</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 divide-y divide-slate-200 dark:divide-slate-700">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="py-3 flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">{key}</span>
                        <span className="font-medium text-slate-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Fixed Bottom Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex gap-3">
                <Link
                  href={`/catalog/${categoryToSlug(product.category)}/${product.id}`}
                  onClick={onClose}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-brand-gold text-slate-950 font-semibold text-sm hover:opacity-95 shadow-md shadow-brand-gold/20 transition-all"
                >
                  <FileText size={16} /> View Full Specifications & Quote <ArrowRight size={16} />
                </Link>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
