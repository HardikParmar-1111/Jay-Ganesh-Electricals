"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, SlidersHorizontal, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { categoryToSlug } from "@/utils/catalog-slugs";
import { MotionCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface CategoryGridClientProps {
  categoryName: string;
  categorySlug: string;
  initialProducts: Product[];
}

export function CategoryGridClient({
  categoryName,
  categorySlug,
  initialProducts,
}: CategoryGridClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = initialProducts.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Category Header Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/catalog"
              className="hover:text-brand-blue dark:hover:text-white transition-colors"
            >
              Catalog
            </Link>
            <ChevronRight size={14} className="flex-shrink-0 text-slate-400" />
            <span className="text-slate-900 dark:text-white font-medium">
              {categoryName}
            </span>
          </nav>

          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue dark:text-brand-gold hover:underline"
          >
            <ArrowLeft size={14} /> All Categories
          </Link>
        </div>
      </div>

      {/* Hero Banner for Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="brand">{initialProducts.length} Items</Badge>
              <span className="text-xs text-slate-500 font-medium">Verified Contractor Grade</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white">
              {categoryName}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Explore high-performance {categoryName.toLowerCase()} with tested electrical parameters, fire-retardant safety ratings, and contractor estimation pricing.
            </p>
          </div>

          {/* In-category search */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${categoryName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => {
            const productSlug = categoryToSlug(product.category);
            const detailHref = `/catalog/${productSlug}/${product.id}`;

            return (
              <Link key={product.id} href={detailHref} className="group block focus:outline-none">
                <MotionCard
                  interactive
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.3 }}
                  className="h-full flex flex-col justify-between overflow-hidden border border-slate-200 dark:border-slate-800/90 hover:border-brand-gold/50 dark:hover:border-brand-gold/50 transition-all shadow-sm hover:shadow-md group"
                >
                  <div>
                    {/* Image Box */}
                    <div className="aspect-[4/3] bg-white dark:bg-slate-900 relative overflow-hidden p-4 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/60">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800">
                        {product.brand}
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-heading font-semibold text-slate-900 dark:text-white text-base leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      {/* Snippet of specs */}
                      {product.specs && Object.keys(product.specs).length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1">
                          {Object.entries(product.specs)
                            .slice(0, 2)
                            .map(([k, v]) => (
                              <span
                                key={k}
                                className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate max-w-[140px]"
                              >
                                {k}: {v}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Ref Rate
                      </span>
                      <span className="font-heading font-bold text-slate-900 dark:text-white text-lg">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-slate-950 transition-colors">
                      <FileText size={13} /> View Specs
                    </div>
                  </div>
                </MotionCard>
              </Link>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mt-6">
            <SlidersHorizontal size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              No products match "{searchQuery}"
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching for a different electrical rating, switch type, or clear your query.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
