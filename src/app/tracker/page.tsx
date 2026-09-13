import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ProjectTrackerClient, CustomerLead } from "@/components/ProjectTrackerClient";

export const metadata = {
  title: "Project Tracker | Jay Ganesh Electrical",
  description: "Track live status and milestone progress for your electrical contracting projects.",
};

export default async function TrackerPage() {
  const supabase = await createClient();

  // Securely retrieve the logged-in user's session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Retrieve customer profile information
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  // Query customer_leads table with joined catalog_items for records matching the user's ID
  let leads: any[] = [];
  try {
    const joinedRes = await supabase
      .from("customer_leads")
      .select("*, catalog_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!joinedRes.error && joinedRes.data) {
      leads = joinedRes.data;
    } else {
      const fallbackRes = await supabase
        .from("customer_leads")
        .select("id, property_size, services_needed, quality_tier, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      leads = fallbackRes.data || [];
    }
  } catch (err) {
    console.error("Error fetching tracker leads:", err);
  }

  return (
    <ProjectTrackerClient
      user={{ id: user.id, email: user.email }}
      profile={profile || null}
      leads={(leads as CustomerLead[]) || []}
    />
  );
}
