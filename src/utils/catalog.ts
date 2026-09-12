import { createClient } from "@/utils/supabase/server";
import { Product, ProductCategory } from "@/data/products";
import { categoryToSlug, slugToCategory } from "./catalog-slugs";

export { categoryToSlug, slugToCategory };

// Transform raw Supabase catalog row into standard Product type
export function mapDbItemToProduct(item: any): Product {
  const parsedSpecs: Record<string, string> =
    typeof item.specifications === "object" && item.specifications !== null
      ? item.specifications
      : typeof item.specs === "object" && item.specs !== null
      ? item.specs
      : { Type: "Heavy Duty Electrical", Grade: "Contractor Standard" };

  return {
    id: String(item.id),
    name: item.name,
    category: (item.category || "Modular Switches") as ProductCategory,
    price: Number(item.price ?? 0),
    brand: item.brand || "Jay Ganesh",
    image:
      item.image_url ||
      "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
    gallery: item.gallery || [
      item.image_url ||
        "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800&auto=format&fit=crop",
    ],
    specs: parsedSpecs,
    inStock: item.is_active ?? true,
    description: item.description || "Premium electrical hardware and distribution gear.",
  };
}

// Fetch all active products
export async function getCatalogProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error querying catalog_items:", error);
      return [];
    }

    if (data && data.length > 0) {
      return data.map(mapDbItemToProduct);
    }
  } catch (err) {
    console.error("Failed to fetch catalog products from Supabase:", err);
  }

  return [];
}

// Fetch product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const decodedId = decodeURIComponent(id).trim();

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("id", decodedId)
      .maybeSingle();

    if (!error && data) {
      return mapDbItemToProduct(data);
    }
  } catch (err) {
    console.error("Failed to fetch product by id from Supabase:", err);
  }

  return null;
}

// Fetch products by category
export async function getProductsByCategory(categoryName: string): Promise<Product[]> {
  const allProducts = await getCatalogProducts();
  const normalizedTarget = categoryName.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (normalizedTarget === "all") {
    return allProducts;
  }

  return allProducts.filter((p) => {
    const pCategoryNorm = (p.category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    return pCategoryNorm === normalizedTarget;
  });
}
