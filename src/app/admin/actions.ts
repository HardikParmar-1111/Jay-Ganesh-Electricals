"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type LeadStatus = "new" | "in_progress" | "completed";

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  // Verify authentication & Admin privilege
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Authentication required." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { error: "Access denied: Administrator privileges required." };
  }

  const { error } = await supabase
    .from("customer_leads")
    .update({ status })
    .eq("id", leadId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/customer/dashboard");

  return { success: true };
}
