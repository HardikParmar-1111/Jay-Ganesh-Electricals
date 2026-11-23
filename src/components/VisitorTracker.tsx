"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { logSiteVisit } from "@/app/actions/analytics";

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double logging the exact same path in the same session turn
    if (lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    try {
      let visitorId = localStorage.getItem("jg_visitor_id");
      if (!visitorId) {
        visitorId =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("jg_visitor_id", visitorId);
      }

      // Check session throttle: log only once per 10 minutes per path to keep stats accurate
      const sessionKey = `jg_visit_${pathname}`;
      const lastVisitTime = sessionStorage.getItem(sessionKey);
      const now = Date.now();

      if (!lastVisitTime || now - parseInt(lastVisitTime, 10) > 10 * 60 * 1000) {
        sessionStorage.setItem(sessionKey, now.toString());
        logSiteVisit(pathname, visitorId);
      }
    } catch {
      // Gracefully handle any browser storage restrictions
    }
  }, [pathname]);

  return null;
}

export default VisitorTracker;
