"use server";

import { createClient } from "@/utils/supabase/server";

export async function logSiteVisit(path: string, visitorId: string) {
  try {
    const supabase = await createClient();
    await supabase.from("site_visits").insert({
      page_path: path || "/",
      visitor_id: visitorId,
    });
    return { success: true };
  } catch (err) {
    // Fail silently so visitor experience is never interrupted
    return { success: false };
  }
}
