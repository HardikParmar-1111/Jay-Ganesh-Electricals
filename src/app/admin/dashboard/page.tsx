import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const metadata = {
  title: "Admin Control Center | Jay Ganesh Electrical",
  description: "Live management of contracting leads, active projects, and electrical catalog.",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/customer/dashboard");
  }

  // Run aggregate count queries in parallel
  const [
    { count: totalLeads },
    { count: activeProjects },
    { count: catalogCount },
    { data: leadsData },
    { data: catalogData },
  ] = await Promise.all([
    supabase
      .from("customer_leads")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("portfolio_projects")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("catalog_items")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("customer_leads")
      .select(
        "id, property_size, services_needed, quality_tier, status, created_at, profiles(full_name, phone)"
      )
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("catalog_items")
      .select(
        "id, name, category, price, description, image_url, is_active, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(60),
  ]);

  return (
    <AdminDashboardClient
      adminEmail={user.email}
      metrics={{
        totalLeads: totalLeads || (leadsData?.length ?? 0),
        activeProjects: activeProjects || 0,
        catalogCount: catalogCount || (catalogData?.length ?? 0),
      }}
      initialLeads={(leadsData as any) || []}
      initialCatalogItems={(catalogData as any) || []}
    />
  );
}
