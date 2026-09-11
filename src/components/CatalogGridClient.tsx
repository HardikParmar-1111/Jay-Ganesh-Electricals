"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Filter, ArrowUpRight, ShieldCheck, Zap, Sliders, Eye } from "lucide-react";
import { MotionCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductBottomSheet } from "@/components/ProductBottomSheet";
import { CATEGORIES, FEATURED_CATEGORIES, Product, ProductCategory } from "@/data/products";
import { categoryToSlug } from "@/utils/catalog-slugs";

interface CatalogGridClientProps {
  initialProducts: Product[];
}

export function CatalogGridClient({ initialProducts }: CatalogGridClientProps) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      (product.brand && product.brand.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Header section with category cards */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-gold/10 text-brand-gold mb-2 border border-brand-gold/20">
                <ShieldCheck size={14} /> Contractor & Retail Supply Catalog
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 dark:text-white">
                Electrical Catalog & Hardware
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mt-1">
                Explore architectural switches, industrial switchgears, and power accessories with verified contracting specifications and reference estimates.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, ratings, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-gold rounded-xl focus:ring-2 focus:ring-brand-gold outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* =============================================================== */}
          {/* FEATURED CATEGORY CARDS */}
          {/* =============================================================== */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Featured Categories</span>
              <span>Click to open dedicated category view</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {FEATURED_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/catalog/${cat.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-brand-gold/50 flex flex-col justify-between"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/50">
                      {cat.highlight}
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">
                        {cat.tagline}
                      </span>
                      <h3 className="text-xl font-heading font-bold text-white flex items-center justify-between">
                        {cat.name}
                        <ArrowUpRight
                          size={18}
                          className="text-white/70 group-hover:text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-xs">
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-1 flex-1 pr-2">
                      {cat.description}
                    </p>
                    <span className="font-semibold text-brand-blue dark:text-brand-gold whitespace-nowrap">
                      Browse Category →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-block">
              Filter:
            </span>
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeCategory === "All" && searchQuery === "" ? (
          // Grouped View
          CATEGORIES.filter((cat) => cat !== "All").map((category) => {
            const categoryProducts = filteredProducts.filter(
              (p) => p.category === category
            );
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category} className="mb-16">
                <div className="flex items-end justify-between mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      {category}
                      <Badge variant="neutral" className="font-normal text-xs">
                        {categoryProducts.length} Items
                      </Badge>
                    </h2>
                  </div>
                  <Link
                    href={`/catalog/${categoryToSlug(category)}`}
                    className="text-sm font-medium text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center gap-1 mb-1 hidden sm:flex"
                  >
                    View All <ArrowUpRight size={16} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {categoryProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      onQuickView={setSelectedProduct}
                    />
                  ))}
                </div>
                <div className="mt-6 text-center sm:hidden">
                  <Link
                    href={`/catalog/${categoryToSlug(category)}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-gold"
                  >
                    View All {category} <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          // Filtered Grid View
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={setSelectedProduct}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Filter size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">
              No products found
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Try adjusting your search query or select another category filter.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <ProductBottomSheet
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

function ProductCard({ product, index, onQuickView }: { product: Product; index: number; onQuickView: (product: Product) => void }) {
  const productCategorySlug = categoryToSlug(product.category);
  const detailHref = `/catalog/${productCategorySlug}/${product.id}`;

  return (
    <div className="group relative flex flex-col">
      <MotionCard
        interactive
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.35 }}
        className="h-full flex flex-col justify-between overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-brand-gold/50 dark:hover:border-brand-gold/50 transition-all shadow-sm hover:shadow-md"
      >
        <Link href={detailHref} className="block flex-1 focus:outline-none">
          <div className="aspect-square w-full bg-white dark:bg-slate-900 relative overflow-hidden p-3 flex items-center justify-center border-b border-slate-100 dark:border-slate-800/60">
            <img
              src={product.image || "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop"}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800">
              {product.brand || product.category}
            </div>
          </div>

          <div className="p-3 space-y-1">
            <div className="text-[10px] font-medium text-brand-gold uppercase tracking-wider">
              {product.category}
            </div>
            <h3 className="font-heading font-medium text-slate-900 dark:text-white line-clamp-1 text-sm group-hover:text-brand-gold transition-colors">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                {product.description}
              </p>
            )}
          </div>
        </Link>

        <div className="p-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase font-semibold text-slate-400 block leading-tight">
              Ref Rate
            </span>
            <span className="font-heading font-semibold text-slate-900 dark:text-white text-sm leading-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Quick preview"
            >
              <Eye size={14} />
            </button>

            <Link
              href={detailHref}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-slate-950 transition-colors flex items-center"
            >
              Details
            </Link>
          </div>
        </div>
      </MotionCard>
    </div>
  );
}
