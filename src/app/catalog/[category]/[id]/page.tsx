import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, slugToCategory, categoryToSlug } from "@/utils/catalog";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ProductPageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { category: categorySlug, id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Jay Ganesh Electrical",
      description: "The requested electrical hardware item could not be found.",
    };
  }

  return {
    title: `${product.name} - ${product.category} | Jay Ganesh Electrical`,
    description: `${product.description} Verified specifications, wholesale pricing, and contracting estimates for ${product.name}.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { category: categorySlug, id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-slate-500 max-w-md mb-6">
          The electrical supply item you are looking for may have been updated or moved.
        </p>
        <Link href="/catalog">
          <Button variant="primary" className="gap-2">
            <ArrowLeft size={16} /> Return to Product Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <ProductDetailClient
      product={product}
      categorySlug={categorySlug || categoryToSlug(product.category)}
    />
  );
}
