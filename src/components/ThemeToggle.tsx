"use client";

import * as React from "react";
import { DayNightToggle } from "@/components/DayNightToggle";

export function ThemeToggle({ className = "" }: { className?: string }) {
  return <DayNightToggle className={className} />;
}

export default ThemeToggle;
