import { getCatalogProducts } from "@/utils/catalog";
import { CatalogGridClient } from "@/components/CatalogGridClient";

export const metadata = {
  title: "Product Catalog | Jay Ganesh Electrical",
  description: "Browse high-grade electrical switches, switchgears, power accessories, and industrial hardware.",
};

export default async function CatalogPage() {
  const products = await getCatalogProducts();

  return <CatalogGridClient initialProducts={products} />;
}
