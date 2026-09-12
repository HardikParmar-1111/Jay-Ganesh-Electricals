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
  revalidatePath("/tracker");

  return { success: true };
}

export interface CreateCatalogItemInput {
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl?: string;
}

export async function createCatalogItem(
  input: CreateCatalogItemInput
): Promise<{ success?: boolean; error?: string; item?: any }> {
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

  if (!input.name?.trim()) {
    return { error: "Item name is required." };
  }

  if (!input.category?.trim()) {
    return { error: "Category is required." };
  }

  if (input.price === undefined || input.price === null || isNaN(Number(input.price)) || Number(input.price) < 0) {
    return { error: "A valid positive price is required." };
  }

  const { data, error } = await supabase
    .from("catalog_items")
    .insert({
      name: input.name.trim(),
      category: input.category.trim(),
      price: Number(input.price),
      description: input.description?.trim() || "",
      image_url: input.imageUrl?.trim() || "",
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/catalog");
  revalidatePath("/customer/dashboard");
  revalidatePath("/");

  return { success: true, item: data };
}

export async function updateCatalogItemImage(
  itemId: string,
  imageUrl: string
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
    .from("catalog_items")
    .update({ image_url: imageUrl })
    .eq("id", itemId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/image-manager");
  revalidatePath("/admin/dashboard");
  revalidatePath("/catalog");
  revalidatePath("/");

  return { success: true };
}


