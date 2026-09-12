import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CustomerDashboardClient, SavedSupplyRecord } from "@/components/CustomerDashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "My Account | Jay Ganesh Electrical",
  description: "Track your electrical quotes, active projects, and orders.",
};

export default async function CustomerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch customer profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch customer submitted leads
  const { data: leads } = await supabase
    .from("customer_leads")
    .select("id, property_size, services_needed, quality_tier, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch customer contracted projects
  const { data: projects } = await supabase
    .from("portfolio_projects")
    .select("id, title, description, phase, created_at")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch saved supplies with joined catalog_items
  const { data: savedSupplies, error: savedError } = await supabase
    .from("saved_supplies")
    .select("id, user_id, item_id, created_at, catalog_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (savedError) {
    console.error("Error querying saved_supplies:", savedError);
  }

  return (
    <CustomerDashboardClient
      user={{ id: user.id, email: user.email }}
      profile={profile || null}
      leads={leads || []}
      projects={projects || []}
      savedSupplies={(savedSupplies as unknown as SavedSupplyRecord[]) || []}
    />
  );
}
