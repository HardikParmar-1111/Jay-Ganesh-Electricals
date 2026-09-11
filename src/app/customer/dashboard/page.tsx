import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CustomerDashboardClient } from "@/components/CustomerDashboardClient";

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

  return (
    <CustomerDashboardClient
      user={{ id: user.id, email: user.email }}
      profile={profile || null}
      leads={leads || []}
      projects={projects || []}
    />
  );
}
