"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface SubmitQuoteInput {
  propertySize: string;
  servicesNeeded: string[];
  qualityTier: string;
}

export interface SubmitQuoteResult {
  success?: boolean;
  leadId?: string;
  error?: string | null;
  requiresAuth?: boolean;
}

export async function submitQuote(
  input: SubmitQuoteInput
): Promise<SubmitQuoteResult> {
  const supabase = await createClient();

  // Verify authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Please sign in or create an account to save your customized estimate and track project milestones.",
      requiresAuth: true,
    };
  }

  const servicesString = input.servicesNeeded.join(", ");

  const { data, error } = await supabase
    .from("customer_leads")
    .insert({
      user_id: user.id,
      property_size: input.propertySize,
      services_needed: servicesString,
      quality_tier: input.qualityTier,
      status: "new",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/customer/dashboard");
  revalidatePath("/admin/dashboard");

  return {
    success: true,
    leadId: data.id,
  };
}
