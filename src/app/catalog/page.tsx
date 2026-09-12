import { createClient } from "@/utils/supabase/server";
import { mapDbItemToProduct } from "@/utils/catalog";
import { CatalogGridClient } from "@/components/CatalogGridClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Product Catalog | Jay Ganesh Electrical",
  description: "Browse high-grade electrical switches, switchgears, power accessories, and industrial hardware.",
};

export default async function CatalogPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error querying live catalog_items:", error);
  }

  const products = (data || []).map(mapDbItemToProduct);

  return <CatalogGridClient initialProducts={products} />;
}
