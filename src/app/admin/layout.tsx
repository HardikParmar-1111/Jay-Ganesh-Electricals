import React from "react";
import { AdminNavbar } from "@/components/AdminNavbar";

export const metadata = {
  title: "Admin Control Center | Jay Ganesh Electrical",
  description: "Administrative panel for managing leads, inventory, and projects.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <AdminNavbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
