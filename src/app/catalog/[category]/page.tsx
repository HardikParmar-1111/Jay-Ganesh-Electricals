import React from "react";
import { slugToCategory, getProductsByCategory } from "@/utils/catalog";
import { CategoryGridClient } from "@/components/CategoryGridClient";

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
  const products = await getProductsByCategory(categoryName);

  return (
    <CategoryGridClient
      categoryName={categoryName}
      categorySlug={category}
      initialProducts={products}
    />
  );
}
