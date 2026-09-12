import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminImageManagerClient } from "@/components/AdminImageManagerClient";

export const metadata = {
  title: "Inventory Image Manager | Admin Control Center",
  description: "Rapidly upload and manage catalog product images via drag-and-drop.",
};

export default async function AdminImageManagerPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/customer/dashboard");
  }

  // Fetch all items from catalog_items
  const { data: catalogItems, error } = await supabase
    .from("catalog_items")
    .select("id, name, category, price, description, image_url, is_active, created_at")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  return (
    <AdminImageManagerClient
      initialItems={catalogItems || []}
      adminEmail={user.email}
    />
  );
}
