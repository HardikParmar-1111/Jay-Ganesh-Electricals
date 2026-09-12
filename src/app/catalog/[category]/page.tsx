import React from "react";
import { createClient } from "@/utils/supabase/server";
import { slugToCategory, mapDbItemToProduct } from "@/utils/catalog";
import { CategoryGridClient } from "@/components/CategoryGridClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = slugToCategory(category);

  return {
    title: `${categoryName} | Jay Ganesh Electrical Catalog`,
    description: `Browse certified ${categoryName.toLowerCase()} - switches, protection gear, and power distribution hardware with contractor specifications.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryName = slugToCategory(category);
  const normalizedTarget = categoryName.toLowerCase().replace(/[^a-z0-9]/g, "");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error querying catalog items for ${categoryName}:`, error);
  }

  const allLiveProducts = (data || []).map(mapDbItemToProduct);

  const products =
    normalizedTarget === "all"
      ? allLiveProducts
      : allLiveProducts.filter((p) => {
          const pCategoryNorm = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          return pCategoryNorm === normalizedTarget;
        });

  return (
    <CategoryGridClient
      categoryName={categoryName}
      categorySlug={category}
      initialProducts={products}
    />
  );
}
